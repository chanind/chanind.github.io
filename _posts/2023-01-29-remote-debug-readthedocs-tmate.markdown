---
layout: post
title: "Remote debugging Readthedocs builds with tmate"
date: 2023-01-29
---

I recently ported a library I built, [tensor-theorem-prover](https://github.com/chanind/tensor-theorem-prover), from being a pure Python library to being a hybrid Python/Rust library using [PyO3](https://pyo3.rs/). Despite my being a beginner with Rust, it resulted in a nearly 20x speedup over the old pure Python implementation! However, it also broke the Readthedocs build for hosting the docs for the project. In the process of debugging this, I found a (very hacky) way to connect to a running Readthedocs build which made resolving my issue much easier, but I suspect it will be useful for anyone who's struggling to debug builds on Readthedocs.

<div>
    <img src="/assets/rtd_fail.png" />
</div>
<i class="small gray">A fun way to spend a Saturday</i>

The specific error for my build was that Sphinx was throwing an `ImportError` whenever it tried to import the Python code with Rust bindings, despite everything working when I tested locally, and Readthedocs even being able to build the actual Python/Rust package without issue. After several hours of pushing a change to try to fix the build, waiting 5 minutes for the build to finish, see it fail, then repeat, I got frustrated and decided to just see if I can somehow ssh into the live build and debug it directly there.

I remembed the Github Action [actions-tmate](https://github.com/mxschmitt/action-tmate) which provides exactly this functionality in Github using [tmate](https://tmate.io/), so figured it might work for Readthedocs too. However, there are several impediments to this working easily in Readthedocs. Specifically:

- Readthedocs doesn't output the results of a command until the command has finished running, so you can't see the SSH command output by `tmate -F` in the build output in order to connect.
- Running `tmate` in the background also doesn't work, I suspect Readthedocs must kill processes between commands or something

Fortunately, tmate lets you set up webhooks which it calls whenever it starts up a session, and contains all the info needed to connect! Combining this with [ngrok](https://ngrok.com/) makes it possible to get notified via webhook when the session starts so you can ssh in and debug to your heart's desire.

The full steps to get this working are laid out below.

### 1. Set up and run ngrok on your local computer

Grab a copy of ngrok for your local machine from [https://ngrok.com](https://ngrok.com) or via your package manager of choice. Start it up with `ngrok http 5000` (the port doesn't really matter much), and you should see an ouput like below.

<div>
    <img src="/assets/ngrok.png" />
</div>

Keep note of the URL, which in the example above is "https://ed59-81-107-232-184.eu.ngrok.io" for the next step.

### 2. Add the ngrok URL as an environment variable in Readthedocs

In the Readthedocs UI for your project, go to "Admin" then "Environment Variables" and add a new environment variable. The name should be "WEBHOOK", and the value is the ngrok URL from step 1.

### 3. Set up your .readthedocs.yml

You can customize your Readthedocs build using a `.readthedocs.yml` file in your Git repo. To set up tmate and remote debugging, configure your `.readthedocs.yml` to look like the example below. This will install tmate, configure it to use your ngrok URL as a webhook, and begin running tmate during the build.

```yml
build:
  os: ubuntu-22.04
  apt_packages:
    - tmate
  jobs:
    post_install:
      - echo "set-option -g tmate-webhook-url '${WEBHOOK}'" >> ~/.tmate.conf
      - tmate -F
```

Commit this change to your git repo so that Readthedocs starts building.

### 4. Monitor for the webhook at http://127.0.0.1:4000

Ngrok lets you see all incoming requests via a locally running web interface. Open you your web browser to `http://127.0.0.1:4000` and keep an eye out for the webhook from Readthedocs, which should show up as a `POST /` with a `403 Forbidden` response, since we're not actually returning anything. We just want to see the info that got posted in the JSON

### 5. SSH into the running Readthedocs build

Once a webhook comes in, find the fields `ssh_cmd_format` and `stoken`. The `ssh_cmd_format` field should look something like `ssh %s@nyc1.tmate.io`, and gthe `stoken` field should look like a random string of characters.

<div >
    <img src="/assets/ngrok_webhook_data.png" />
</div>
<i class="small gray">An example of what the webhook data looks like in the local ngrok UI, with the `ssh_cmd_format` and `stoken` fields highligted</i>

Just replace the `%s` in the `ssh_cmd_format` with the value in `stoken`, and copy / paste the command into a terminal on your local computer and run it.

### 6. Fist pump!

You should now have a working tmate terminal into your running Readthedocs build. Hopefully it should be a breeze to debug from there!

In my case, I solved my docs build bug about 5 minutes after getting this working. In case it's useful to anyone else with the same issue with hybrid Rust/Python apps, the solution was to delete the main module folder containing Python code (`tensor_theorem_prover` in my case) after running `pip install .`. I don't fully understand why this works, but it seems like somehow Python was finding the local folder rather than the compiled wheel with the rust code in it, and deleting the local module folder forced it to find the compiled module instead. ¯\\_(ツ)_/¯

Hopefully this technique is helpful if you're ever stuck debugging Readthedocs builds.

### Happy debugging!
