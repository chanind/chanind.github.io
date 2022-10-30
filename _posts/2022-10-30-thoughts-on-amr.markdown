---
layout: post
title: "Initial Thoughts on Abstract Meaning Representation (AMR)"
date: 2022-10-30
categories: amr
---

I'm interested in extracting meaning from text in a form that can be reasoned over by computers, and was thus really excited when I stumbled on [Abstract Meaning Representation](https://amr.isi.edu/) (AMR). AMR is a really cool idea. It parses sententes into a tree structure based around [semantic frames](<https://en.wikipedia.org/wiki/Frame_semantics_(linguistics)>) while extracting out numbers and dates into a structured format within the tree. It feels like it combines the meaning extraction power of semantic frames with the tree structure of a [dependency parse](<https://en.wikipedia.org/wiki/Syntactic_parsing_(computational_linguistics)#Dependency_parsing>).

Below is a sample of how the AMR looks for the sentence `The boy must not go`:

```
(o / obligate-01
    :ARG2 (g / go-02
        :ARG0 (b / boy)
        :polarity -))
```

Here, the "not" from "must not go" is extracted as the `:polarity -` attribute, which is helpfully machine-readable. [obligate-01](https://propbank.github.io/v3.4.0/frames/alias-obligate.html#obligate) is a semantic frame from Propbank, as is [go-02](https://propbank.github.io/v3.4.0/frames/go.html). AMR strips away the tense of verbs and ideally results in sentences with the same meaning having the same AMR representation. AMR is also English-only, as the semantic frames correspond to Engish, but there are projects for AMR for other languages as well.

## AMR Parsers

Ideas like AMR are only as useful as the ecosystem around them. The most important parts of that ecosystem are parsers that can take a natural language sentence and return a representation of the sentence in AMR format. Here, there's state-of-the-art work done by IBM with their [Transition AMR Parser](https://github.com/IBM/transition-amr-parser). This parser had the best parsing results when I played around with it, and it even returns alignments so you can map each token in the AMR back to the original sentence! However, it's also extremely difficult to get to work due to it having finicky requirements, not being packaged in PyPi, and requires emailing someone at IBM to get acces to a pretrained checkpoint.

Sapienza University also has an open-source parser called [Spring](https://github.com/SapienzaNLP/spring). This is easier to get working since it just uses Huggingface internally which is very standard, and the pretrained model checkpoints are publicly available. However, like IBM's parser, this is research code which isn't properly packaged on PyPi, and isn't really documented. So, using it in your own code requires reading through their source code.

Finally, there's [Amrlib](https://amrlib.readthedocs.io/en/latest/). Amrlib is a true joy to use. It's simple to set up, and even integrates with [Spacy](https://spacy.io/)! However, Amrlib seems to be the least accurate of the parsers I experimented with. Still, its ease of use makes it definitely worth it for something that just works. Hopefully the parsers from IBM and Sapienza can learn from Amrlib's usability.

## AMR's weakness: closed datasets and closed tools

All of the parsers discussed above suffer from the same core problem: lack of diverse, freely-available AMR training data in large quantity. This is an unfortunate problem which I feel holds back AMR from reaching its true potential. The largest AMR training data set, which all the parsers mentioned above train on, is the offical [AMR Corpus](https://catalog.ldc.upenn.edu/LDC2020T02). This corpus contains 59,255 AMR-annotated sentences, which is significant but still tiny compared to the amount of data modern NLP systems are trained on. Furthermore, this dataset is not freely available - it requires paying $300 just to access it! This is almost certainly discouraging innovation in the AMR space by setting such a huge financial bar to even experiment with the data.

This wouldn't be so bad if tools to create more high-quality annotated AMR training data were readily available. However, here, too, the only AMR editor that I could find, the official [AMR Editor](https://amr.isi.edu/editor.html), is closed-source and outdated. According to the editor page, it's estimated it takes 10 minutes just to annotate a single sentence with the tool! I could imagine this editor could be improved if it were open-source so the community could contribute, or if another person in the community could create and open-source a high-quaity AMR editor.

## Moving AMR forward

I feel like AMR has so much potential. The core idea is simple yet powerful, and it feels like a natural way to parse a sentence for semantic meaning. The number of research papers still being written on AMR shows that there's a lot of other people who can see the power of AMR as well. It's just too bad that the closed, paywalled nature of the training data and the closed-source editor hinder AMR from reaching its full potential. Hopefully the community will address these issues in the future!
