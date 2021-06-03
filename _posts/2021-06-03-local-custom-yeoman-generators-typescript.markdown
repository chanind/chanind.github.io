---
layout: post
title: "Local Custom Yeoman Generators in Typescript"
date: 2021-06-03
categories: typescript
---

One of the things I miss the most from Rails is the handy scaffold helpers. It made it super easy to generate a new model or controller without needing to manually create all the boilerplate myself. Fortunately, it's easy to recreate this behavior for your own custom projects using [yeoman](https://yeoman.io). This is great because custom yeoman generators make it easy to create any scaffolding your project might require. It's also possible to use Typescript to write your own local custom yeoman generators and run them using `ts-node`. It's a shame that yeoman has dropped off in popularity, because it's really really awesome at scaffolding. I don't think there's any other project in the node ecosystem that can come close, even today.

Usually people think of Yeoman as just being able to run globally install generators for bootstrapping new projects, and if you read the Yeoman docs you'll get this impression. However, it's super easy to use yeoman locally just by running `yo /path/to/generator.js`. This means there's no need for a separate `package.json` for your yeoman generators and no need to make a special `app/index.js` - you can just make whatever generators you'd like and put them in a folder inside your project. For example, I like to use the following structure:

```
project
├── package.json
├── src/...
├── test/...
└── scaffold
    ├── thing1
    │   ├── index.js
    │   └── templates
    │       ├── template1.js.tpl
    │       └── ...
    └── thing2
        ├── index.js
        └── templates
            └── ...
```

Then, in the `package.json` for the project, you can add these scaffolds as normal scripts

```
...
"scripts": {
  ...
  "scaffold:thing1": "yo ./scaffold/thing1",
  "scaffold:thing2": "yo ./scaffold/thing2",
}
```

Of course, you'll also need to `npm install yeoman-generator` and `npm install yo`. Then just fill in your `index.js` for each generator and templates like a normal yeoman generator and you're good to go!

A sample generator `index.js` might look like:

```js
const Generator = require('yeoman-generator');

class ThingGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', {
      required: true,
      type: String,
      description: 'The name of the thing',
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('template1.js.tpl'),
      this.destinationPath(
        `src/things/${this.options.name}.js`,
      ),
    );
  }
}

module.exports = ThingGenerator;
```


## Adding Typescript

If you're working in the node ecosystem in 2021 you're almost certainly using Typescript. Fortunately, writing your local yeoman generator in Typescript is easy! Just add `ts-node` (`npm install ts-node`), and change your `index.js` files in the generators to `index.ts`. Then just change the `scripts` in your `package.json` to use `ts-node`:

```
...
"scripts": {
  ...
  "scaffold:thing1": "ts-node node_modules/.bin/yo ./scaffold/thing1",
  "scaffold:thing2": "ts-node node_modules/.bin/yo ./scaffold/thing2",
}
```

Then we can enhance our `index.ts` with Typescript:

```typescript
import Generator from 'yeoman-generator';

interface ThingGeneratorOpts {
  name: string;
}

class ThingGenerator extends Generator<ThingGeneratorOpts> {
  constructor(args: string | string[], opts: ThingGeneratorOpts) {
    super(args, opts);

    this.argument('name', {
      required: true,
      type: String,
      description: 'The name of the thing',
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('template1.js.tpl'),
      this.destinationPath(
        `src/things/${this.options.name}.js`,
      ),
    );
  }
}

export default ThingGenerator;
```

And that's it! Now you can create any custom scaffold you can imagine for your project with all the power and flexibility of yeoman with the type-safety of typescript!