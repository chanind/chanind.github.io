---
layout: post
title: "ORMs Are Awesome"
date: 2020-01-13
---

It's popular to hate on [ORMs](https://en.wikipedia.org/wiki/Object-relational_mapping). They're big, they're complicated, and they get in between you and your data. Instead, the argument goes, you should get back to basics and lovingly hand-craft artisinal SQL to query your database. And yet, despite the constant criticism, everyone continues to use ORMs for nearly every serious project. This is because ORMs are, in fact, awesome. In this post, I'll go through some of the amazing things that become possible by putting an ORM layer in-between your database and your application logic. Not every ORM is created equal, and not every ORM has all the capabilities described here, but these are all things that are either impossible or extremely difficult to solve with one-off SQL throughout your application. ORMs aren't perfect, but they are amazing tools, and you're far better off using one.

## Caching

ORMs get criticised a lot for overfetching data, and there's an assumption that using an ORM must therefore be less performant that using raw SQL. This argument misses an amazing performance boost that ORMs make possible, which is object caching. It doesn't matter if using raw SQL shaves 5% of time off of a SQL query, when using an ORM makes it possible to cache and load entire objects without ever needing to hit the database! By always dealing with full objects, an ORM can cache objects by ID or other keys and avoid touching the database at all in many cases.

## Efficient writing and reading

ORMs can be a lot smarter about interacting with the database than is possible with hand-written SQL (without a lot of effort). For instance, intelligent ORMs can batch related reads/writes together, all while updating caches with query results. ORMs make it possible to tweak the way model loading works so, for instance, it's trivial to change model load from using a `JOIN` to using multiple queries where it's more efficient, or to batch groups of queries together to avoid [N + 1 query issues](https://secure.phabricator.com/book/phabcontrib/article/n_plus_one/).

## Cleaner code

90% of the time, you're loading models by a foreign key, or tracing relations across models. In these cases, there's no SQL to write at all when using an ORM; just simple, intuitive method calls. For example, compare something like `posts = user.posts` using an ORM vs something like:

```
  posts = db.execute(`
    SELECT *
    FROM posts
    WHERE posts.user_id = ?
  `, user_id)
```

For the few cases when you do still need all the control of raw SQL, you can still use it! ORMs let you drop down to as low a level as needed. You get much clearer code 90% of the time, and for the rest of the time, you can still write as convoluted SQL as your heart desires!

## Result typing

Assuming you're using a strongly-typed language, you gain the ability to have typed query results when using an ORM. ORMs can tell exactly what type of models will come back from queries, and that info can catch bugs throughout the rest of your code where those models are used. This is simply not possible when using raw SQL strings since your compiler has no way to know what's going to come back from the query.

## ORMs are awesome

For any serious project, you should be using an ORM. This doesn't mean ORMs are perfect - [the criticisms of them are often valid](https://martinfowler.com/bliki/OrmHate.html). There will be a learning curve, and using an ORM doesn't mean you don't need to learn how a database works. Despite all of this, the value ORMs provide is overwhelming, and powerful ORMs like [Sqlalchemy](https://www.sqlalchemy.org/) and [Hibernate](https://hibernate.org/) are amazing peices of software. ORMs deserve a lot more love, because ORMs are, in fact, awesome!


