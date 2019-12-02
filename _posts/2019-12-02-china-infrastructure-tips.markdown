---
layout: post
title: "Tips for Running Infrastructure in China"
date: 2019-12-02
categories: china
---

If you're building an API or service that needs to work in China, you typically need to run infrastructure in China. The Chinese Great Firewall blocks a large portion of requests that go through it seemingly at random, and for others slows the requests to a crawl. As a result, you may find that interacting via the web UI of Chinese cloud providers may give network errors, and even making API requests via Terraform can result in random failures.  When you try to push a docker image from CI outside of China onto a server in China you may discover the upload fails or takes upwards of an hour. Fortunately, not all is lost! Below are a few tips for making your life easier working with infrastructure running in China.

## Connect via a VPN or proxy nearby

In my experience, when I'm connected to a VPN or proxy near China, for example in Hong Kong or even Singapore, requests to services in China tend to fail much less frequently. Tasks will still be slower than if you didn't need to cross the firewall at all, but it's definitely a much more pleasant experience than dealing with failed uploads and broken websites.

## Use Hong Kong as a hub

Pushing docker images or large files from outside of China onto a server in China likely won't work. However, much like the tip above, I find its easiest to use a nearby datacenter location as an intermediate ground for pushing large files. For instance, I find it's best to push docker images to a registry in Hong Kong and then pull those images down on servers in China. That way, the upload from your CI outside of China to Hong Kong is still fast, and pulling the images from Hong Kong to servers in China also tends to work relatively smoothly as well.

## Set up a forward proxy for global requests

If you make requests from servers in China to services that aren't hosted there (ex Segment, Datadog, Sentry, analytics, etc...), you'll need to take care to proxy those requests or else the requests will frequently get dropped. If you run on a Chinese cloud provider like Alicloud or Tencent Cloud, you can set up a VPC inside China and another outside of China, and connect them via a form of VPC peering (CCN on Tencent Cloud, or CEN on Alicloud). Then, set up a forward proxy in the VPC outside of China so that your servers in China can make global requests through it. I find [Tinyproxy](https://tinyproxy.github.io/) to be great for this, but any http proxy should do the trick.

## Beware of new services on Chinese cloud providers

For Chinese cloud providers like Tencent Cloud and Alicloud, new features often get shipped before they're fully ready for primetime. This can be nice if there's something you really want to use ASAP, but it means you should assume any new service is "alpha". I find it's best to let other customers find all the bugs in new services on Chinese cloud providers and wait at least 6 months or so for services to mature before giving them a try. Even then, expect to submit a lot of support tickets when working with services on Chinese cloud providers.

Hopefully these tips can help make your life easier working with infrastructure in China. If there's tips you've found helpful as well, let me know!
