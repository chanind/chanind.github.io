---
layout: post
title:  "Comparing Alicloud, Tencent Cloud, and AWS in China"
date:   2019-01-16
categories: china hosting
---
Launching a service that will work in China is unfortunately a lot more challenging than simply spinning up a server on AWS anywhere else in the world. The Great Firewall makes any services hosted outside of China effectively unusable, so there's no real way around running infrastructure in-country. Your biggest options for doing so are Alicloud, Tencent Cloud, and AWS China region. I recently spent some time evaluating these options, so here's what I found:

## AWS China Region

AWS is the 800-pound-gorilla in the cloud space, so it's natural to assume that you can seamlessly use its China region to get servers up and running in China. Unfortunately, things are not so simple. The AWS China region is completely separate from the rest of AWS, requiring an entirely separate account. In fact, it's not even run by Amazon - it's run by a Chinese company called Sinnet in its Beijing region and NWCD in Ningxia. China is very hostile to allowing foreign tech companies into the country, so it seems this must have been the only way AWS was allowed to have a presence in the country at all. While the China region does have most of the old core services like EC2, S3, and RDS, there's still a lot that's missing. The biggest missing piece I saw was the Cloudfront CDN, so if you go with AWS you'll still need to figure out a CDN solution in China.

#### Pros
- Standard AWS Apis and interfaces

#### Cons
- Only operates in 2 regions in China (Beijing and Ningxia)
- Missing a lot of AWS services (ex Cloudfront)
- Not actually run by Amazon
- Requires a separate account for the China region

## Alicloud

Alibaba and Tencent are the 2 large players in the tech space in China, and are bitter rivals in every industry they operate in. The cloud services space is no different, with Alibaba and Tencent each having competing cloud hosting offerings. Alibaba's cloud service is called Alicloud or Aliyun (阿里云 in Chinese), and appears to be trying to become an international player in the cloud space. Since Alicloud is a Chinese company already, you're able to use the same account to seamlessly spin up servers both inside and outside of China. Alicloud's English (International) offering contains less services than they offer in Chinese, but the International offering already has everything you'll probably need and it looks like services are being added actively.

I found Alicloud to be less polished than standard AWS, with a few janky translations and UI experiences here and there, but overall usable. I was even pleasantly surprised to find that Alicloud has some features lacking in AWS. For example the Alicloud equivalent of S3, called OSS, allows you to do automatic image resizing by adding query params. It also has a hosted MongoDB service, which AWS doesn't. It doesn't seem to have an equivalent of AWS Fargate or Elastic Beanstalk, though. I'm sure there are lots of other differences, but those were what I experimented with.

I use Terraform to configure infrastructure, and the Alicloud Terraform provider definitely has a lot of holes and missing functionality, but most of the core services are there. I was able to provide a PR to add some missing functionality and it was accepted, so I have faith that the holes will be plugged over time by the community. It's still a pain to have chunks of the infrastructure requiring modifying in the UI after running Terraform though.

#### Pros
- Can seamlessly spin up infrastructure inside and outside of China
- Has some nice features lacking in AWS (ex automatic image resizing)
- Reasonable English interface and docs
- Appears to be making an attempt to expand to International users

#### Cons
- Alicloud Terraform provider has some holes
- International version is missing some services present in the Chinese version


## Tencent Cloud

Tencent cloud is similar to Alicloud in that it doesn't require a separate account to work globally, and has an "International" English version with less services than the full version in Chinese. Where they differ is that Tencent cloud is worse than Alicloud in almost every way. There's far fewer services in the international version than Alicloud has, and its documentation is barely translated. I found myself having to go into the Chinese version to do basic things like setting up a serverless function (Tencent's equivalent to AWS Lambda). While the Alicloud Terraform provider has some holes, the Tencent Terraform provider is basically unusable. Only the most basic of services are supported, and even then they're barely documented and are missing a lot of parameters. I even had to read through source code to figure out some of the parameters that needed to be sent.

Tencent cloud doesn't feel like it's fully tested and ready for production. I frequently hit bugs in the UI and services which make me wonder if anyone has ever actually tested these services. For instance, when I set up alerting, I found my alerts all get triggered 3x for some reason. The UI is littered with missing translations and translation errors, and there are even embarrassing bugs like showing negative timestamps for messages. Even the most basic experience of spinning up servers is full of problems. When I tried to set up a server, I was told that basic hard drives are "sold out", so I had to use a more expensive SSD. Then, I discovered that the smallest server size was also "sold out". How does a cloud platform run out of basic hard drives and servers!? This was in their flagship Guangzhou region too!

![](/assets/images/no_hard_drives_tencent.png){:class="post-image"}

#### Pros
- ??

#### Cons
- Full of bugs and UI glitches
- Unusable Terraform provider
- International (English) version is missing most services
- Missing translations and documentation
- Frequently "sold out" of basic hardware like servers and hard drives

## And the winner is...

Alicloud easily wins this competition, although AWS appears usable if you think it suits your needs and you're alright with the drawbacks of the China region. Avoid Tencent cloud at all costs!

Another option which I didn't evaluate is the Microsoft Azure China region. Azure appears to be similar to AWS in that it's run by different company, and has fewer services offered. Azure is likely similar to AWS in its pros / cons, so it could be worth checking out too depending on your use case.
