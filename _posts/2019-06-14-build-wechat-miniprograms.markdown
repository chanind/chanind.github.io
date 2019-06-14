---
layout: post
title: "On Building Wechat Miniprograms"
date: 2019-06-14
---

Wechat miniprograms are extremely popular in China right now, so I've been looking for a project to try building one. Fortunately, just such an opportunity came along to build out a Miniprogram plugin for the Hanzi Writer project, so I used it as a chance to experiment with the technology. Below are my experiences with building this Wechat miniprogram plugin.

## Wait, what are Wechat miniprograms?

Wechat is a chat app similar to Whatsapp, but with an incredibly array of capabilities beyond anything available outside of China. It acts as a social network like Facebook with a wall, and has mobile payments built-in which are ubiquitous inside China. You can do almost anything on Wechat, from paying your phone bill, to buying movie tickets, to ordering a Taxi. A recent addition to Wechat are Miniprograms, which are a cross between a website and an app that run inside of Wechat itself without needing to be explicitly installed. Miniprograms have access to user identity, payments, and sharing all built-in, so it's incredibly powerful.

For example, in China it's common to enter a restaurant and find a QR code on your table. If you scan that QR code in Wechat, it will open up a miniprogram with the restaurant's menu on it. You can pick what you want to order, then pay for it all in the miniprogram.

## Foreigners not welcome

To get started, I first downloaded the [Wechat Developer IDE](https://open.wechat.com/cgi-bin/newreadtemplate?t=overseas_open/docs/mini-programs/development/devtools/download#devtools_download), and attempted to make a developer account as instructed. As a foreigner, it seems I'm not allowed to actually make a developer account unless it's for a company, and it then asks for your company business license forms and address. I don't have a company, so it seems like I'm only able to make a test app that can never run on real phones. Great.

I'm just making a plugin for other developers to use, so whatever, but it's still extremely frustrating to discover I'm barred for creating a miniprogram just because I'm not Chinese.

## Comparison with Web

Wechat miniprograms are clearly inspired by the web, with separate files for CSS, JS, and HTML. Of course, it's not the web, and the files are in custom formats wxss (wechat CSS) and wxml (wechat HTML). It also seems like it's inspired by React, since pages have a `setData()` method which is used to set state and trigger a render similar to React's `setState()`.

For my case, I was most interested in the Canvas API since that's one method [Hanzi Writer](https://github.com/chanind/hanzi-writer) can use to render in web. Wechat has a [Canvas API](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/wx.createCanvasContext.html) which is clearly inspired by Canvas on web, but with slight differences that make it difficult to reuse canvas code from the web directly. The main differences working with Wechat canvas contexts appear to be the following:

- No `Path2D` helper for working with SVG paths
- No setter attributes, everything has a `ctx.setAttr()` method. So instead of `ctx.globalAlpha = 0.3`, you need to say `ctx.setGlobalAlpha(0.3)`.
- You need to explicitly call `ctx.draw()` to make your changes appear
- If you try to draw to a canvas that doesn't exist, Wechat will silently appear to work yet do nothing.

Lack of `Path2D` is annoying, but you can accomplish the same thing with plain canvas curve commands. The lack of using standard attribute setters is annoying as well, but it's easy to polyfill. You can just add the missing setter attributes with something like:

```js
const ctx = wx.createCanvasContext("canvas-id");
// polyfill for ctx.globalAlpha = 0.3
Object.defineProperty(ctx, "globalAlpha", {
  set: ctx.setGlobalAlpha.bind(ctx)
});
```

Overall, there's a lot fewer nice development features for working with miniprograms compared with the web, but you can find workarounds to make it work.

## Incomplete English documentation

This wasn't surprising, but there were a few times where the English documentation was missing parameters and methods that are shown in the Chinese documentation. It's also frequently necessary to query Google in Chinese to find answers to issues you may encounter. Fortunately, Google translate is good enough to get the gist of most of the technical discussions online. There are some great English resources out there as well, like this [overview on miniprogram development](https://github.com/apelegri/wechat-mini-program-wiki).

## Unpolished but usable

Overall the development experience isn't amazing, but it's not too difficult to build most typical CRUD apps. My biggest complaint is that it's not possible for foreigners to use without registering a corporation and filling out an application on Tencent's website. The ability to combine the convenience of a website with built-in payments, sharing, identity, and a QR code scanner is really transformational. I wish this idea would spread outside of China.

You can check out the code for the [Hanzi Writer miniprogram plugin here](https://github.com/chanind/hanzi-writer-miniprogram).
