---
layout: post
title: "Running Jupyter Notebooks in Grid Engine with Ngrok"
date: 2022-10-31
categories: python
---

A lot of universities use [Oracle Grid Engine](https://en.wikipedia.org/wiki/Oracle_Grid_Engine) (aka Sun Grid Engine, or SGE) for high-performance computing. This system lets you submit jobs requesting varying amounts of CPUs, GPUs, and memory to run machine learning (ML) and other compute-intensive tasks. This is great for when you've built a pipeline to train a ML model and just need a lot of power to run the training, but is awkward for experimentation and development since you're just given a command prompt.

On the other end of the development cycle, there's [Jupyter](https://jupyter.org/), which lets you write Python code in an interactive notebook, mixing text and images in with executable code. Development and experimentation in Jupyter is a joy since you can easily print interactive tables with data to the screen, or draw images, output interactive tensorboards - basically anything that can be displayed in a web browser can be turned into a Jupyter widget. If we can combine Jupyter with Grid Engine we can get the power of Grid Engine with the development ease of Jupyter.

The issue is that usually Grid Engine jobs don't have ports open to the outside or directly allow ssh access to the running job, so running Jupyter inside of a Grid Engine session is difficult. Fortunately that's where [Ngrok](https://ngrok.com/) comes in. Ngrok is a tool which can forward a service running on a local machine and give you a web URL where you can access that service from the internet. This is perfect since it solves the problem of letting you easily access a Jupyter notebook that's running inside of a Grid Engine session.

## Initial setup

First, sign up for a free Ngrok account at [ngrok.com](https://ngrok.com). After you sign in, find the link to download the ngrok client for Linux and copy the URL of this link.

Next, ssh into Grid Engine and install ngrok in your home directory. This should look something like below:

```bash
# paste the linux download URL for ngrok here, it may be different than what's below
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar -xvzpf ngrok-v3-stable-linux-amd64.tgz
```

At this point, you should have an executable called `ngrok` in your home directory.

Next, copy your auth token from the ngrok website (it should be a long pseudo-random string like `c8132179a3cE725B4e267_51F32179C3eE725B4E267`) and run the following command:

```bash
./ngrok config add-authtoken <your token here>
```

At this point, ngrok should be good to go! Next just make sure you have jupyter installed with:

```bash
pip install notebook
```

Since the notebook will be accessed on the web, you'll need to modify the notebook config to allow remote connections. First, ensure you have a jupyter config available by running the following:

```bash
jupyter notebook --generate-config
```

This will generate a config file in your home directory, which should be located at `~/.jupyter/jupyter_notebook_config.py`. Run the following command to update this config file and allow remote access:

```bash
echo "c.NotebookApp.allow_remote_access = True" >> ~/.jupyter/jupyter_notebook_config.py
```

It's a good idea to set a password for jupyter since we're going to make it accessible on the internet, and you don't want random strangers on the internet to be able to run code in your notebook if they stumble on the URL somehow.

```bash
jupyter notebook password
```

## Running Jupyter + Ngrok in an interactive session

Next, start an interactive session in Grid Engine, something like the following:

```bash
qrsh -l tmem=10G,h_rt=2:00:00,gpu=true -now no -verbose
```

Once your session has started, you need to run both ngrok and Jupyter on the same port. The specific port number doesn't matter much - you just don't want to pick a number that someone else on the same machine might also be using. Below I'm using port 7923, but change this to whatever number you prefer (numbers in the 7000-9999 range tend to be good choices).

```
(trap 'kill 0' SIGINT; jupyter notebook --no-browser --port 7923 &
~/ngrok http 7923 --log=stdout)
```

The command above just runs jupyter and ngrok in parallel, and kills them both when you exit the shell.

Now, ngrok should display a URL on the screen (something like `https://aba4-128-90-27-382.eu.ngrok.io`) which you can open up in your browser, and, voila, you should see your jupyter notebook running inside of your Grid Engine interactive shell! And that's it, you've got Jupyter running inside of Grid Engine.

## Running Jupyter + Ngrok in a SGE job

You can of course run the same commands as a standalone SGE job which you submit with `qsub`. Copy the script below and save it as `remote_jupyter.qsub.sh`. Tweak the parameters as needed to suit your use case.

```bash
#$ -l mem=10G
#$ -l h_rt=24:0:0
#$ -S /bin/bash
#$ -N remote-jupyter

set -e

# pick a port at random between 7001-7999
PORT=`shuf -i 7001-7999 -n 1`
echo "Starting Jupyter and tunnel on port ${PORT}"

# run jupyter in the background and ngrok in the foreground
# connect to the URL that ngrok outputs to the terminal
(trap 'kill 0' SIGINT; jupyter notebook --no-browser --port ${PORT} &
~/ngrok http ${PORT} --log=stdout)
```

Then, submit the job as usual with `qsub remote_jupyter.qsub.sh`. When the job runs, you'll be able to find the URL of the ngrok session in the logs, or you can check the ngrok web interface at [ngrok.com](https://ngrok.com) and click "tunnels" to find your jupyter notebook.

## Acknowledgements

This post takes a lot of inspiration and ideas from [Khuyen Tran's blog post](https://towardsdatascience.com/how-to-share-your-jupyter-notebook-in-3-lines-of-code-with-ngrok-bfe1495a9c0c). Thanks, Khuyen!

If you have any improvements to this technique, let me know!
