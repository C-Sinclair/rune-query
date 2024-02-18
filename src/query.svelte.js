/**
 * @type {import("./query.svelte").CacheObject}
 */
let cache = $state({});

const FIVE_MINUTES = 1000 * 60 * 5;

/**
 * @template T
 * @param {import("./query.svelte").Fn<T>} fn
 * @param {import('./query.svelte').CreateQueryConfig} config
 */
export function createQuery(fn, config = {}) {
  // a unique salt for each createQuery invocation
  const salt = Math.random().toString(36).substring(7);

  const { expiry = FIVE_MINUTES, invalidateDataOnError = false } = config;

  return {
    query(...args) {
      const key = serialize(fn, args, salt);

      if (cache[key]) {
        // check if the cache key has expired and is indeed of revalidation
        if (cache[key].expiry < Date.now()) {
          cache[key].fetcher();
        } else {
          // if not expired, return the cached data
          return {
            get data() {
              return cache[key].data;
            },
            get loading() {
              return cache[key].loading;
            },
            get error() {
              return cache[key].error;
            },
          };
        }
      }

      // the fetcher uses closures to re-run the same query with the same args when needed
      function fetcher() {
        cache[key].loading = true;
        cache[key].error = undefined;
        fn(...args)
          .then((result) => {
            // this is reactive, so mutating the data will be picked up by Svelte
            cache[key].data = result;
            cache[key].loading = false;
          })
          .catch((error) => {
            cache[key].error = error;
            cache[key].loading = false;

            if (invalidateDataOnError) {
              cache[key].data = undefined;
            }
          });
      }

      // add to the cache
      cache[key] = {
        expiry: Date.now() + expiry,
        data: undefined,
        error: undefined,
        loading: true,
        fetcher,
      };

      // immediately trigger the fetcher
      fetcher();

      // return reactive data for consumers
      return {
        get data() {
          return cache[key].data;
        },
        get loading() {
          return cache[key].loading;
        },
        get error() {
          return cache[key].error;
        },
      };
    },
    invalidate(...args) {
      const key = serialize(fn, args, salt);
      if (!cache[key]) {
        console.error("No query found for", key);
        return;
      }
      const { fetcher } = cache[key];
      fetcher();
    },
  };
}

/**
 *
 * @param {import("./query.svelte").Fn} f
 * @param {any[]} a
 * @param {string} salt
 * @returns {string}
 */
function serialize(f, a, salt) {
  return ((f && f["name"]) || "anonymous") + salt + JSON.stringify(a || "");
}
