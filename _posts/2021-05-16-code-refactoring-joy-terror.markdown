---
layout: post
title: "Code Refactoring: Joy and Terror"
date: 2021-05-16
---

<img src="/assets/code_refactoring.jpg" alt="code refactoring joy and terror">

Refactoring code can be a soothing, cathartic experience, like tidying up your room after it’s gotten a bit too messy. You start moving code around into nicely organized, color-coded boxes. You make everything a bit more standardized, a bit better named. You break up some methods that are a bit too long and make their logic just a bit more elegant, a bit more streamlined. Everything is where it belongs, and you look at your work with a satisfied nod. You turn around and Alan Turing is standing there, and you both high-five. This is refactoring at its best, when it’s a true joy.

Then there’s times where refactoring code is sheer terror. You’re dropped into the middle of a jungle in the dark, with a flashlight that’s dying and a dull machete, surrounded by snakes and mosquitoes, desperately trying to hack your way out until you can see some sign of light. You frantically try to make sense of where you are in the code, but everything is looping back on everything else, and every step could be booby trapped. No human has been in this code in years, and there’s no maps or signs of life. You look over and see a skeleton of the last developer who dared enter this function, years ago. “Why did I sign up for this?” you think, and start crying to yourself.

Whether refactoring is a joy or a terror depends on a few factors.

## Test coverage
Great test coverage can turn even the most harrowing refactoring task into a straight-forward job. Test coverage is like having the ghost of the original programmers gently guiding your hand, and whispering sweet nothings in your ear. They let you know when your changes are working as expected, and when you’ve gone somewhere you shouldn’t. Test coverage lets you refactor with confidence, knowing that as long as the tests still pass you’re on the right track. It’s like being handed a GPS and a map so you know if you’re straying from the original intent of the code you’re changing, and it lets you easily backtrack when you make a wrong turn.

## Tooling
It’s a huge help whenever you have tooling that can act as your sidekick. If you’re working in a language with strong types, the compiler can alert you to whenever you’ve potentially broken something or done something unsafe. If your IDE has great refactoring tools, you can make changes to method names and have them automatically updated everywhere they’re referenced across the codebase. Linting, too, can help alert you if you’re about to do something fishy, like forgetting to await a promise, or have unused variables floating around. Tooling is like having a whole team of helpers double-checking all your work and alerting you if things look suspect.

## Regular refactoring
Sometimes there’s just too much tech debt piled into one refactoring task, which makes it extra difficult. If there are functions that are thousands of lines long, with lots of implicit state and unexpected side-effects, then there’s no way refactoring is going to be pleasant. This tends to happen when tech debt reaches a point where everyone is terrified to touch the code anymore. Typically the code has no tests, and is overly complicated. When new features are added, developers just hack in whatever seems least likely to accidentally break something rather than adding features in an organized way, just making the code even more convoluted. The hacks on hacks build up and now there’s a true monster, the sort of creature junior developers have nightmares about hiding under their bed. Once it’s gotten to this point, it’s not going to be pleasant to deal with.

Sometimes you don’t have any control over this, and code is just given to you in this state. But oftentimes you can prevent this from becoming an issue by cleaning up tech debt more regularly before the debt becomes self-aware and starts demanding rights. Regularly refactoring before things become a huge mess can go a long way.

## When all else fails
Sometimes code is too far gone to be refactored anymore. There’s no tests, no linting or tooling, and the code has reached a level of complexity and debt that it’s gained physical form and you swear you see it staring at you in your window at night. At this point, the code might need to be sealed away in a docker container that nobody touches and runs isolated from everything else, never to be touched again and eventually rewritten from scratch. At least in this state it can’t hurt anyone anymore and is isolated from everything else. At some point you’ll likely need to find a way to replace it to add new features. Or not - I’ve heard stories of companies that still have code running from the 70s that nobody understands anymore, still chugging away in an isolated server, watching, waiting for its moment to strike…

<img src="/assets/slytherin_locket.gif" alt="Docker container code horcrux"><br />
<small><i>Docker container code horcrux</i></small>
