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

export async function getFile({ owner, repo, path, token }) {
  const url = `${API_BASE}/repos/${owner}/${repo}/contents/${path}`;
  const data = await githubRequest(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  const decoded = Buffer
    ? Buffer.from(data.content, "base64").toString("utf-8")
    : atob(data.content);
  return { content: JSON.parse(decoded), sha: data.sha };
}

export async function putFile({ owner, repo, path, token, content, sha, message }) {
  const url = `${API_BASE}/repos/${owner}/${repo}/contents/${path}`;
  const jsonString = JSON.stringify(content, null, 2);
  const encoded = Buffer
    ? Buffer.from(jsonString, "utf-8").toString("base64")
    : btoa(jsonString);

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
