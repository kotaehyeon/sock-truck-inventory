import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { getFile, putFile } from "../js/githubApi.js";

test("getFile decodes base64 JSON content and returns sha", async () => {
  const fakeJson = JSON.stringify([{ id: "p001" }]);
  const fakeBase64 = Buffer.from(fakeJson, "utf-8").toString("base64");
  globalThis.fetch = mock.fn(async () => ({
    ok: true,
    json: async () => ({ content: fakeBase64, sha: "abc123" }),
  }));

  const result = await getFile({
    owner: "me",
    repo: "sock-truck-inventory",
    path: "data/products.json",
    token: "tok",
  });

  assert.deepEqual(result.content, [{ id: "p001" }]);
  assert.equal(result.sha, "abc123");
});

test("putFile sends base64-encoded content with sha for update", async () => {
  let capturedBody;
  globalThis.fetch = mock.fn(async (url, opts) => {
    capturedBody = JSON.parse(opts.body);
    return { ok: true, json: async () => ({ content: { sha: "new-sha" } }) };
  });

  const result = await putFile({
    owner: "me",
    repo: "sock-truck-inventory",
    path: "data/products.json",
    token: "tok",
    content: [{ id: "p002" }],
    sha: "abc123",
    message: "update products",
  });

  assert.equal(capturedBody.sha, "abc123");
  assert.equal(capturedBody.message, "update products");
  assert.equal(
    Buffer.from(capturedBody.content, "base64").toString("utf-8"),
    JSON.stringify([{ id: "p002" }], null, 2)
  );
  assert.equal(result.sha, "new-sha");
});

test("getFile and putFile round-trip Korean text without Buffer (simulated browser)", async () => {
  const originalBuffer = globalThis.Buffer;
  // Simulate a browser: Buffer is not a declared global there, so a bare
  // reference (not typeof) throws ReferenceError. Deleting it here forces
  // the module's atob/btoa + TextEncoder/TextDecoder fallback path.
  delete globalThis.Buffer;

  try {
    const fakeData = [{ id: "p000001", name: "발목양말" }];
    let capturedBody;
    globalThis.fetch = mock.fn(async (url, opts) => {
      if (opts && opts.method === "PUT") {
        capturedBody = JSON.parse(opts.body);
        return { ok: true, json: async () => ({ content: { sha: "new-sha" } }) };
      }
      return {
        ok: true,
        json: async () => ({
          content: capturedBody.content,
          sha: "abc123",
        }),
      };
    });

    const putResult = await putFile({
      owner: "me",
      repo: "sock-truck-inventory",
      path: "data/products.json",
      token: "tok",
      content: fakeData,
      sha: "abc123",
      message: "update products",
    });
    assert.equal(putResult.sha, "new-sha");

    const getResult = await getFile({
      owner: "me",
      repo: "sock-truck-inventory",
      path: "data/products.json",
      token: "tok",
    });
    assert.deepEqual(getResult.content, fakeData);
  } finally {
    globalThis.Buffer = originalBuffer;
  }
});

test("getFile throws with readable message on non-ok response", async () => {
  globalThis.fetch = mock.fn(async () => ({
    ok: false,
    status: 404,
    json: async () => ({ message: "Not Found" }),
  }));

  await assert.rejects(
    () =>
      getFile({
        owner: "me",
        repo: "sock-truck-inventory",
        path: "data/missing.json",
        token: "tok",
      }),
    /GitHub API error \(404\): Not Found/
  );
});
