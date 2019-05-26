---
layout: post
title: "GraphQL: Fixing Breaking Schema Changes"
date: 2019-05-26
---

GraphQL is an amazing technology, but in practice it has a glaring problem: **simple schema changes often break existing clients**. This is made worse by [GraphQL's stance against versioning your API](https://graphql.org/learn/best-practices/#versioning). It's common for APIs to change over time, and while GraphQL is great at adding new fields and deprecating old fields, it has a lot of trouble when arguments or types of queries/mutations change. Below, we'll walk through the problem and a clever solution involving rewriting breaking queries in middleware.

_tldr; if you're using Node JS, check out [GraphQL Query Rewriter](https://github.com/ef-eng/graphql-query-rewriter)!_

For example, let's imagine we have a GraphQL API that works with the following query from a mobile client:

```graphql
query getUserById($id: String!) {
  userById(id: $id) {
    ...
  }
}
```

If you use a lot of GraphQL you'll immediately realize this query has a problem - `$id` should be of type `ID!`, not of type `String!`. In reality `ID!` is encoded as a string anyway, but it's best practice to declare the type as `ID!` in GraphQL. However, if we update our schema so that `id` is of the correct type `ID!`, then our existing clients will start getting errors that `Variable "$id" of type "String!" used in position expecting type "ID!"`. GraphQL APIs are not supposed to be versioned, so your only options are to just keep using the incorrect `String!` type forever, or make a new field with a name like `userByIdNewVersion(id: ID!)` and deprecating the old field. This leaves you with a confusing and embarassingly named API field forever. There must be a better way!

## Rewrite broken queries in middleware

The best solution would be if we could put something between our client and our server that could just quietly swap the text `$id: String!` with the text `$id: ID!` in old queries so that we can update our API, and old clients can keep working. Nothing breaks, and our API is a lot nicer. The natural place for this sort of functionality is in middleware, so we can rewrite our old breaking queries before our graphql server processes them.

This sort of breaking change is especially common when developers are new to GraphQL and may not be as familiar with GraphQL best practices, like using input and output objects for mutations, or any time types of parameters are changed or renamed. Fortunately, rewriting breaking queries in middleware can make it possible to seamlessly fix these sorts of GraphQL API errors without breaking existing clients.

## GraphQL Query Rewriter for JS

If you're using NodeJS for your graphQL server you can use the [GraphQL Query Rewriter](https://github.com/ef-eng/graphql-query-rewriter) module to make this query rewriting process easy. This module allows you to set up query rewrite rules so that matching broken queries get rewritten to valid queries. It can handle modifying mutations to add input and output types, as well as renaming parameters and types. [Check it out here!](https://github.com/ef-eng/graphql-query-rewriter)
