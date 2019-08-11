---
layout: post
title: "Bulding an auto-updating CDN for Free with GitHub, CircleCI, and JsDelivr"
date: 2019-08-11
---

The tech ecosystem has some incredible tools that you can leverage to do some incredible things completely for free. I'm going to talk about how you can use a public GitHub repo as a base, update its content daily with a cronjob running on [CircleCI](https://circleci.com), and then serve the repo contents globally using the [JsDelivr CDN](jsdelivr.com). To demonstrate this, I'll walk through how I build an auto-updating version of the [Gun Violence Archive](https://www.gunviolencearchive.org) dataset that's distributed as a JSON file on JsDelivr. If you want to see the end result, the [GitHub repo is here](https://github.com/chanind/gun-violence-archive-data), and the [JsDelivr CDN JSON file is here](https://cdn.jsdelivr.net/gh/chanind/gun-violence-archive-data@master/mass_shootings.json).

I recently stumbled on the amazing [Gun Violence Archive](https://www.gunviolencearchive.org), which is an organization the chronicles gun violence and mass shootings in the US. The organization publishes their data freely on their website, but it's not provided in a format that can be easily plugged into an existing application. To keep up to date, you'd need to go their website every day and download a new version of their reports. Fortunately, it's not hard to automate this process and make the results available as a JSON file.

The first task was to set up a GitHub repo to store the reports from Gun Violence Archive. Once the repo was set up, the next step was to write a script that can pull down the data from the archive and store it in a JSON file that can be saved in our repo. This was easy enough to do using Python and [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/). The finished script is in the repo [here](https://github.com/chanind/gun-violence-archive-data/blob/master/scripts/update_data.py) Once the script was working, the next step was to get it to run on a cronjob and push the results back into our GitHub repo every day.

### Updating Data on a CircleCI Cron

Normally, running a cron job would require setting up a server or something similar which isn't free. However, [CircleCI](https://circleci.com) allows you to run a single worker for free, which is plenty to run a small nightly cron, and connecting CircleCI to GitHub is a breeze. Setting up our script to run on a nightly cron was as easy as adding the following to [.circleci/config.yml](https://github.com/chanind/gun-violence-archive-data/blob/master/.circleci/config.yml) in our repo:

```yaml
version: 2.1

jobs:
  update_data:
    docker:
      - image: circleci/python:3.6.4
    steps:
      - checkout
      - run:
          name: Install dependencies
          command: |
            python3 -m venv venv
            . venv/bin/activate
            pip install -r scripts/requirements.txt
      - run:
          name: Update data
          command: |
            . venv/bin/activate
            python scripts/update_data.py
      - run:
          name: Commit data back to Github
          command: |
            git config user.email "<your email>"
            git config user.name "<your git username>"
            DATE_TODAY=$(date +"%Y-%m-%d")
            git pull origin master
            git commit -am "[skip ci] Updating Data ${DATE_TODAY}" --allow-empty
            git push origin master

workflows:
  daily_data_update:
    triggers:
      - schedule:
          cron: "0 0 * * *"
          filters:
            branches:
              only:
                - master
    jobs:
      - update_data
```

In the above config, we define a job that sets up python, installs dependencies, runs the script, and then commits the result back to GitHub. Then, we define the cron, which follows a standard cron format. The cron in this job runs every day at midnight.

The only tricky part of getting this set up was giving CircleCI permission to commit back to GitHub, but [CircleCI has documentation on that](https://support.circleci.com/hc/en-us/articles/360018860473-How-to-push-a-commit-back-to-the-same-repository-as-part-of-the-CircleCI-job). Aside from that it's just a standard CircleCI config with the job running on a cron.

### Serving the Data with JsDelivr

[JsDelivr](jsdelivr.com) has an amazing feature which is that any public GitHub repo is already distributable on the CDN with no config at all! For every public repo on GitHub, the contents of the repo are available on JsDelivr at `https://cdn.jsdelivr.net/gh/<user>/<repo>/path/to/file`. So, once our GitHub repo is set up and auto-updating, we already have the contents available on a world-class global CDN, all for free, and all without any setup! In the our case, that means the auto-updating JSON file containing Gun Violence Archive's data is instantly available at [https://cdn.jsdelivr.net/gh/chanind/gun-violence-archive-data/mass_shootings.json](https://cdn.jsdelivr.net/gh/chanind/gun-violence-archive-data@master/mass_shootings.json).

And that's all it takes! Just like that you have content that updates on a cron, served globally on a world-class CDN, all for free!