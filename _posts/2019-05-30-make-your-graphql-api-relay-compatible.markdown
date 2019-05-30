---
layout: post
title: "Make your GraphQL API Relay-Compatible"
date: 2019-05-30
---

Relay has largely lost the GraphQL client wars to Apollo, but there's still a lot of good reasons to follow its conventions when building a GraphQL API. Relay is a lot more opinionated than Apollo about how a GraphQL API should be structured, and even if you're not using Relay these are good conventions to follow. Following these conventions will lead to a cleaner, more standardized, better-designed API that avoids a lot of pitfalls you may fall into when starting with GraphQL. Furthermore, there's a lot of already-built tooling which help you make your API compatible with Relay's conventions with minimal effort. Below, we'll go through the key requirements of a Relay-compatible API, and how you can implement them easily using the offical [graphql-relay](https://github.com/graphql/graphql-relay-js) package. If you're not using NodeJS, most GraphQL server implementations also make it easy to make your API Relay-compliant, ex [Graphene](https://docs.graphene-python.org/en/latest/relay/).

## Global IDs and the Node API

Relay has the concept of a `Node` interface, which most resources in your API should implement. This interface just has an `id` field, and the ID must be globally unique. Furthermore, Relay requires an endpoint called `node(id: ID!)` which can look up any `Node` by its ID.

In general, any "resource" in your API that would normally have an ID should be a `Node`. If you imagine building an API for a school, your `Node`s might be things like `Student`, `Teacher`, `Classroom`, etc... - anything that can be looked up by ID.

Following this convention has a number of benefits. First, having globally unique IDs means your frontend can keep a big cache of every node object it loads and easy update the cache whenever a new version of the node object is loaded anywhere in your app. Furthermore, the `node(id: ID!)` endpoint makes it easy to load more detailed data about any node object later without requiring adding any extra endpoints to your API.

For example, imagine we have a classroom overview page on our school app which lists the name of every student in the class. When a user clicks on a student, the app can load more data about that specific student via the `node` endpoint like below:

```
query loadStudentInfo($studentId: ID!) {
  node(id: $studentId) {
    ... on Student {
      name
      birthday
      currentGrade
      # etc...
    }
  }
}
```

The [graphql-relay](https://github.com/graphql/graphql-relay-js) package has a number of helpers for working with global IDs and creating the `node(id: ID!)` endpoint and `Node` interface.

## Input and Output Types for Mutations

Relay requires that all mutations take a input type named `input` containing an optional `clientMutationId` as well. The `clientMutationId` can be used to deduplicate mutations if you want, but is not strictly required. Mutations must also have their own unique output type. The input and output types must also match the name of the mutation, so for a mutation called `createUser`, the input type would be called `createUserInput` and the output type would be called `createUserPayload`, like below:

```
Mutation createUser(input: CreateUserInput!): CreateUserPayload
```

Using input types keep your mutations clean and concise, especially for complex mutations. Using a separate output type for each mutation makes it easy to add fields or modify the output of a mutation without affecting any other objects in the API. Furthermore, following the Relay naming convention of `[mutation name]Input` for the input, and `[mutation name]Payload` for the output keeps your API standardized. If you use the [graphql-relay](https://github.com/graphql/graphql-relay-js) package there's a `mutationWithClientMutationId` helper which makes creating a Relay-compatible mutation even easier than creating a normal mutation with the `graphql` package.

## Cursor-based Pagination

Relay is opinionated about how pagination should work in a GraphQL API. Relay uses a pagination structure like below:

```
{
  user {
    id
    name
    friends(first: 10, after: "opaqueCursor") {
      edges {
        cursor
        node {
          id
          name
          # etc...
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
```

In the above example, `friends` is a paginated list of `User` nodes. Pages are loaded by calling the query again with the previous `endCursor` as the `after` param (or any `cursor` from an `edge`). The structure looks complicated, but it's well-designed, battle-tested, and is the most standard way of doing pagination in GraphQL APIs. A full spec for Relay's pagination can be found in the [Relay docs](https://facebook.github.io/relay/graphql/connections.htm).

If you're using the [graphql-relay](https://github.com/graphql/graphql-relay-js) package, you'll get this pagination structure for free by using the `connectionDefinitions()` helper. There's a [number of other helpers](https://github.com/graphql/graphql-relay-js#connections) to make it easy to translate offset / limit (ex from a database) into this structure as well.

Of course, you can still use a normal flat GraphQL list for situations when you don't need pagination.

## And that's it!

Relay's spec may look daunting at first, but following it is a best practice and will save a lot of pain down the road. Furthermore, There's a number of libraries and helpers to make following Relay's conventions easy no matter which GraphQL server library you're using.

Happy Querying!
