---
layout: post
title: "...and I still think Mootools is better than jQuery"
date: 2020-04-04
categories: javascript
---

<img src="/assets/mootools.png" alt="Mootools" width="300px" style="margin-bottom:30px;" />

When I first started doing web development, I started using [prototype.js](http://prototypejs.org/) and its animations library [scriptaculous](https://script.aculo.us/) (amazingly, these sites are still up in 2020). Dealing with web browser inconsistencies was horrible, but Prototype papered over all of it and made working in the web a lot nicer. And the animations you could do with scriptaculous blew my mind at the time. It was so easy to make things pop in or out, fade in our out. All my friends were impressed.

Then, the JS framework wars began. There was YUI, Dojo, Mootools, jQuery, and, of course, Prototype. I still stuck with Prototype at first, but started experimenting with YUI for their widgets. YUI is now dead, but holy crap their widgets were great. They definitely had the best widgets of 2009 IMHO, but I digress...

### Mootools

Eventually I tried [Mootools](https://mootools.net/) and fell in love with it. It was like Prototype, except more modular, more standardized, just better in every way. It was both easy to use, yet powerful. It didn't just make it easier to interact with the DOM; like Prototype, it also made it easy to work with strings, added a bunch of array/collection methods, came with some nice class methods, and of course animations. This was the dream. It made working in Javascript so much better in every way.

Then, jQuery started winning. Suddenly, everyone was using jQuery, and all the other frameworks were being abandoned. I tried jQuery but hated it. Sure, it made it nicer to work with the DOM, but did nothing about the rest of JS. Plus, everything was a method on this single `$` object which really bothered me for some reason. Sure, it didn't touch any built-in objects like arrays or strings, but as a result it was a lot more annoying to work with. Every line of JS started with `$(...)` or `$.something`, and I had to go back to using old, crappy, raw JS without any of the language helpers Mootools provided.

Why was this happening? Suddenly all the Mootools libraries I was relying on stopped getting updates, and nobody made anything cool for Mootools anymore. Clearly jQuery had won, and so I sulkingly rewrote my projects in jQuery where I could, and the remaining Mootools parts became a cobweb-filled museum. I still felt like the web had made that wrong choice, that Mootools was definitely better than jQuery, but I learned that when the whole web community moves onto a consensus, you need to move too. It turns out choosing Mootools over jQuery initially was just the first in a long string of my bad tech choices.

### Coffeescript

Around the same time, [Coffeescript](https://coffeescript.org/) was getting really popular. Rails started pushing Coffeescript really heavily in Rails 3, around the time they switched officially off of Prototype.js and onto jQuery. I gave Coffeescript a try and fell in love. Coffeescript helped to fill in some of the holes in the core JS language left by switching off Mootools onto jQuery. Suddenly, there were real classes, arrow functions (no more binding `this` everywhere!), template strings, `==` that worked properly, and a lot more. I started using Coffeescript for everything and loved it. No way this could go wrong...

### Backbone

Then, around 2012, there was another explosion of JS frameworks, everything from Batman.js, to Knockout, Backbone, Angular, and many more. This time, I smartly waited until there was a clear winner in the community before moving onto the framework, since I had learned that choosing incorrectly meant both disappointment, and a huge amount of wasted time unlearning and rewriting everything you had written in something new.

And this time, the clear winner was [Backbone JS](https://backbonejs.org/). So, I began learning about it and writing projects in it. Hacker News agreed, Backbone was where it was at, and if you weren't using Backbone, you're definitely a failure. Everyone was writing about it, big companies were releasing projects and plugins for it. There's no way this could be wrong!

...And then 1 year later, everyone decided Backbone was lame, and the whole community lost interest again. I really thought I was on the right side of history this time, but clearly not. Now, it was all about Angular, Ember, and React. Again, I sat it out, tired of being burned time and again by picking the wrong framework, then licking my wounds and unwriting everything I had done.

Moreover, around this time the Javascript language was starting to get a lot of improvements, and everyone started using Browserify to transpile new Javascript into the old Javascript currently supported by browsers. This new Javascript included a lot of awesome language features that were in Coffeescript. As a result, Coffeescript started to die. Now, I was left with loads of useless Coffeescript code that I needed to rewrite back into plain Javascript. Sigh...

### 🎉 React

Finally, around 2015, I started learning React. In retrospect, I think this is the first correct tech decision I made (as of 2020 - who knows what will happen in 6 months). I didn't learn Angular or Ember, and thankfully, this seems like the correct choice so far. However, I still had plenty more bad tech choices to come!

### Flow

Adding types into JS started to get really popular around 2016, with Typescript and Flow. Naturally, I decided Flow looked great since it was just a simple annotation that could be added to JS files, so decided I'd use that for everything. Then, Facebook proceeded to not take Flow very seriously, and the project floundered. Great, now I have a bunch of useless Flow code to rewrite in Typescript...

### 🎉 GraphQL

I started using GraphQL for my projects around 2017, and this seems like it was thankfully the correct choice. GraphQL has only been rising in popularity, and all the competitors like OData or Falcor seem to be dead. I could definitely be wrong, but I feel like GraphQL is here to stay!

### Relay

Facebook launched [Relay](https://relay.dev/) to make working with GraphQL and React a lot easier. Awesome! I naturally decided to use Relay for all my projects using GraphQL and React. Then, Facebook followed the same playbook as with Flow, and let the project slowly fall into disrepair. Apollo has now definitely won the GraphQL wars, so now I need to try rewriting all my Relay code using Apollo. Sigh.

### Create React App

I started using [Create React App](https://create-react-app.dev/) to set up frontend projects in React, since messing with with Webpack and Babel directly is an exercise in pure masochism. This, again, has proven to be a mistake, with Gatsby being the clear way to create static websites with React. Now I need to go update these projects to use Gatsby instead...

## Is there some way to avoid this?

After picking the losing horse in so many of the frontend JS races, I wish there was a way to avoid all this. Is there some metric I could track to know when it's time to jump on a new tech, and when it's going to lose out in 6 months? Maybe I should follow Google Trends more closely and make decisions around that? There's nothing more miserable than spending tons of time learning a new piece of tech, then having to undo everything you've done and relearn whatever the current popular trend is. And my track record of picking tech is really bad - I've made correct choices that didn't require massive rewrites ~25% of the time. If there's a better way, let me know!
