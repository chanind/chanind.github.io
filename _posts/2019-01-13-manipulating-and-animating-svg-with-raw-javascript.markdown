---
layout: post
title:  "Manipulating and Animating SVG with Raw Javascript"
date:   2019-01-13
categories: javascript SVG
---
When I first started building the [Hanzi Writer](https://chanind.github.io/hanzi-writer) library, I assumed that in order to manipulate and animate javascript that I'd need to rely on an SVG library of some sort. I settled on [SVG.js](https://svgjs.com) as it was the leanest library I could find. But even then, adding in minified SVG.js adds 67 KB to the bundle size! Even [velocity.js](http://velocityjs.org/), which only handles animation, adds 48 KB minified to your bundle sizes. For reference, the entirety of Hanzi Writer library currently is around 30 KB, so more than doubling the size of the library just to do basic SVG animation is definitely not acceptable.

Fortunately, it turns out that working with SVG in raw JS isn't very hard, and for most basic SVG-related tasks you don't need to include a fancy library at all! Most browser APIs that work on HTML nodes also work fine with SVG, with a few exceptions. Let's cover the basics below:

### Creating SVG Elements

Creating the SVG tag and other SVG elements is easy using [document.createElementNS](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS). The only trick is that you need to specify the namespace as `"http://www.w3.org/2000/svg"` when using SVG. Then, you can append the SVG node to the page using the standard [Node.appendChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild).

For example if you had a page with a div like below:
{% highlight html %}
<div id="svg-target"></div>
{% endhighlight %}

Then you could create an SVG element and append it to the div using:
{% highlight js %}
const targetDiv = document.getElementById('svg-target');
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
targetDiv.appendChild(svgNode);
{% endhighlight %}

### Manipulating SVG

Setting attributes on SVG nodes in raw JS is a breeze using [Element.setAttributeNS](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttributeNS). In general you can leave the `namespace` param as `null` when working with SVG attributes. For example, we can extend the example above to draw a blue SVG circle inside our SVG node:
{% highlight js %}
const targetDiv = document.getElementById('svg-target');
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgNode.setAttributeNS(null, 'viewBox', '0 0 100 100');
targetDiv.appendChild(svgNode);

// create the circle node, set attributes, and append it to the SVG node
const circleNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
circleNode.setAttributeNS(null, 'cx', '50');
circleNode.setAttributeNS(null, 'cy', '50');
circleNode.setAttributeNS(null, 'r', '40');
circleNode.setAttributeNS(null, 'fill', 'blue');
svgNode.appendChild(circleNode);
{% endhighlight %}

The result of which is below:
<p>
  <div
    id="svg-circle-target"
    style="width: 100px; height: 100px; box-shadow: 0 0 5px rgba(0,0,0,0.1)">
  </div>
</p>
<script>
  (function() {
    const targetDiv = document.getElementById('svg-circle-target');
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgNode.setAttributeNS(null, 'viewBox', '0 0 100 100');
    targetDiv.appendChild(svgNode);

    // create the circle node, set attributes, and append it to the SVG node
    const circleNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleNode.setAttributeNS(null, 'cx', '50');
    circleNode.setAttributeNS(null, 'cy', '50');
    circleNode.setAttributeNS(null, 'r', '40');
    circleNode.setAttributeNS(null, 'fill', 'blue');
    svgNode.appendChild(circleNode);
  })();
</script>

### Animating SVG

Now that we have the ability to create and set attributes on SVG nodes, we actually have all we need to be able to animate SVG. Animating SVG in JS is just the same as doing any other type of animation in javascript, using [window.requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). If you're not familiar with this `requestAnimationFrame` you can read more about it [here](http://www.javascriptkit.com/javatutors/requestanimationframe.shtml). This is how most JS animation libraries work under the hood anyway.

calling `requestAnimationFrame(callback)` asks the browser to call `callback` at the next paint cycle. If `callback` then calls `requestAnimationFrame(callback)` again, you'll end up running `callback` regularly enough to make smooth animations. Here's an example below, which will make our circle from above move to the right over 1 second:
{% highlight js %}
// ...skipping SVG circle setup code from above

const animateCircle = () => {
  let startTime = 0;
  const totalTime = 1000; // 1000ms = 1s
  const animateStep = (timestamp) => {
    if (!startTime) startTime = timestamp;
    // progress goes from 0 to 1 over 1s
    const progress = (timestamp - startTime) / totalTime;
    // move right 100 px
    circleNode.setAttributeNS(null, 'cx', 50 + (100 * progress));
    if (progress < 1) {
      window.requestAnimationFrame(animateStep);
    }
  }
  window.requestAnimationFrame(animateStep);
};

document.getElementById('start-button').addEventListener('click', animateCircle);
{% endhighlight %}

<p>
  <div
    id="svg-circle-animate-target"
    style="width: 200px; height: 100px; box-shadow: 0 0 5px rgba(0,0,0,0.1)">
  </div>
  <button id="circle-animate-button">Animate circle</button>
</p>
<script>
  (function() {
    const targetDiv = document.getElementById('svg-circle-animate-target');
    let circleNode;
    const createCircle = () => {
      targetDiv.innerHTML = '';
      const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgNode.setAttributeNS(null, 'viewBox', '0 0 200 100');
      targetDiv.appendChild(svgNode);

      // create the circle node, set attributes, and append it to the SVG node
      circleNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleNode.setAttributeNS(null, 'cx', '50');
      circleNode.setAttributeNS(null, 'cy', '50');
      circleNode.setAttributeNS(null, 'r', '40');
      circleNode.setAttributeNS(null, 'fill', 'blue');
      svgNode.appendChild(circleNode);
      circleNode;
    };
    createCircle();

    const animateCircle = () => {
      let startTime = 0;
      const totalTime = 1000; // 1000ms = 1s
      const animateStep = (timestamp) => {
        if (!startTime) startTime = timestamp;
        // progress goes from 0 to 1 over 1s
        const progress = (timestamp - startTime) / totalTime;
        // move right 100 px
        circleNode.setAttributeNS(null, 'cx', 50 + (100 * progress));
        if (progress < 1) {
          window.requestAnimationFrame(animateStep);
        }
      }
      window.requestAnimationFrame(animateStep);
    };

    document.getElementById('circle-animate-button').addEventListener('click', animateCircle);
  })();
</script>

In the above code, the `animateStep` function calls itself again via `window.requestAnimationFrame(animateStep)` to keep triggering new paint cycles until the animation completes.

The example above is very basic, and in practice you may want to move animation code into a helper function or class to keep things reusable. Depending on your needs you may need to support things like canceling animations or chaining animations together, which is still doable using the building blocks described above. Below is a simple `SvgTween` class that we can use to simplify animation:

{% highlight js %}
const SvgTween = function(node, attrName, attrStartVal, attrEndVal, duration) {
  this.node = node;
  this.attrName = attrName;
  this.attrStartVal = attrStartVal;
  this.attrEndVal = attrEndVal;
  this.duration = duration;
  this.isStarted = false;
  this.isDone = false;
  this.startTime = null;
};
SvgTween.prototype.start = function() {
  if (this.isStarted || this.isDone) return;
  this.isStarted = true;
  const animateStep = (timestamp) => {
    if (this.isDone) return;
    if (!this.startTime) this.startTime = timestamp;
    const progress = (timestamp - this.startTime) / this.duration;
    if (progress < 1) {
      const currentVal = (this.attrEndVal - this.attrStartVal) * progress + this.attrStartVal;
      this.node.setAttributeNS(null, this.attrName, currentVal);
      window.requestAnimationFrame(animateStep);
    } else {
      this.node.setAttributeNS(null, this.attrName, this.attrEndVal);
      this.isDone = true;
    }
  }
  window.requestAnimationFrame(animateStep);
};
SvgTween.prototype.cancel = function() {
  this.isDone = true;
};
{% endhighlight %}

then, using this class our animation example would become:

{% highlight js %}
// ...skipping SVG circle setup code from above

let circleTween;
const animateCircle = () => {
  if (circleTween) circleTween.cancel();
  circleTween = new SvgTween(circleNode, 'cx', 50, 150, 1000);
  circleTween.start();
}

document.getElementById('start-button').addEventListener('click', animateCircle);
{% endhighlight %}

<p>
  <div
    id="svg-circle-animate-target2"
    style="width: 200px; height: 100px; box-shadow: 0 0 5px rgba(0,0,0,0.1)">
  </div>
  <button id="circle-animate-button2">Animate circle</button>
</p>
<script>
  (function() {
    const SvgTween = function(node, attrName, attrStartVal, attrEndVal, duration) {
      this.node = node;
      this.attrName = attrName;
      this.attrStartVal = attrStartVal;
      this.attrEndVal = attrEndVal;
      this.duration = duration;
      this.isStarted = false;
      this.isDone = false;
      this.startTime = null;
    };
    SvgTween.prototype.start = function() {
      if (this.isStarted || this.isDone) return;
      this.isStarted = true;
      const animateStep = (timestamp) => {
        if (this.isDone) return;
        if (!this.startTime) this.startTime = timestamp;
        const progress = (timestamp - this.startTime) / this.duration;
        if (progress < 1) {
          const currentVal = (this.attrEndVal - this.attrStartVal) * progress + this.attrStartVal;
          this.node.setAttributeNS(null, this.attrName, currentVal);
          window.requestAnimationFrame(animateStep);
        } else {
          this.node.setAttributeNS(null, this.attrName, this.attrEndVal);
          this.isDone = true;
        }
      }
      window.requestAnimationFrame(animateStep);
    };
    SvgTween.prototype.cancel = function() {
      this.isDone = true;
    };

    const targetDiv = document.getElementById('svg-circle-animate-target2');
    targetDiv.innerHTML = '';
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgNode.setAttributeNS(null, 'viewBox', '0 0 200 100');
    targetDiv.appendChild(svgNode);

    // create the circle node, set attributes, and append it to the SVG node
    const circleNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleNode.setAttributeNS(null, 'cx', '50');
    circleNode.setAttributeNS(null, 'cy', '50');
    circleNode.setAttributeNS(null, 'r', '40');
    circleNode.setAttributeNS(null, 'fill', 'blue');
    svgNode.appendChild(circleNode);

    let circleTween;
    const animateCircle = () => {
      if (circleTween) circleTween.cancel();
      circleTween = new SvgTween(circleNode, 'cx', 50, 150, 1000);
      circleTween.start();
    }

    document.getElementById('circle-animate-button2').addEventListener('click', animateCircle);
  })();
</script>

You can imagine how this simple SvgTween class could be extended to allow chaining or return promises from animations, or allow tweening multiple attributes together depending on your needs. Of course, if you need more complicated SVG behavior you can always go back to including a heavyweight SVG library like [SVG.js](https://svgjs.com) or [raphael.js](http://dmitrybaranovskiy.github.io/raphael/), but for most basic SVG manipulation and animation its easy to get by just using standard browser APIs.
