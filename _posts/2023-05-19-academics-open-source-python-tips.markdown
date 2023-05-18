---
layout: post
title: "Academics: You're Doing Open Source Wrong"
date: 2023-05-19
---

I recently went from working as a software engineer to starting a PhD in Computer Science. One of the biggest shocks to me in this transition is the apalling state of code that's released by academics when they publish research papers. Usually when I complain about academic code, people think I'm just talking about code quality being poor (which it is), but it's much deeper than that. If code is packed properly and works as advertised, nobody cares about the code quality. Instead, the way code is open-sourced in most academic papers is typically completely broken, and shows a deep misunderstanding about what code is for, and what open-source is about.

In this post, I'll go over what I view as the problem, and share tips for academics on how to do a better job of open-sourcing their code. I'll be focusing on Python, as that's mainly what's used in AI research, but a lot of this will apply to other languages as well.

## The problematic academic mindset

Most code I encounter that's released as part of academic papers is completely broken, as in it's not possible to run the code as provided at all. This is typically due to things like missing files the researcher forgot to upload, or hardcoded file paths to stuff on the researcher's own machine, missing documentation, or not pining Python dependency versions. This shows that the researcher never even tried running the code they open-sourced at all, and instead just copied and pasted some files from their local hard-drive into a Github repo, linked the repo in their paper, and high-fived everyone for a job well done. There is no notion that other people are going want to actually try to run that code, and that by uploading broken code and advertising it in a paper you are directly wasting thousands of hours of other people's time.

Academics are not bad people, and I don't believe they're intentionally being malicious. Instead, I think the mindset of most researchers towards open-source code is the following:

- Putting Python files in a Github repo is just a way to make a paper seem more legit, since if there's code then people will believe the results more
- Code is just for looking at to get an idea of how something is implemented, not for running

This is not just cruel to the people who try to use code written by academics, but also a huge missed opportunity. The times when academic code is open-sourced well and is packaged as an easy-to-use library, the corresponding paper gets tons of citations as other researchers use the library in their own work. Doing a decent job open-sourcing code is easy, as you'll see below, and the potential rewards to the researcher are immense.

## Release a library, not a collection of files

The core issue with the academic mindset to open-sourcing code is that it completely misses what people want to do with code after reading a paper. Your code should focus on actually doing what your paper is about, not just reproducing the results in the paper. Of course, there's nothing wrong with including the code that reproduces your results, it just should not be the main focus. Ideally, your goal should be to release a _library_ which does the thing in your paper, not a pile of random Python files.

For instance, imagine you need to do dog picture classification, and after some searching you find that the state-of-the-art for dog classification is a technique called "DogBert". After reading the paper, you find they open-sourced their code. "Great!, I'll just used that," you think. However, when you get to the DogBert github repo, you find that you need to clone their git repo, and they have some Python scripts which just reproduce the numbers in their paper. "Ugh, well, maybe I can repurpose this", you think, and struggle with it for several hours being giving up, frustrated, and just use another library that's not as high performance, but at least it works. DogBert's broken code has just caused you to waste a whole day, and you're not happy.

Now imagine, instead, that when you get to the DogBert git repo, you find you can install the library with `pip install dogbert`. Then, to use it you just run:

```python
from dogbert import dogbert_classify_img

dog_type = dogbert_classify_img('/path/to/img')
```

You install the library, use that code, and you're happily classifying dog images with the pretrained dogbert model in no time. In addition, when you publish a paper on your work, you'll cite DogBert since you're using it in your code. Everybody wins!

The idea of releasing a "library" rather than just copy/pasting Python files into Github might sound daunting, but it's really not difficult. The difference is mostly a code organization question more than anything else, and some basic thought put to "what would someone want to do with this code?". Once you've learned to package code into a library you'll see that doing a decent job of open-sourcing your code is _easy_ - it's far easier than learning LaTeX, or writng a paper, or finding a research idea to begin with.

## ProTip: Poetry

Personally, I like using [Poetry](https://python-poetry.org/) for managing Python projects. Poetry handles a lot of the complexity of virtual environments for Python, dependency management, and finally, publishing your library to PyPI so it can be installed with `pip install <your-library>`. Poetry isn't the only way to do this, but it provides a good foundation.
