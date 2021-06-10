---
layout: post
title:  "So you want your app/website to work in China..."
date:   2019-01-19
categories: china
---

*Updated 2021-06-10*

Wait, what do you mean make my app/site *work* in China? I don't have to do anything to make my app work in the US or Singapore or Kenya or anywhere else, and I didn't make the Chinese government angry, so it should just work in China, right? Sadly, it's not so simple. If your app/website servers aren't hosted from within China, then, for all intents and purposes, it's blocked. I mean, it will probably technically load, but will be excruciatingly, unusably slow. And sometimes it will just not load at all for hours at a time. This is true for all services hosted outside of the firewall, even in Hong Kong.

### The Firewall

Any time a request needs to go from within China to the outside world, or from the outside world into China, the request crosses the Chinese Great Firewall. When this happens, there's a lot of latency that gets added, and there's a high chance the request will randomly fail. Requests through the firewall may appear to work most of the time, but then suddenly get fully blocked for several hours. The firewall doesn't seem like it's implemented uniformly across China either, so it's possible that if you test in Shanghai your request may go through but a user in Changsha will have their requests blocked.

Basically, if requests need to pass through the firewall to reach your servers outside of China you're in for a bad time.

### ICP License

If you want to have any infrastructure working in China, you need to apply for an [ICP license](https://en.wikipedia.org/wiki/ICP_license) from the Chinese government. All the techniques below require that you have this license. It's quite a pain to apply for, and takes several months, but there's no way around it. You can find more info about registering for an ICP license [here](https://webdesign.tutsplus.com/articles/chinese-icp-licensing-what-why-and-how-to-get-hosted-in-china--cms-23193). Alicloud also has a lot of info on registering for an ICP [here](https://www.alibabacloud.com/icp).

### Option 1: Cloudflare China Acceleration

The easiest option to get your services partially working in China is to go use [Cloudflare's China acceleration](https://www.cloudflare.com/network/china/). Cloudflare partnered with Baidu to extend their acceleration network with points inside of China itself. This method will give you a CDN inside of China, but requests through the firewall may still potentially fail since Cloudflare doesn't do any proxying of request through the firewall. Static assets will be fast though, and the overall experience for users in China will still be a big improvement. Cloudflare China acceleration requires an enterprise account as well, so it's going to be pricey.

Using Cloudflare does effectively allow you to host your infrastructure outside of China, but depending on your business it might not be entirely legal. That's because China has strict [data protection laws](https://www.chinalawblog.com/2018/05/china-data-protection-regulations-cdpr.html), and in many cases you must store Chinese users' data inside of China. If you're not a huge company or don't have much sensitive data on Chinese users this may not be an issue, but it's something to be aware of.

If most of your customers are outside of China and you just want to make sure your app/website loads reasonably in China, and are OK if it has occasional poor performance, then this is likely the best option for you.

### Option 2: Make a Separate Chinese Version of your App/Website

The most direct way to make your app/website work in China is, of course, to host your servers themselves in China. You can do that using a Chinese cloud provider like [Alicloud](https://alibabacloud.com) or [Tencent cloud](https://cloud.tencent.com), or using the [AWS China region](https://www.amazonaws.cn/en/). If you use AWS, you should be aware that the China region requires setting up a different account, and isn't even run by Amazon!

The most technically correct way to be in compliance with the Chinese government's [data protection laws](https://www.chinalawblog.com/2018/05/china-data-protection-regulations-cdpr.html) is to have a separate Chinese version of your app/website and run a separate version of your infrastructure in China. This allows all data for your Chinese users to stay in China and not be transferred abroad. No requests ever have to cross the firewall, so everything remains fast. Of course, it's practically quite annoying to run 2 separate but identical versions of your infrastructure and apps.

### Option 3: Proxy Requests on a Chinese Cloud Provider

Chinese cloud providers like [Alicloud](https://alibabacloud.com) and [Tencent cloud](https://cloud.tencent.com) have fast connections between their datacenters through the firewall that you can make use of. You can create a VPC inside of China and a VPC outside of China and then connect them using a form of VPC peering. This gives you a high-speed connection through the firewall which you can use to proxy requests. If you host your main infrastructure in a Chinese region then you'll be in compliance with China's [data protection laws](https://www.chinalawblog.com/2018/05/china-data-protection-regulations-cdpr.html), while still being able to serve requests outside of China via the proxied connection.

### Option 4: Use a Chinese Cloud Provider Acceleration Service

If you're hosting your infrastructure on [Alicloud](https://alibabacloud.com) or [Tencent cloud](https://cloud.tencent.com) in China, you can accelerate requests to your infrastructure globally using their acceleration services. These work similarly to the Cloudflare option above, but in reverse. Alicloud calls their service [Global Acceleration](https://www.alibabacloud.com/help/product/55629.htm), and Tencent cloud calls their [GAAP](https://intl.cloud.tencent.com/product/gaap). This allows users globally to make requests to your servers in China and still have them be fast.

### 3rd Party Services

No matter which option you go with, you still need to test that your service is working in China. Even if you're running on Chinese infrastructure or using Cloudflare China acceleration you may still be relying on APIs that aren't supported in China, like Facebook Login or Google Recaptcha. If your server in China needs to make API calls to services that aren't optimized in China you may find that a lot of those requests fail as well.

### Good luck!
