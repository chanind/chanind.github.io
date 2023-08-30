---
layout: post
title: "Solving Python SSL certificate verify failed on Linux / SGE"
date: 2023-08-30
categories: python
---

On a system I've been working on I've been plagued by SSL errors whenever Python would try to download something from the internet. I know it's possible to edit the requests to not verify SSL certs, but this is code in a third-party library (e.g. `nltk.download`) which I cannot edit easily. And even if I could, it's unsettling to disable SSL verification since that opens you up to potentiall man-in-the-middle attacks. The errors would look something like below:

```
urlopen error [SSL: CERTIFICATE_VERIFY_FAILED]
certificate verify failed:
unable to get local issuer certificate (_ssl.c:1002)
```

I didn't have any luck following most of what I found on Stack Overflow to solve this issue, but eventually stumbled on a solution combining ideas from [Redhat's guide to Python cert errors](https://access.redhat.com/articles/2039753), and [a Stack Overlow answer](https://stackoverflow.com/a/31915123/245362). Specifically, I needed to install certifi certs via `pip install certifi`, but this was not enough. I then needed to set an ENV var called `SSL_CERT_FILE` to the location of the certs installed via certifi. I don't know why Python wasn't using these certs automatically as it should have been, but this solved the issue for me.

The full steps I took are as follows:

```bash
pip install certifi
```

Next, in Python, find the certifi install location by running

```python
from requests.utils import DEFAULT_CA_BUNDLE_PATH
print(DEFAULT_CA_BUNDLE_PATH)
# /path/to/python/site-packages/certifi/cacert.pem
```

Note the output of the above `cacert.pem` file, and the following to `.bashrc` (or `.bash_profile` or `.zshrc`, etc... depending on your system).

```bash
export SSL_CERT_FILE=/path/to/python/site-packages/certifi/cacert.pem
```

Of course, in the above make sure you use that actual path to cacert.pem on your system.

Next, restart the terminal and hopefully everything should work!
