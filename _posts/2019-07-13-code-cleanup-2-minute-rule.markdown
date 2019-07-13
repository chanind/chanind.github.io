---
layout: post
title: "The \"2-Minute Rule\" of Code Cleanup"
date: 2019-07-13
---

Code, like my apartment, accumulates cruft and gets dirtier over time. Codebases need cleaning and maintenance to keep everything in order and fight the inevitable accumulation of tech debt. Organizations have different ways of fighting this, from doing something like a "code cleanup party" every few weeks, to scheduling explicit stories and tasks for code cleanup. This is all good, but another more controversial technique I'd recommend is to be constantly cleaning up nearby code as you work on daily coding tasks. This is similar to walking into your office and noticing that there's a candy wrapper on the floor. You pick it up and throw it out on the way to your desk to keep the office clean and tidy, even though it's not technically your job to do so.

For those familiar with [GTD](https://en.wikipedia.org/wiki/Getting_Things_Done), this will sound similar to the famous [2-minute rule](https://facilethings.com/blog/en/basics-two-minute-rule) which says:

> If the next action can be done in two minutes or less, do it now, although it is not an urgent or high-priority task.

I would propose a similar idea for code cleanup. If you come across some code cleanup that takes 2 minutes or less while working on an unrelated task, just tack the code cleanup on as well. 

### I'll just fix that later in another PR...

This is controversial because it tends to go against the idea of a single pull request having a laser-like focus on a single task. Frequently you'll be working on completing a task, and notice that some code in the file you're working on could use some improvements while you're there. This isn't strictly necessary to complete your task, so you could reasonably leave it as is. However, in my experience if small code improvements like this aren't constantly being improved on and tacked on to other tasks they never get fixed and just accumulate.

The most technically correct thing to do would be to finish your task, then open up another new PR with just the small code improvement in it. That way, you'll have 2 highly focused pull requests. But in reality, this almost never happens. For small code improvements, the overhead of creating a new pull request just to cleanup some small pieces of code seems like overkill. You'll also need to then get one of your coworkers to take time to review this tiny code cleanup, but it just seems ridiculous to distract them from what they're working on for such a small change. Plus you'll almost certainly get distracted by something else later and forget that you were going to improve this tiny piece of the codebase anyway, and the change never happens. In reality, if you're not constantly tacking small code cleanup onto unrelated tasks they simply don't happen.

### Won't somebody please think of the codebase!

For tiny code cleanup tasks that take less than 2 minutes, the overhead of opening up a pull request and requesting a review is far greater than the cost of the change, so if they're not fixed as part of other tasks they tend to get overlooked. However the net technical debt of allowing these tiny changes to pile up over time can easily get out of hand. Just cleanup your code as you go, and don't worry excessively about each pull request doing exactly 1 task. Your codebase will thank you for it!
