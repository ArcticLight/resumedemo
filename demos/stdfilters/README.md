# stdFilters.js
As explained on the Home page (see the root README, or if you're viewing this online, 
click on Home in the nav), `stdFilters.js` implements a construction of a
GraphQL filtering interface. The expectation of its use is that some long list of objects
is known _already_ (it was loaded into memory, or has already been fetched) and we want
to return a subset of that list. We also want to be able to do this for an arbitrary
GraphQL type, on arbitrary scalars. 

For my use-case, some of the filters may be expensive to compute. For example, they may
require fetching additional data. This is the case where the scalar in question is related
to another graph edge. Consider this (admittedly contrived) example:
```graphql
type Patron {
  name: String!
  heldBooks: [Book!]!
}
type Book {
  title: String!
  heldByPatron: [Patron!]!
}
type Query {
  books( ... ): [Book!]!
}
```
If we want to implement a filter such that you can do
```graphql
{
  books(filter: {heldByPatron: {in: ["Bob", "Mary"]}}) {
    title
  }
}
```
then the filter implementation may need to look at Patrons to filter the books. In my
case, the `heldByPatron` list is a resolver on `Book` that inspects the list of
`Patron`s. But since the list of `Patron`s holding `Book`s isn't directly known on `Book`
objects, then the filter needs to know to perform this lookup as well.

Using JavaScript, we can create a small indirection for the purposes of filtering by using
a mapping function.

Simple key lookups are easy:
```javascript
{
  title: {
    gqType: 'String',
    mapper(/** @type {Book} */ b) {
      return b.title;
    },
  },
}
```

Other lookups might need to join other data (and may result in a list):
```javascript
{
  heldByPatron: {
    gqType: 'String',
    type: 'list',
    mapper(/** @type {Book} */ b) {
      return getPatronsHoldingBook(b);
    },
  },
}
```

It should be obvious that we _can_ do this filtering this way. But why not just
write the filter by hand? The extra layer of indirection seems obnoxious at first glance.

The problem is that, in order to do filtering on GraphQL types _in GraphQL_, we also
need to construct an input type implementing the filter parameters. If we wrote all the
filters by hand, we'd also need to write all these GraphQL types by hand. And then, in
addition, if we wanted to ensure that we were using our own filters correctly we'd want
to write some type annotations (I like TypeScript but there are other things too, like
Flow) to help us out. That's a lot to maintain just to do a little filtering.

`stdFilters.js` implements both of these things, which I've been using on my personal
project and it meets my need here. The appropriate GraphQL input type for the filtering
is constructed based on the filter configuration, and the resulting `execute()` function
is given the correct, type-safe construction via metaprogramming (i.e. a very complex
generic function) in TypeScript.

Here is an example of its typings in TypeScript
(this can be verified in the TypeScript Playground):
```typescript
type StdFilterFunc = <O extends Record<string, {
  gqType: string;
  type?: 'single';
  mapper: (thing: U) => any;
} | {
  gqType: string;
  type: 'list';
  mapper: (thing: U) => any[];
}>, U = any>(
  baseTypename: string,
  filterSpec: O,
  inferExample?: U,
) => {
  inputTypename: string;
  schema: string;
  execute: (
    <R extends U>(
      list: R[],
      inputs: {
        [k in keyof O]: Partial<{
          eq: (ReturnType<O[k]['mapper']> extends (infer X)[] ? X : ReturnType<O[k]['mapper']>);
          in: (ReturnType<O[k]['mapper']> extends any[] ? ReturnType<O[k]['mapper']> : ReturnType<O[k]['mapper']>[]);
          nin: (ReturnType<O[k]['mapper']> extends any[] ? ReturnType<O[k]['mapper']> : ReturnType<O[k]['mapper']>[]);
        }>
      }
    ) => R[]
  );
}

// Assume stdFilters exists.
declare const stdFilters: StdFilterFunc;

// I have some type that looks like this:
type MyType = {id: number}

// I declare my filter spec:
const Spec = {
    id: {
      gqType: 'Id!',
      mapper: (myType: MyType) => myType.id,
    }
  };

// Specifying the generic type parameters directly,
// to construct a filter:
const filters = stdFilters<typeof Spec, MyType>(
  'MyType',
  Spec,
);

// There's a bit of trouble getting type inference
// to work nicely on this case, but by using an
// optional third argument (not even used by the stdFilters
// function), TypeScript can infer the shape of the
// generic parameter `U`, so this works also:
const inferredTypeFilters = stdFilters(
  'MyInferredType',
  Spec,
  {id: 1},
);

// A 'good' example list:
const things = [
  {id: 1},
  {id: 2},
];

// A 'bad' example list:
const badThings = [
  {not: 1},
]

// Successful use of a filter:
// (onlyTwo has type `{id: number}[]`, which is assignable to `MyType[]`)
const onlyTwo = filters.execute(things, {
  id: {
    eq: 2
  }
});

// Catching errors 1:
// badThings can't be filtered on, it does not contain
// objects of the right shape to be filtered.
const shouldErrorOne = filters.execute(badThings, {
  id: {
    in: [4]
  }
});

// Catching errors 2:
// this filter spec is wrong; `bad` is not a proper filter key.
const shouldErrorTwo = filters.execute(things, {
  bad: {
    in: [4]
  }
})

// Catching errors 3:
// this filter spec is wrong; `id` is a key, but `{is: 4}` is not a good spec.
const shouldErrorThree = filters.execute(things, {
  id: {
    is: 7
  }
})
```
