---
layout: post
title:  "Shape matching in JS using Fréchet Distance"
date:   2019-03-09
---

[Fréchet distance](https://en.wikipedia.org/wiki/Fr%C3%A9chet_distance) is a metric which can be used to determine how similar 2 curves are. You can visualize the concept behind Fréchet between curves by imagining a person walking their dog on a leach. The person walks along the path of one of the curves, and the dog walks along the path of the other curve. They each try to vary their speed as they walk to keep the leash as short as possible. The Fréchet distance between the curves, then, is how long the leash must be to allow the person and dog to walk each curve while staying connected.

<image src="/assets/frechet_distance.png" alt="Fréchet distance explanation diagram" />

## Discrete Fréchet Distance

You can estimate Fréchet distance between 2 curves using a simple discrete Fréchet algorithm. The algorithm is from the paper [Computing Discrete Fréchet Distance](http://www.kr.tuwien.ac.at/staff/eiter/et-archive/cdtr9464.pdf). In javascript, this algorithm looks like the following, taken from [HanziWriter](https://chanind.github.io/hanzi-writer/):

{% highlight js %}
const frechetDist = (curve1, curve2) => {
  const results = [];
  for (let i = 0; i < curve1.length; i++) {
    results.push([]);
    for (let j = 0; j < curve2.length; j++) {
      results[i].push(-1);
    }
  }

  const recursiveCalc = (i, j) => {
    if (results[i][j] > -1) return results[i][j];
    if (i === 0 && j === 0) {
      results[i][j] = distance(curve1[0], curve2[0]);
    } else if (i > 0 && j === 0) {
      results[i][j] = Math.max(recursiveCalc(i - 1, 0), distance(curve1[i], curve2[0]));
    } else if (i === 0 && j > 0) {
      results[i][j] = Math.max(recursiveCalc(0, j - 1), distance(curve1[0], curve2[j]));
    } else if (i > 0 && j > 0) {
      results[i][j] = Math.max(
        Math.min(
          recursiveCalc(i - 1, j),
          recursiveCalc(i - 1, j - 1),
          recursiveCalc(i, j - 1),
        ),
        distance(curve1[i], curve2[j]),
      );
    } else {
      results[i][j] = Infinity;
    }
    return results[i][j];
  };

  return recursiveCalc(curve1.length - 1, curve2.length - 1);
};
{% endhighlight %}

In the above, the curves are in the form: `[{x: 10, y: 15}, {x: 13, y: 12.3}, ...]`.

## Improving Discrete Fréchet Accuracy

The discrete Fréchet distance algorithm above has a critical constraint, which is that it can only be as accurate as the size of the line segments of the curves you pass in. So, you can increase the accuracy of the discrete Fréchet algorithm by subdividing the line segments you pass in into smaller line segments. The smaller the line segments in each line, the slower the calculation will be, but the more accurate it will be.

For example, if our curve looks like the curve below:

```
[
  {x: 10, y: 10},
  {x: 20, y: 30},
  {x: 30, y: 10},
]
```

We can increase accuracy by subdividing the curve further, for example:

```
[
  {x: 10, y: 10},
  {x: 15, y: 20},
  {x: 20, y: 30},
  {x: 25, y: 20},
  {x: 30, y: 10},
]
```

Here, we added the point `{x: 15, y: 20}` between `{x: 10, y: 10}` and `{x: 20, y: 30}`. `{x: 15, y: 20}` is already on the line between `{x: 10, y: 10}` and `{x: 20, y: 30}`, so adding this point doesn't change the shape of the curve at all, but it decreases the length of each line segment so our discrete Fréchet distance calculation will be more accurate.

## Normalizing Curves for Shape Matching

Fréchet distance takes into account distance between curves, size of the curves, and rotation as well as the shape of the curves themselves. If that's alright for your use-case, congrats, you're done! Otherwise, if you only want to get a measure of how similar 2 curves are then you'll need to normalize the curves to account for translation and scaling before determining discrete Fréchet distance. This can be done using [Procrustes analysis](https://en.wikipedia.org/wiki/Procrustes_analysis).

Before beginning with Procrustes analysis, we need to redistribute the points along our curves so they're evenly spaced. For any given curve, you can add more points to some parts of the curve and less in others while still maintaining the same general shape of the curve. For example, the curves below are identical but have different distributions of points:

<image src="/assets/points_distribution.png" alt="Diagram showing different distributions of points along te same curve" />

This is a problem because when we try to normalize the curves based on the mean and RMS of the points of the curve, the 2 curves above will be translated and scaled differently despite being identical!
