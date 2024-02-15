# Rune Query

> A library for handling asynchronous functions with Runes

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
