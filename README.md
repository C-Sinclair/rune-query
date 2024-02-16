# Rune Query

> A library for handling asynchronous functions with Runes

[![.github/workflows/test.yaml](https://github.com/C-Sinclair/rune-query/actions/workflows/test.yaml/badge.svg)](https://github.com/C-Sinclair/rune-query/actions/workflows/test.yaml)

## Usage

```js
// in your svelte component or .svelte.js/ts files
let { query, invalidate } = createQuery(async (args) => { .../* some data to be fetched */ });

let q = query({ id: 123 });

// loading is true initially until the asynchronous function completes
q.loading;

// The data can be found in the data key
q.data;

// later, you may wish to invalidate the current data, and refetch
invalidate();
// That's it, the reactive `data` and `loading` values above will reactively update
```

### Type inference

The type for `data` is inferred from the `ReturnType` of your async function. This means no manually typing expected types etc.

```ts
let { query } = createQuery(async () => 123);
query.data; // number | undefined
let { query } = createQuery(async () => "hello world");
query.data; // string | undefined

// when loading is complete, the data type will resolve to just the type (not undefined anymore)
if (!query.loading) {
  query.data; // string
}
```
