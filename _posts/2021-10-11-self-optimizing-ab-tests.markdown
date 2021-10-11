---
layout: post
title: "Self-Optimizing A/B Tests"
date: 2021-10-11
---

<link rel="stylesheet" href="/assets/self_optimizing_ab_tests.css" />

There's always a trade-off when running A/B tests. Until you're certain which variant of the test is correct, you can't make a final decision about which test variant to show. So if variant A is better than variant B, you're losing all the potential conversions that you could have been getting from just showing variant A to everyone. Likewise, even after making a decision, there's still some uncertainty since typically tests are called at 95% certainty, which means 1 in 20 tests might have chosen incorrectly!

There's another way to run A/B tests to address this. The basic idea is that if you're 60% sure that variant A is better than variant B, why not show variant A 60% of the time? As more data is gathered and you're more and more certain about the conversion rates of variants A and B, then the portion of users shown the winning variant should slowly climb towards 100%.

This post will go into more detail about this idea and the math behind how it works.

## A/B conversion follows a binomial distribution
When running an A/B test, what we're really trying to do is estimate the conversion rate of each item in our test, and then pick the item with the best conversion rate. However, we can't directly observe the conversion rate - all we can observe are trials and conversions, and then based on that we guess what the conversion rate really is.

In this formulation, each item in an A/B test is actually a [binomial distribution](https://en.wikipedia.org/wiki/Binomial_distribution). A binomial distribution models events with binary outcome that happen with a certain probability, and has a parameter `p` for the probability of the event occurring, and `n` for the number of trials. For instance, imagine flipping a weighted coin with a 80% chance of landing on heads 10 times. In this case, a binomial distribution with `p = 0.8`, and `n = 10` will tell us what's the chance of `k` of those flips coming up heads.
<p>
  <div class="BinomialPdf">
    <div class="BinomialPdf-graph"></div>
    <div class="BinomialPdf-controls">
      <label class="BinomialPdf-control">
        <span class="BinomialPdf-controlText">p <span class="BinomialPdf-pVal">0.8</span></span>
        <input type="range" value="0.8" min="0" max="1" step="0.01" class="BinomialPdf-p">
      </label>
      <label class="BinomialPdf-control">
        <span class="BinomialPdf-controlText">n</span>
        <input type="number" value="10" min="1" max="1000" step="1" class="BinomialPdf-n">
      </label>
    </div>
  </div>
</p>
The graph above shows the change of seeing `k` number of heads from the `n` times the coin was flipped, where each flip has probability of `p` of coming up as heads.

An A/B test works the same way! For each variation in an A/B test, `p` is the conversion rate of the variation and `n` is the number of users who have seen the variation (`p = conversion_rate, n = num_trials`).

## Modeling conversion rate using a Beta distribution
For A/B tests, we don't actually know the conversion rate, though. If we knew which A/B variation had the best conversion rate we'd already have picked it and there would be no need for the test. Fortunately, there's another probability distribution called the [Beta distribution](https://en.wikipedia.org/wiki/Beta_distribution) that can be used to model the probability of a binomial distribution's `p` parameter given the observed trials and successes.

The Beta distribution takes in 2 parameters, `α` and `β`. For modeling the conversion rate `p` from our binomial distribution, we can set `α = 1 + num_conversions` and `β = 1 + num_trials - num_conversions`. Further discussion on this [can be found here](https://stats.stackexchange.com/questions/105941/proper-number-of-clicks-for-conversion-rate-testing). In our case, we can simply write: 

```
conversion_rate ~ Beta(1 + num_conversions, 1 + num_trials - num_conversions)
```

This formulation naturally starts off with a lot of uncertainty when `num_trials` is low, and becomes more and more certain of the conversion rate as `num_trials` becomes higher. You can see this in the graph below:

<p>
  <div class="BetaConversionPdf">
    <div class="BetaConversionPdf-graph"></div>
    <div class="BetaConversionPdf-controls">
      <label class="BetaConversionPdf-control">
        <span class="BetaConversionPdf-controlText">num conversions</span>
        <input type="number" value="10" min="1" max="1000000" step="1" class="BetaConversionPdf-numConversions">
      </label>
      <label class="BetaConversionPdf-control">
        <span class="BetaConversionPdf-controlText">num trials</span>
        <input type="number" value="100" min="1" step="1" max="1000000" class="BetaConversionPdf-numTrials">
      </label>
    </div>
  </div>
</p>
Notice how the distribution gets much narrower as num trials gets higher, reflecting more certainty about the underlying conversion rate. For instance, when setting `num_trials = 10, num_successes = 1`, the most likely conversion rate is 10%, but there's a wide range of possibilities, anywhere up to 50% is still plausible. However at `num_trials = 1000, num_successes = 100`, the most likely conversion rate is still 10%, but there range of possible conversion rates is much narrower, only really between 8% and 12% are plausible.

## Sample from the Beta distribution to pick which A/B variation to show
We have a probabilistic model of the conversion rate of each variation of an A/B test, but how can we use this to choose which A/B variation to show to each user?The simplest way to do this is to sample a value of the conversion rate from our model for each variation, and then select the variation that had the highest sampled conversion rate. Sampling just means choosing a single random point according to the shape of the probability distribution. This effectively turns picking which variation to show each user into a [Monte Carlo experiment](https://en.wikipedia.org/wiki/Monte_Carlo_method).

By doing this, if our A/B variations both have a lot of data already collected, then our model of their conversion rate will be pretty narrow and the variation with the higher conversion rate will be selected the vast majority of the time. Likewise, if we haven't collected a lot of data yet for our A/B test variations then we'll expect to get a wide range of conversion rates when we sample and we'll get a good mix of each A/B test variation. As we get more and more data, then the test naturally converges to picking the winning variation more and more often, without us needing to do anything! Plus, we'll start showing variations that look more promising more and more frequently automatically, so we won't be missing out on conversions we could have gotten by picking the winning variation sooner.

Try experimenting below to see this in action. You can tweak the num trials and num successes for each A/B variation and then try sampling multiple times to see how this affects how often each variation gets chosen.

<p>
  <div class="ConversionSampler">
    <div class="ConversionSampler-controlPane">
      <div class="ConversionSamplerVariation">
        <div class="ConversionSamplerVariation-leftPane">
          <div class="ConversionSamplerVariation-title">Variation A</div>
          <div class="ConversionSamplerVariation-controls">
            <label class="ConversionSamplerVariation-control">
              <span class="ConversionSamplerVariation-controlText">num conversions</span>
              <input type="number" value="15" min="1" max="100000" step="1" class="ConversionSamplerVariation-numConversions">
            </label>
            <label class="ConversionSamplerVariation-control">
              <span class="ConversionSamplerVariation-controlText">num trials</span>
              <input type="number" value="100" min="1" max="100000" step="1" class="ConversionSamplerVariation-numTrials">
            </label>
          </div>
        </div>
        <div class="ConversionSamplerVariation-graph"></div>
      </div>
      <div class="ConversionSamplerVariation">
        <div class="ConversionSamplerVariation-leftPane">
          <div class="ConversionSamplerVariation-title">Variation B</div>
          <div class="ConversionSamplerVariation-controls">
            <label class="ConversionSamplerVariation-control">
              <span class="ConversionSamplerVariation-controlText">num conversions</span>
              <input type="number" value="2" min="1" max="100000" step="1" class="ConversionSamplerVariation-numConversions">
            </label>
            <label class="ConversionSamplerVariation-control">
              <span class="ConversionSamplerVariation-controlText">num trials</span>
              <input type="number" value="10" min="1" max="100000" step="1" class="ConversionSamplerVariation-numTrials">
            </label>
          </div>
        </div>
        <div class="ConversionSamplerVariation-graph"></div>
      </div>
      <div class="ConversionSampler-actions">
        <button class="ConversionSampler-sampleButton">Sample</button>
        <button class="ConversionSampler-clearButton hidden">Clear output</button>
      </div>
    </div>
    <div class="ConversionSampler-outputPane"></div>
  </div>
</p>

## Adding in prior information

With the method described above, the conversion rate of each A/B test variation is estimated as having a uniform probability distribution when there's no data. So, it will consider it equally likely that the conversion rate is 1% as it is to be 99%. In reality, you may have a rough estimate of what the probability of a conversion rate is for each variation from the start. You can make use of this prior data by adding a base number of trials and successes to your data for each A/B variation so it starts off with a number of trials / success > 0. For example, if you think there's roughly a 5% conversion rate without any extra info, but you still want to reflect that you're really uncertain about that, you could add 1 to the number of successes, and 20 to the number of trials. Ex:

```
// Adding in a prior of 1 conversion in 20 trials

adjusted_num_conversions = 1 + num_conversions
adjusted_num_trials = 20 + num_trials

conversion_rate_with_prior ~ Beta(1 + adjusted_num_conversions, 1 + adjusted_num_trials - adjusted_num_conversions)
```

## Working with 3+ variations

There's nothing about this method that requires only using 2 A/B test variations. For instance, imagine you have 1000 products that you sell, and you want to determine which of those products to show on your homepage to generate the most sales. You could follow this method for all 1000 products and sort them by sampled conversion rate for each user who visits your site. As you get more data about conversions, the products with the highest conversion rates will natrually flow to the top of the homepage more and more often, while still allowing products that don't have a lot of view to show up occasionally until the system has learned more about their real conversion rates.

## Final notes

- In order for this to work well, the conversions and trials data for each A/B variation needs to be kept up to date so the system can keep adjusting its estimates of the underlying conversion rate of each A/B variation as time progresses.
- This post uses [jStat](https://jstat.github.io/) for statiscal calculations in Javascript and [highcharts](https://www.highcharts.com/) for the charts.

<script src="https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js"></script>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="/assets/self_optimizing_ab_tests.js"></script>
