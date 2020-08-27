---
layout: post
title: "Node scripts the right way"
date: 2020-08-27
---

Running scripts in node.js is easy - just make a javascript file and run `node /path/to/file.js`. However, if you maintain a lot of scripts you'll quickly start to run into some pain points, especially when you try to test your scripts. In this post, I'll run through some quick tips to make your scripts more resilient and testable, which in the long run with make your life a lot easier.

## Learning from Python: require.main

If you've worked in python before, you'll be familiar with a peculiar convention in scripts that looks like the following:

```python

def do_something():
  ...

if __name__ == "__main__":
  do_something()
```

This `__name__ == "__main__"` statement allows for a the script file to have code that auto-executes when the file is run as a script, while not running if the file is being imported by another python file. This is essential for scripts because scripts are typically self-executing, which makes it easy to write scripts that cannot be tested easily since you can't import and run the main function of the script inside of a test case without accidentally running the actual contents of the script. For instance, in the script above, we could require `do_something` in a test and run it in a controlled manner without needing to worry that it will auto-execute on import.

Fortunately, node has a similar though less well-known convention which we can use to accomplish the same thing: `require.main === module`. This statement will be `true` if, like in the python case, we're directly executing this file as a script. This allows us to write a function that we can test separately while still auto-executing the script if we run it direclty from node. For example:

```javascript
export const doTheThing = () => {
  ...
}

if (require.main === module) {
  doTheThing();
}
```

Now, we can import this file into a test and make sure that `doTheThing()` does what it's supposed to without needing to worry that the script is going to auto-execute on import.

## Avoid killing the process

A lot of times scripts in node will have a line to explicitly kill the node process when it's done, often to make sure there's no hanging promises or something that will keep the script alive after it's done. This is OK when you're running the script from the CLI directly, but it makes it extremely difficult to test since running something like `process.exit()` will also tear down you're entire test framework too in the middle of a run!

If you must something like `process.exit()`, make sure it's wrapped inside of `if (require.main === module)` like above, so you don't accidentally crash your tests, for example:

```javascript
export const doTheThing = () => {
  ...
}

if (require.main === module) {
  try {
    doTheThing();
  } finally {
    process.exit();
  }
}
```

I still think it's best to avoid explicitly killing the process like this since it can mask underlying errors, but at least this won't do anything crazy on import. This same principle should be used for any other destructive tear-down that might mess up tests or do something unexpected on import.

## Treat scripts like production code

A lot of times scripts tend to be treated like they're hackathon projects rather than real production code. This leads to a lot of inconsistency, half-baked boilerplate, and, ultimately, bugs. Scripts should be run in a consistent way, which means proper logging, error handling, and code deduplication. If there's a set of boilerplate that all your scripts need, move it to a helper function. Like any other production code, scripts should have test coverage to make sure they work, and should be code reviewed.

## Happy scripting!
