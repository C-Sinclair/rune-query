import { describe, test, expect, vi } from "vitest";
import { createQuery } from "./query.svelte.js";

describe("createQuery", () => {
  test("does reactivity work here?", async () => {
    let { query } = createQuery(async () => "hello");
    let q = query();
    expect(q.data).toBe(undefined);
    await waitForData(q);
    expect(q.data).toBe("hello");
  });

  test("invalidate calls the fetcher", async () => {
    const spy = vi.fn(async () => "hello");
    let { query, invalidate } = createQuery(spy);

    let q = query();
    await waitForData(q);

    invalidate();
    expect(q.data).toBe("hello");
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test("loading is true initially until fetching is complete", async () => {
    let { query } = createQuery(async () => "hello");
    let q = query();
    expect(q.loading).toBe(true);
    await waitForData(q);
    expect(q.loading).toBe(false);
  });

  test("invalidate triggers the loading state to be true", async () => {
    let { query, invalidate } = createQuery(async () => "hello");
    let q = query();
    await waitForData(q);
    invalidate();
    expect(q.loading).toBe(true);
  });

  test("errors in the fetcher are reactively available", async () => {
    let { query } = createQuery(async () => {
      throw new Error("oh no");
    });
    let q = query();
    expect(q.error).toBe(undefined);
    await waitForError(q);
    expect(q.error?.message).toBe("oh no");
  });

  test("errors are cleared when the data is successfully fetched again", async () => {
    let fail = true;
    let { query, invalidate } = createQuery(async () => {
      if (fail) throw new Error("oh no");
      return "hello";
    });
    let q = query();
    await waitForError(q);
    expect(q.error?.message).toBe("oh no");
    expect(q.data).toBe(undefined);

    fail = false;
    invalidate();
    expect(q.error).toBe(undefined);
    await waitForData(q);
    expect(q.data).toBe("hello");
  });

  test.todo("multiple queries with the same arguments should hit the cache");
  test.todo("expiry should invalidate the cache");
});

async function waitForData(q) {
  await vi.waitFor(() => {
    if (!q.data) throw new Error("no data yet");
  });
}

/**
 *
 * @param {import("./query.svelte.js").QueryReturn} q
 */
async function waitForError(q) {
  await vi.waitFor(() => {
    if (!(q.error instanceof Error)) throw new Error("no data yet");
  });
}
