---
layout: post
title:  "Why I miss Rails"
date:   2019-03-28
categories: rails
---

The world of tech moves fast, and there's always new frameworks and paradigms popping up that make developers' lives easier and allow us to build more and more powerful applications. But, these transitions don't always just make things better for developers - sometimes we take steps backwards and undo the progress we made in the past.

Now, I know Rails isn't universally beloved by developers, and I'm not suggesting that we give up React and es7 and go back to writing server-templated web-apps like it's 2012 again. However, I do think that in the transition to the modern web stack (something like React / nodejs / graphql / etc), we've unsolved some of what tools like Rails made easy 10 years ago - and I don't think it needs to be that way.

Rails took all the boilerplate that comes with building any web application and make it trivial to implement. Since Rails owned the whole application stack, it was easy for the community to contribute plugins that would add any typical functionality you may need. Do you need user accounts with signup / login / forgot password emails / email confirmation? Install devise and you're done. Do you want to be able to upload images, resize them, and upload them to s3? Great - install paperclip and you're done. Need to index your data in elasticsearch or sphinx? Easy - just install a rails plugin to do that. Do you need Google and Facebook login? Cool - install omniauth and you're done. Do you want to clean up your tests using factories? Install factory-girl and everything just works.

Compare that to the state of the typical web stack now, with something like a nodejs / typescript graphql backend and React / Apollo on the frontend. There's no longer a standardized way to get user accounts with a login/signup, forgot password and email confirmation flow, despite every application needing it, so instead we need to spend days rewriting this functionality anew on each project. Users need a way to change their account info? Get ready to spend a day working on a standard account settings page. Want to allow users to upload avatar images? Spend a day writing an image upload, resize, push to s3 flow from scratch. Do you want to add a search engine? Great - spend a day writing the code to index and search your documents from scratch. Need to add Google login? Get ready to spend another day on that.

All these things that used to be easy in Rails take a fair bit of manual effort today because there's not a standardized setup and eco-system. We're spending a lot of time re-solving all these boilerplate issues that every web app needs and everyone has already solved countless times before. Part of this may be inevitable now that there's both web and mobile frontends to think about, but I think the majority of the problem is just a result of fragmetation in the modern ecosystem. It's no longer possible to make libraries that automatically handle all the glue code of integration into our apps because there's no standard setup at all anymore.

That being said, there are some good attempts at unified frameworks out there. [Meteor](https://www.meteor.com/) was the closest the JS world has come to something like Rails, but may have come too early and missed the graphQL / React / Typescript wave. [Gatsby](https://www.gatsbyjs.org/) is amazing as well, and is the closest project I've seen to what Rails used to provide, but it only generates static sites.

I'm hopeful that a framework will emerge that can be the Rails of the modern web stack. Gatsby and Meteor show that it's possible. And if the modern equivalent of Rails already exists, please let me know!
