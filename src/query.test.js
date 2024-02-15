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
});

async function waitForData(q) {
  await vi.waitFor(() => {
    if (!q.data) throw new Error("no data yet");
  });
}
