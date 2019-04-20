---
layout: post
title: "The Case Against Blockchain"
date: 2019-04-19
categories: blockchain
---

Blockchain is a technically fascinating, but fundamentaly flawed technology. In this article I will lay out why I feel blockchain has no transformative use-cases outside of crypto-currency. I don't feel the issues discussed below are solvable, and thus, it's hard to envision a place for blockchain technology in the future aside from crypto-currency. Even within crypto-currency, public blockchains suffer from fundamental scalability problems that limit their utility as an actual currency. A lot of the ideas here are originally from a talk I saw by [Bobby Lee from BTCC](https://en.wikipedia.org/wiki/BTCC_(company)). My goal with publishing this article is to generate a discussion. If the arguments laid out here are incorrect, please explain why.

A key distinction in this discussion is the difference between **public blockchain** and **private blockchain**. Public blockchains are what most people think of as a blockchain, as this is what powers most crypto-currencies like Bitcoin and Ethereum. There are no admins or owners in a public blockchain, and everything is fully decentralized. For example, if you lose the key to your bitcoin wallet there's no one that can recover your wallet for you - it's simply gone forever. This decentralization is extremely powerful, but also causes practical problems since, well, there are a lot of times when an "admin" of some sort is needed. Private blockchains try to solve this issue by adding admins that have superuser powers within the system, and effectively "own" the blockchain.

Below, I will lay out the argument that private blockchains have no practical advantages over traditional databases yet suffer from far worse performance. I will also argue that the lack of an admin in public blockchains means they cannot be used for any system which interacts with real-world data, thus limiting their utility. Furthermore, I will argue that public blockchains become less scalable the more they are used, which further limits their use to low-scalability applications.

## Private blockchains have no advantage over a traditional database

A key point to understand is that a Blockchain is just a database - data can be written into a blockchain and read back out from it. The question then becomes whether a blockchain is a *better* database than other databases. Performance-wise, blockchains are orders of magnitude worse than traditional databases due to being so heavily distributed and needing to seek consensus between a potentially unbounded number of nodes. This is just a result of the way blockchains work, so there's not a clever engineering solution that will change this underlying calculus.

In the case of public blockchains, one can argue that the advantages of a fully decentralized system where nobody has complete control outweighs the poor write performance of blockchain as a database. Private blockchains, however, cannot make this claim. If an admin's account in a private blockchain gets hacked the result is just as disastrous as if an admin's account were to be hacked in a traditional database-backed system. In both private blockchains and traditional database-backed applications, normal users must just trust that the admins are not going to abuse their power.

The argument here is not that it's impossible to use private blockchains to build applications, but rather that in every case where a private blockchain could be used it would instead be better to use a traditional database or other non-blockchain solution. There is nothing that a private blockchain can do that can't already be done more efficiently with a traditional non-blockchain application.

For example, let's imagine that the National Weather Service decides they want to publish the weather each day. They could set up a private blockchain where only they have write access and use it to add an entry for the weather every day, and this would work. However, they could also just set up a traditional database-backed application like a website / CDN and publish the weather each day there. In both cases, normal users need to trust that the National Weather Service is writing correct data, and in both cases the same data is being transmitted. However, the private blockchain solution is significantly more complicated and it's hard to imagine a case where it would be preferable to a non-blockchain solution of some sort.


## Public blockchains cannot ensure that data in the system matches external reality 

A challenge in public blockchain systems is that it's difficult to ensure that any data written into the system matches reality outside of the system. For example, imagine there's a public blockchain where users can enter what the temperature is in various parts of the world. I can log in to the system and write that it's 55 C in Paris today. Just because that's entered into a public blockchain doesn't make it true, though, and a public blockchain has no admins so there's nobody who can force the blockchain to match reality.

This problem is known as an [oracle problem](https://www.reddit.com/r/Bitcoin/comments/2p78kd/the_oracle_problem/), and it's a problem in general whenever data from an outside source needs to be entered into a computer system in order to make decisions. The idea is that the source of the data is an "oracle", and the system needs to be able to trust the oracle to be giving correct data. However in a decentralized public blockchain the issue is much more severe since there's no admins that can correct things if they go astray (a malicious or inaccurate oracle), and violates the idea that a public blockchain makes it possible to trust external actors without a centralized authority.

As a result, public blockchains can only be used to safely manage data when the data all exists internally to the system. For example, blockchains are able to manage crypto-currencies like Bitcoin because the notion of a coin and who has which coins are all fully contained within the blockchain. It's difficult to imagine a lot of other use-cases besides currency, or maybe virtual worlds in games (ex crypto-kitties), where the entirety of the system can be contained within the blockchain thus avoiding this issue.


## Public blockchains cannot react to fraud, misuse, or unforseen circumstances

The strength of public blockchains is that there are no admins or owners who have special access to the system. This strength, however, is also a weakness when it comes to dealing with fraud, user error, or unforseen circumstances in general.

For example, a commonly cited example of where a public blockchain could be used is to manage land deeds. You could imagine a public blockchain system where you can keep track of who owns which piece of land in a town. Ignore for a moment the problem of ensuring that the blockchain matches reality mentioned above - let's assume the blockchain was somehow created from the start with each piece of land in the town allocated correctly to each citizen. However, now imagine that a citizen loses their encrypted key to access the system. There's no admins in a public blockchain, so what happens to the land the citizen owns? Can they never sell or transfer it ever again? Or, what happens if their access key is stolen and the land deed is transferred without their knowledge? Do they now have to leave their home, because there's no admins in this system who can set things straight?

This is also an issue with public blockchains in crypto-currency. Supposedly around [20% - 30%](https://www.quora.com/What-percentage-of-bitcoins-have-been-lost-forever) of bitcoins have been lost forever after owners lost access to their wallets.

It's hard to imagine a lot of use-cases where it's acceptable for victims of fraud or simple forgetfulness to be locked out of their accounts forever with no recourse.


## Public blockchains become less scalable the more popular they become

Public blockchains maintain trust in the system by having a large number of independent nodes that aren't owned by a single entity, so that 51% of these nodes agreeing on a transaction is enough to ensure a transaction is valid. As a blockchain becomes more popular, more nodes are added to the network, so more nodes need to be made aware of every transaction in order for it to be added to the blockchain. This dynamic is mathematically unscalable, as it basically means that the more popular a blockchain becomes the less scalable it becomes. The issue is that blockchains have a poor big-O, and thus cannot scale as well as other systems. This dynamic means that crypto-currencies, for example, can never process as many transactions as quickly and cheaply as a typical centralized credit card network can. This also limits how useful public blockchains can be as it means public blockchains cannot be used for applications requiring high scalability.


## I want to be wrong on this

Public blockchains generated a lot of excitement because of their ability to maintain trust in a decentralized system without any admins or owners. However, as laid out above, there are a number of limitations with the core of how blockchains work that I feel is crippling to the technology and means it can't deliver on the promise of being transformative technology. If there's something I'm missing in this analysis, please let me know. I would love to be wrong on this!
