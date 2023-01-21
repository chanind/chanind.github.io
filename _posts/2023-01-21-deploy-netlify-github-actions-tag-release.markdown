---
layout: post
title: "Deploying to Netlify on Release Tags with Github Actions"
date: 2023-01-21
---

I recently had to set up a workflow where tagging a release on Github would trigger a deploy to production on Netlify. This turned out to be less straightforward than I expected originally, but I think the solution to make this work is functional and elegant. The idea is as follows:

- Create an intermediate branch called `release`. Whatever is in the branch will deploy to Netlify
- Set up a Github Action which runs on tags and points the `release` branch at the most recent tag
- Set up Netlify to deploy production from the `release` branch

We'll discuss the rationale behind this and go through how to do this in more detail below.

## Why not just directly deploy release tags to Netlify?

Sadly, direcly pushing tags to Netlify is tricky for a few reasons. First, [Netlify doesn't support building on tags](https://answers.netlify.com/t/deploy-on-git-tags-only/43759/3), which would be the most obvious way to get this to work. Next, you may think, why not have Github actions run the app build and push to Netlify? This would work, but [Netlify doesn't allow creation of scoped API tokens](https://github.com/netlify/open-api/issues/168), so any API token you generate will have access to everything in your Netlify account, not just the app you're trying to deploy. You can get around this by creating a new Netlify account which only has access to the single app you want to deploy, but Netlify charges for every account that can access the project.

In addition, deploying directly on a tag makes it hard to implement hotfix workflows, where you may have code in your `main` or `master` branch that isn't ready to go to production, but you need to release a fix ASAP. It's possible to get around this by checking out the latest release into its own branch, adding a fix, and then releasing that, but it's an annoying process. Using a `release` branch as an intermediary means you can also just treat it as a normal branch and push hotfixes directly to that branch in an emergency.

## OK, how do I set this up?

First, create a branch in your Github repo called `release`.

Next, create the Github Action which will point the `release` branch at a tag whenever a new tag is created. This is done by creating a workflow file in your repo in the folder `.github/workflows/`. In the example below, we name our workflow file `release.yml`.

```yaml
# .github/workflows/release.yml
name: release
on:
  push:
    tags:
      - "v*"
jobs:
  deploy_releases:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          ref: release
      # Point release branch at the latest tag so Netlify can deploy it
      - name: Point release branch at tag
        run: |
          echo "Setting 'release' branch to 'tags/${{ github.ref_name }}'"
          git checkout release
          git reset --hard tags/${{ github.ref_name }}
          git push -f
```

This workflow will run on any tag that starts with a `v`, assuming your releases are named like `v1.2.3` for `v17`. If you want this to run on a different tag, or on all tags, just modify the `- "v*"` line in the workflow above to the pattern you'd like. Once you push this file to your repo the github side of things is good to go!

Finally, you just need to change the deploy branch for your netlify site to deploy to the `release` branch instead of the default `main` or `master`. You can find this setting in Netlify at "Site settings" → "Build & deploy" → "Branches and deploy contexts" → "Production branch".

And that's it! You're now set up to deploy to production in Netlify on Git release tags.
