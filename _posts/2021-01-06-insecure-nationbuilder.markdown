---
layout: post
title: "Nationbuilder's Disregard for Security"
date: 2021-01-06
categories: nationbuilder
---

Given how often hacks of political campaigns are in the news, you would think that Nationbuilder - a product that acts as a CMS specifically for political campaigns and causes - would take security super seriously. And yet, nothing could be farther from reality. It's especially galling given that Nationbuilder houses voter files and member lists full of personal data. In this post I'll go over a few of the security issues that have bothered me while working with Nationbuilder. My hope with this post is both to give a warning to others who are considerinng the platform, as well as to nudge nationbuilder itself to improve. The last thing the world needs now is more hacks of political campaigns and leaks of personal data because Nationbuilder can't be bothered to take security seriously.

### No Two-Factor Auth

The baseline of security features you would expect from a product housing sensitive data is two-factor auth (2fa). Yet, there is no way to set up 2fa in Nationbuilder. This is so glaring that an [article in Wired praising nationbuilder](https://www.wired.co.uk/article/nationbuilder-political-data) from 2019 even pointed this security flaw at the bottom of the article. 

> NationBuilder does not offer a two-factor authentication log-in option – problematic if you are handling sensitive voter data. A company spokesperson says that the issue is “on our radar”.

It's been 2 years since that article was written, and there's still no sign of 2fa in Nationbuilder.

### No Secure Hashing or HMAC Functions

Nationbuilder uses Liquid templates for its themeing system, so it's reasonable to expect it to have the same standard security-focused hashing functions available in most Liquid variants, like [sha256](https://shopify.dev/docs/themes/liquid/reference/filters/string-filters#sha256) and [hmac_sha256](https://shopify.dev/docs/themes/liquid/reference/filters/string-filters#hmac_sha256). These filters aren't present, and [Nationbuilder has no plans to add them](https://nationbuilder.com/xdjc/when_will_nationbuilder_liquid_support_the_hmac_sha256_filter). Instead, the only hashing function available is an undocumented `md5` filter, which, of course, is not secure.

### No JSON Escape Function

Nationbuilder liquid is also missing anything to properly escape JSON, so any time you want to pass data to javascript from a template, you need to be extremely careful there's nothing in that string that's going to break your JS and run arbitrary code on users' machines. Again, there are standard JSON escaping filters in most standard liquid variants, so it's jarring to see this conspicuously left out.

### No Way to Prove User Identity when Making API Calls

Nationbuilder themes [don't give access to an API token](https://nationbuilder.com/xdjc/making_nationbuilder_api_requests_inside_of_a_nationbuilder_theme) or any other cryptographic token that prove who the user is when making requests to a third party from Javascript. Essentially, if your Nationbuilder site theme needs needs to add any functionality beyond basic styling / JS widgets you'll need to make requests in javascript to 3rd party APIs. However, nationbuilder doesn't provide any way to prove that the request to those APIs is coming from a real logged-in user on Nationbuilder, and who that user is. If there was a HMAC filter, then you could work around this in Liquid by hashing auth about the user along with a hidden key that you control in both the API and in the Nationbuilder theme, but as mentioned above security-related functions were left out of Nationbuilder liquid. Your only option is to just make unauthenticated API requests and hope no attackers bother looking, or make sure your theme doesn't act as more than a glorified stylesheet.

### Security is not a priority

The culmination of these missing security related features shows that Nationbuilder simply does not take security seriously. I don't think these issues would be hard for Nationbuilder to fix. All they would need to do is follow industry standards and offer two-factor authentication, and implement the same standard Liquid filters used everywhere else. I'm hoping this post can help prod Nationbuilder into fixing these issues, since the users of Nationbuilder are especially likely to be targeted by hackers. Until they do, beware of Nationbuilder if you think security is important.