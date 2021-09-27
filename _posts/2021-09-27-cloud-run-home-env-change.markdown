---
layout: post
title: "Cloud Run Quietly Swaps HOME env var in Docker"
date: 2021-09-27
---

I generally love Cloud Run - I use it to host a lot of my side projects and demos that won't receive a lot of traffic, but that still need a big server to run on. However, I recently ran into a frustrating bug when using pretrained Huggingface ML models in a Docker image. During the Docker build step, I download the Huggingface model using the Huggingface auto-downloader so that it doesn't need to download a massive 1GB model file every time the Docker image starts up.

This all works fine locally when I build and run the Docker image locally, and it likewise builds and runs fine on Cloud Run as well. However, when I looked into the Cloud Run logs I noticed that it was redownloading the full model every time it started up, seemingly ignoring the fact that the it already had downloaded and cached it during the build step. This was adding a big delay to startup as well as a large amount of bandwidth on every startup!

After a few hours of tearing my hair out, when I was beginning to question my sanity, I noticed that the ENV variables that were set in Docker when it was run in Cloud Run were ever-so-slightly different from what they were when I run Docker locally. Specifically, Cloud Run sets `HOME=/home` when running the docker image, but `HOME=/root` when building. On local docker, `HOME=/root` is set for the entire time. It's extremely bizarre, and I couldn't find much info on this behavior aside from a [Stack Overflow post](https://stackoverflow.com/questions/62276734/google-cloud-run-changes-home-to-home-for-cmd-where-run-uses-root) noting this.

As it turns out, Huggingface caches downloaded models under the `~/.cache/` dir. During the Docker build step that corresponds to `~/root/.cache`, but on Cloud Run during execution, it corresponds to `~/home/.cache`, which of course won't have any model in it. To fix this, I just set: `ENV HOME=/home` in the Dockerfile before it downloads the model, so that `~/.cache` is always `~/home/.cache` no matter whether it's run in Cloud Run or anywhere else.

Hopefully this post saves someone else from having to debug this in the future!
