---
layout: post
title: "Auto-matching hidden layers in Pytorch LLMs"
date: 2024-02-19
categories: AI
---

<span class="gray">_Note: This is cross-posted on [LessWrong](https://www.lesswrong.com/posts/MhFDxivjJrvZ2DMxw/auto-matching-hidden-layers-in-pytorch-llms?utm_campaign=post_share&utm_source=link)._</span>

Mechanistic interpretability and steering LLMs requires being able to read and modify activations during inference. For instance, to [apply steering vectors](https://arxiv.org/abs/2312.06681) to control model generation, we need to first collect hidden activations to find a steering direction, then intervene by modifying hidden activations of the model during inference.

To read and patch activations from a LLM, you first need to find the relevant layers that you care about and either add hooks or wrap them. This tends to lead to two approaches, either 1. writing a custom model wrapper for every model you might want to work with (approach taken by [Repe](https://github.com/andyzoujm/representation-engineering), [CAA](https://github.com/nrimsky/CAA)) or 2. leave it to the user to manually specify layer names to patch, and apply the patch using Pytorch hooks (approach taken by [Baukit](https://github.com/davidbau/baukit)). The first approach is a never-ending battle as new models are released, and the second approach, while very flexible, passes on the complexity to anyone using what you've written.

In this post, I'll discuss a third option, which is to auto-detect the types of layers in a Pytorch LLM and read/patch using Pytorch hooks, and is the approach used by the steering-vectors library. This leverages the fact that all transformer LMs have the same basic structure: a series of layers containing attention and MLP blocks. This post assumes the model is from Huggingface, although this same technique will likely work with any transformer LM that's sanely constructed. This post will use the terms "transformer LM" and "LLM" interchangeably to refer to a decoder-only generative language model like GPT or LLaMa.

## Guessing layer templates

Finding the component parts of any Pytorch module is easy by calling `named_modules()` on the model. This will return a dictionary containing the name of the submodule, and the submodule itself. This is demonstrated for GPT2-small below:

```python
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("gpt2")
print(dict(model.named_modules()).keys())

# transformer
# transformer.wte
# transformer.wpe
# transformer.drop
# transformer.h
# transformer.h.0
# transformer.h.0.ln_1
# transformer.h.0.attn
# transformer.h.0.attn.c_attn
# transformer.h.0.attn.c_proj
# transformer.h.0.attn.attn_dropout
# transformer.h.0.attn.resid_dropout
# transformer.h.0.ln_2
# transformer.h.0.mlp
# transformer.h.0.mlp.c_fc
# transformer.h.0.mlp.c_proj
# transformer.h.0.mlp.act
# transformer.h.0.mlp.dropout
# ...
# transformer.h.11
# transformer.h.11.ln_1
# transformer.h.11.attn
# transformer.h.11.attn.c_attn
# transformer.h.11.attn.c_proj
# transformer.h.11.attn.attn_dropout
# transformer.h.11.attn.resid_dropout
# transformer.h.11.ln_2
# transformer.h.11.mlp
# transformer.h.11.mlp.c_fc
# transformer.h.11.mlp.c_proj
# transformer.h.11.mlp.act
# transformer.h.11.mlp.dropout
# transformer.ln_f
# lm_head
```

Here, it's clear that the 12 decoder block layers of the model are of the form `transformer.h.{num}`, the attention layers are `transformer.h.{num}.attn`, and the MLP layers are `transformer.h.{num}.mlp`. It's similarly easy to see the input and ouput layer norms and dropout.

For LLaMa, the layers are of the form `model.layers.{num}` for each decoder block, `model.layers.{num}.self_attn` for attention, and `model.layers.{num}.mlp` for the MLP layers. For Pythia, the decoder block, attention and MLP layers are of the form `gpt_neox.layers.{num}`, `gpt_neox.layers.{num}.attention`, and `gpt_neox.layers.{num}.mlp`, respectively.

This hints at a simple rule to find relevant layer names in any transformer LM - simply look for the shortest template string of the form `*.{num}*` which also contains any other terms you might care about. For instance, for attention layers, looking for the shortest template that contains either "attn" or "attention" should cover nearly all LLMs. Likewise, looking for the shortest template with "mlp" should get the MLP layers in nearly all cases. We can generalize this in code below:

```python
import re
from collections import defaultdict

# look for layers of the form "*.{num}"
LAYER_GUESS_RE = r"^([^\d]+)\.([\d]+)(.*)$"

def guess_matcher_from_layers(model, filter = None) -> str | None:
    counts_by_guess: dict[str, int] = defaultdict(int)
    for layer in dict(model.named_modules()).keys():
        if re.match(LAYER_GUESS_RE, layer):
            guess = re.sub(LAYER_GUESS_RE, r"\1.{num}\3", layer)
            if filter is None or filter(guess):
                counts_by_guess[guess] += 1
    if len(counts_by_guess) == 0:
        return None

    # score is higher for guesses that match more often, are and shorter in length
    guess_scores = [
        (guess, count + 1 / len(guess)) for guess, count in counts_by_guess.items()
    ]
    return max(guess_scores, key=lambda x: x[1])[0]
```

Then we can find a layer matcher template for the base decoder block, attention, and MLP layers for a model like below:

```python
model = AutoModelForCausalLM.from_pretrained("gpt2")

guess_matcher_from_layers(model)
# "transformer.h.{num}"

guess_matcher_from_layers(model, lambda l: "attn" in l or "attention" in l)
# "transformer.h.{num}.self_attn

guess_matcher_from_layers(model, lambda l: "mlp" in l)
# "transformer.h.{num}.mlp
```

This code will also successfully guess the corresponding layer templates for LLaMa, Pythia, and any other transformer LM.

Extracting layers using a layer template
Now that we have a layer template string for each of the types of layers we care about, we just need a way to specify a layer number and get back the corresponding submodule to patch. Fortunately, we already have everything we need to do this. The `named_modules()` method of Pytorch modules gives use everything we need. First, lets start by finding all the numbered layers in the model which match a given template string:

```python
def collect_matching_layers(model, layer_matcher) -> list[str]:
    all_layer_names = set(dict(model.named_modules()).keys())
    matching_layers = []
    for layer_num in range(len(all_layer_names)):
        layer_name = layer_matcher.format(num=layer_num)
        if layer_name in all_layer_names:
            matching_layers.append(layer_name)
        else:
            break
    return matching_layers
```

If we run this function on GPT2 with the decoder block layer matcher (`transformer.h.{num}`), we'll get back an ordered list of all matching layers: `transformer.h.0`, `transformer.h.1`, etc...

Once we have this list, it's trivial to select any layer number from it, and again, use `named_modules()` to get back the actual Pytorch module corresponding to that layer:

```python
model = AutoModelForCausalLM.from_pretrained("gpt2")
layer_matcher = guess_matcher_from_layers(model) # "transformer.h.{num}"
modules_by_name = dict(model.named_modules())

layer_names = collect_matching_layers(model, layer_matcher)

# layer 2
layer2 = modules_by_name[layer_names[2]]

# layer 7
layer7 = modules_by_name[layer_names[7]]
Add hooks and profit
We now have a way to automatically find and extract all the relevant layers from a Pytorch LLM. The next step is to add Pytorch hooks to read or modify activations.

# add a hook to layer2 and layer7 from above

def do_something_cool(module, args, output):
	# save or modify the layer output
	...

for layer in [layer2, layer7]:
	layer.register_module_forward_hook(do_something_cool)
```

... and that's all there is to it! To see this in action, check out [layer_matching.py](https://github.com/steering-vectors/steering-vectors/blob/main/steering_vectors/layer_matching.py) in the [steering_vectors library](https://github.com/steering-vectors/steering-vectors).
