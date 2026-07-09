const API_BASE = "https://api.github.com";

async function githubRequest(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      `GitHub API error (${response.status}): ${body.message ?? "Unknown error"}`
    );
  }
  return response.json();
}

function base64ToUtf8(base64) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64, "base64").toString("utf-8");
  }
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

function utf8ToBase64(str) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8").toString("base64");
  }
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export async function getFile({ owner, repo, path, token }) {
  const url = `${API_BASE}/repos/${owner}/${repo}/contents/${path}`;
  const data = await githubRequest(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  const decoded = base64ToUtf8(data.content);
  return { content: JSON.parse(decoded), sha: data.sha };
}

export async function putFile({ owner, repo, path, token, content, sha, message }) {
  const url = `${API_BASE}/repos/${owner}/${repo}/contents/${path}`;
  const jsonString = JSON.stringify(content, null, 2);
  const encoded = utf8ToBase64(jsonString);

  const data = await githubRequest(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({ message, content: encoded, sha }),
  });
  return { sha: data.content.sha };
}
