---
layout: post
title: "Geting Your Team to Write Tests"
date: 2019-05-02
categories: tests
---

Tests are one of those things that everyone agrees is a good idea, yet many teams still don’t do. If you find yourself in one of those teams, don’t despair! In my experience, changing team culture to write test comes down to a simple idea: **make it easier to write tests than to not write tests**. I realize this may sound impossible since tests take time and effort, but this can be achieved in a few steps:

### Step 1: Make your test framework awesome

Everyone tends to agree with the idea that test coverage is a good thing, but a lot of the pushback around writing tests is that it’s a pain. If your team has never worked with a good test setup, then writing tests can feel like an endless slog. You end up fighting battles with mock dependencies and hacky workarounds just to end up with a brittle test that nobody understands. Spend some time and make your test setup a pleasure to use, and focus on the developer experience. This may mean writing what look more like functional rather than pure unit tests - that’s fine! Test at the level that’s easiest and clearest to work with.

### Step 2: Be the change you wish to see in the codebase

For developers that aren’t accustomed to writing tests it’s not always obvious how to begin to integrate tests into their workflow. Here, you can lead by example, by adding tests to all the new code you write. The best documentation on how to write tests for your codebase is for there to already be a slew of tests written that other developers can refer to. In addition, working test coverage into your own workflow is an excellent model for the rest of the team, and will help iron out any issues in the test system.

### Step 3: Ask for tests in code review

Now that you’ve improved the test-writing experience, and modeled good test coverage in your own code, it’s time to start asking that other developers write tests as well. An easy way to do this is to simply ask other developers to add tests to their code in code-review. Hopefully, at this point, adding test coverage to pull requests should be less work than coming up with a reason not to given steps 1 and 2, and, afterall, everyone agrees it’s a good idea. Hopefully, the culture of the team should now begin to change towards writing tests as part of the normal flow. Once other developers start asking for test coverage in their code reviews as well that’s a good sign the culture change has stuck.

You can also use tools like [codecov](https://codecov.io/) or [coveralls](https://coveralls.io/) to automatically track test coverage in pull requests, and even fail builds that don’t meet a certain threshold.

As testing becomes part of the team’s normal flow, and the codebase begins to have more and more tests written, the benefits of testing become obvious. There are fewer bugs, and developers begin to feel more comfortable refactoring and improving the existing code. It's easy to just rip parts of the codebase out and refactor because you know the tests have your back. It becomes almost terrifying to imagine going back to before the code had tests (_how did we do anything back then!?_).
