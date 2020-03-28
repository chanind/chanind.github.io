---
layout: post
title: "Web development is way better than it used to be"
date: 2020-03-28
categories: javascript
---

It occurred to me recently that I've been working in web development for 12 years now. Looking back over that time, there's been a number of waves of new frontend tech that everyone went crazy over, then discarded 6 months later. There's been a constant cycle of learning and unlearning, writing and rewriting in whatever the current fad is. Front-end web development in 2020 is still incredibly frustrating and overly complex, and I like to complain about it as much as the next coder on hacker news, but there's still no way I'd want to go back to writing frontend code like in 2008. So, I thought I'd take some time to applaud the awesome things we've gained since 2008 that have made working on the frontend far better than it ever was before.

## CSS3

I still have nightmares about trying to implement rounded corners on boxes in IE6. There used to be all these hacks involving creating tiny images of the each corner, then positioning them perfectly into place to make things look right. And don't even get me started on box shadows and gradients, I still haven't worked through that trauma. But now, CSS just does all this for you for free. Want rounded corners? Just type `border-radius` in CSS. Want a box shadow? just use the css `box-shadow` property. Gradients? no problem. Want to add suble fade-in/out and animations? Just add a `transition` property. And now, with flex-box, you can even _gasp_ center things vertically!

## Chrome debugger / Firebug

When I was first getting started with web development Firebug had just come out and it was _awesome_. You could inspect elements on the page, see CSS properties, and inspect running javascript. Now, Firebug-like functionality is built-in to all browsers, and the Chrome debugger is especially awesome. You can inspect network requests, take memory dumps, run performance benchmarks, view paint cycles, and probably 10 other amazing features I'm forgetting. Before Firebug, you were basically poking around in the dark trying to figure out why this one stupid !#\$ing div is 4 pixels too wide.

## Promises and async / await

The javascript language improvements since 2008 are amazing in and of themselves, and are covered in the next point, but async/await is truly on another level. Dealing with async code used to _suck_. Everything was callbacks nested inside of callbacks, when something went wrong it was a nightmare figuring out where and why. First promises started to gain wide acceptance, which helped a bit, then `async` and `await` truly took it to another level. I remember when I first saw code with an `await` in it, I nearly cried it was so beautiful. The thought of having to go back to dealing with callback hell async code like in 2008 makes me want to curl up in a ball under my desk and cry.

## ES 2017+

The features built-in to JS now are awesome, and I don't understand how I wrote oldschool JS before. There was a brief window where Coffeescript was all the rage for filling these holes, but now the features are directly supported in JS! Before arrow functions `=>` you had to constanly remember to rebind `this` in JS, which was the source of endless headaches. There was no `class` keyword, no string interpolation, no destructuring. Javascript itself didn't have nearly as many built-in convenience methods either, so no `Array.map()`, no `Array.filter()`, etc...

## IE is finally dead

For awhile it seemed like Internet Explorer 6 would never die. IE6 was the Debbie Downer of browsers. Any time a new CSS or JS feature was announced, you'd get excited for 30 seconds, then IE6 would show up to remind you that it didn't support it, and you would need to wait at least another few years, if not forever. Well, after what seemed like an eternity, IE6 is dead. Not only that, but all versions of Internet Explorer are a thing of the past now. The main browsers (Chrome, Safari, Firefox, and Edge) all auto-update so you don't need to wait for decades before you can use new browser APIs.

## Typed JS

I've been using Typescript for the past 2 years, and now it's hard to imagine going back to writing vanilla JS. The convenience of having the IDE just tell you all the methods and fields on every object is a game changer. I get nervous now whenever I open up some pre-Typescript code I wrote years ago to make a change - how do I know that I didn't mistype some method or field name? How do I know what fields are on this object I have? I can't just rename a field and have its named changed everywhere in the code it's referenced?

## ... How did I used to live like this?

Looking back on the old world of frontend web development, it's shocking to imagine this is how it all used to work. I can't imagine going back to spaghetti jQuery and importing 4 different images just to round a corner. And yet, at the time it all seemed perfectly fine and normal to me. I'm sure if I had started doing web develpment 10 years before that I'd have another whole slew of reasons why developers in 2008 had it so good compared to 1998 - at least in 2008 there's CSS!

So, while there's still a long to complain about with the state of frontend web development in 2020, it's already a lot better than it used to be!
