---
layout: post
title: "Understanding Inverse Propensity Score for Contextual Bandits"
date: 2022-03-14
categories: ai
---

One of the hardest concepts to grasp about contextual bandits is understanding how to evaluate a bandit policy without actually deploying it and seeing how it performs with users. Intuitively it seems impossible to know how a new policy will perform looking only at past data because in a bandit problem you can only observe the rewards for an action that was taken. You don't have any data about the rewards for conterfactual actions that weren't tried. Inverse Propensity Scoring (IPS) is a simple technique which can solve this problem by giving an unbiased estimate of how a new bandit policy would perform if it were deployed using only data recorded by a previous, potentially different bandit policy. If none of these terms make sense, don't worry, we'll do a quick overview of the contextual bandit problem, and then go in depth on how to use IPS to evaluate policies.

### WTF is a "Contextual Bandit"?
Contextual Bandits are probably one of the most bizarrely named concepts in reinforcement learning. The idea is an extention of "[multi-armed bandits](https://en.wikipedia.org/wiki/Multi-armed_bandit)", which come from an old name for slot machines. Imagine you're at a casino faced with 4 slot machines. Each machine has a different chance of giving a payout, but you don't know the chance of winning for each machine. How should you play so as to maximize your winnings? You can spend time testing out each slot machine to get a better sense of the reward for each machine, but then you might be missing out on any potential rewards from just sticking with the machine that seems like it's the best from what you've seen so far.

<img src="/assets/bandits.png" alt="row of 4 slot machines" />
<i class="small">How should you play each machine to maximize your reward?</i>

For multi-armed bandits, an **action** corresponds to a possible choice you can make. In the example of 4 slot machines above, there are 4 possible actions, each refering to pulling the lever of one of the 4 slot machines. Furthermore, a **policy** is an algorithm which determines how you play. Typically a policy is probabilistic, so a policy expresses a probability distribution of taking each action. For instance, in the case above you could try a completely random policy and just pull an arm uniformly at random. Or you could try a policy that pulls lever 1 60% of the time and the other 3 levels each 10% of the time. Or the probability can change over type, starting out more random and becoming more deterministic over time.

Contextual bandits are a type of multi-armed bandit problem where you have some extra information that might be useful in determining which action to take. For instance, if you have an online store and you want to recommend an item to a user who visits your website, the item you choose to recommend might depend on the age and location of the user. Contextual bandit problems are very common in digital products where you have a set of items that can be shown to a user and the goal is to choose the best item to show that will optimize some metric, for instance the chance the user will buy your product.

### The counterfactual problem

Let's say you have an online store with several items, and currently you show those items to your users at random. You know this isn't optimal though, because you have some extra information about each of your users, like what they last purchased, their age, and their location. If someone just bought a pair of shoes from you, it probably doesn't make sense to try to show them that same pair of shoes immediately after. You have a log of data from your store for each time you showed an item to a user, and whether or not the user ended up purchasing the item.

How can you use this to data to try out different policies for showing items to users? For each user you only what happened after you showed the user 1 item; you don't have any way to know what would have happened if they had seen a different item instead. Maybe user X didn't buy when you showed them shoes, but maybe they would have if you had shown them a shirt. Or maybe they wouldn't have purchased anything regardless. You can try to come up with a new policy for how to pick which item to show to users on your website, but how can you tell how that policy would have performed given the data that's been logged so far?

It seems like this should be impossible, but IPS offers a way to estimate how well any new policy would have performed given the log for how items were gifted and received in the past, with some caveats as we'll see below.

### Inverse Propensity Score (IPS)

In order for IPS to work, the policy used to generate the log data must be probabilistic and have a non-zero probability of generating picking every action that the new policy we want to test can also generate. In general, as long as the policy that generates the data never assigns a 0 probability to any action at all you should be fine. Contextual Bandit libraries like [vowpal wabbit](https://vowpalwabbit.org) do this automatically. Also, in our data log where we record every action taken and the reward generated, we also need to record the probability of taking that action as output from the generating policy.

The idea behind IPS is to replay the log, and weigh each reward that shows up inversely to how likely the generating policy was to pick that action. This helps correct for the fact that actions that the generating policy selects more often will also show up more frequently in the logs than actions that aren't selected often. The adjusted reward is then either multiplied by 1 if the policy we're testing out also selected the same action as the generating policy given the context, or set to 0 if it selects a different action. Finally, these are results are averaged to give the expected reward of the policy we're testing. In python, this would look something like the following:

```python
def ips_estimate_avg_reward(new_policy, data_log):
    total_reward = 0
    for (reward, action, probability, context) in data_log:
        new_action, new_probability = new_policy(context)
        if new_action == action:
            total_reward += reward / probability
    return total_reward / len(data_log)
```

Not bad for 7 lines of code! Note that the `new_probability` generated by our new policy isn't needed for IPS, but if we were to deploy this policy we'd want to record it in the data log so we could continue running ips estimates of policies in the future.

### Improving on IPS

IPS isn't perfect, however. While it is an unbiased estimator of the expected reward of a new policy, it can have high variance. This is especially if the policy used to generate the data and the policy being tested are very different. IPS gives 0 reward for every case where the test policy and the generating policy select different actions, so if the policies have little overlap it will require a lot of data before IPS gives good estimates. There are other more complicated estimators that handle this better than IPS, such as [Doubly Robust](https://arxiv.org/abs/1103.4601), or [Importance-Weighted Regression](https://arxiv.org/abs/1802.04064).

All these techniques are implemented in the also bizarrely named but otherwise excellent [Vowpal Wabbit library](https://vowpalwabbit.org).