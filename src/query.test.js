import { describe, test, expect, vi } from "vitest";
import { createQuery } from "./query.svelte.js";

describe("createQuery", () => {
  test("does reactivity work here?", () => {
    let { query } = createQuery(async () => "hello");
    let q = query();
    expect(q.data).toBe("hello");
  });

  test("invalidate calls the fetcher", () => {
    const spy = vi.fn(async () => "hello");
    let { query, invalidate } = createQuery(spy);

    let q = query();
    invalidate();
    expect(q.data).toBe("hello");
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
