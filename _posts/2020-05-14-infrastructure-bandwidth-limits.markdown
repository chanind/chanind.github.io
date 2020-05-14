---
layout: post
title: "Don't ignore bandwidth limits"
date: 2020-05-14
---

I never thought much about how much bandwidth network resources have access to when spinning up infrastructure. I just assumed everything is "fast enough" that I wouldn't really notice, and X Mbps or X Gbps is probably fine for whatever. Well, turns out that's not the case! There's a massive and noticeable difference between 5 Mbps, 50 Mbps, and 500 Mbps, and if you don't pay attention to the bandwidth limits you're setting in your cloud infrastructure you might be in for a nasty surprise.

Recently I was setting up the backend infrastructure for a simple web application. So, database, load balancers, web servers, the usual. After getting everything set up and starting to kick the tires, I switched it on and started sending over production traffic. Everything seemed to be working alright, except then I noticed that a database backup job that was previously working on our old setup was no longer working. Weird. After further investigation, the job wasn't able to upload the backup to S3 like it had been before. Everything seemed like it should be working, but the job just wouldn't finish.

It turns out this new setup had a default 5 Mbps connection to the internet which I had just left as is without thinking. It turns out, however, that 5 Mbps is _SUPER SLOW_ if you're uploading a several gigabyte file to S3. Previously, we had a 200 Mbps connections configured and the job just took a couple minutes to complete. However, if you only have 5 Mbps, transfering 10GB would take nearly _5 hours_ and completely saturate your connection. That same file, with a 200 Mbps connection, would take only _7 minutes_! With a 1 Gbps connection it would take only about _a minute and a half_!

After more investigating, I discovered to my horror that every connection in our new setup was at this default 5 Mbps! We were hitting this limit or getting close very frequently. I increased the bandwidth caps everywhere to 200 Mbps and suddenly everything starting working smoothly.

Thankfully nothing exploded, but I've learned my lesson: Don't ignore bandwidth limits in your infrastructure.
