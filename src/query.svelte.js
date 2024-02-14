/**
 * @type {CacheObject}
 */
let cache = $state({});

const FIVE_MINUTES = 1000 * 60 * 5;

/**
 *
 * @param {Fn} fn
 * @param {number | undefined} expiry
 * @returns {Queryable}
 */
export function createQuery(fn, expiry = FIVE_MINUTES) {
  // a unique salt for each createQuery invocation
  const salt = Math.random().toString(36).substring(7);

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
          };
        }
      }

      // the fetcher uses closures to re-run the same query with the same args when needed
      function fetcher() {
        fn(...args).then((result) => {
          // this is reactive, so mutating the data will be picked up by Svelte
          cache[key].data = result;
        });
      }
      // immediately trigger the fetcher
      fetcher();

      // add to the cache
      cache[key] = {
        expiry: Date.now() + expiry,
        data: undefined,
        fetcher,
      };

      // return reactive data for consumers
      return {
        get data() {
          return cache[key].data;
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
 * @param {Fn} f
 * @param {any[]} a
 * @param {string} salt
 * @returns {string}
 */
function serialize(f, a, salt) {
  return ((f && f["name"]) || "anonymous") + salt + JSON.stringify(a || "");
}
