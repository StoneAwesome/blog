interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: Tree[];
  truncated: boolean;
}

interface Tree {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
}

export async function grabAllFileNamesForCollection(
  collection: "posts" | "instagram",
  trimExtension: boolean = true
) {
  const response = await fetch(
    `https://api.github.com/repos/StoneAwesome/blog/git/trees/main:content/${collection}`
  );
  const data: GitHubTreeResponse = await response.json();

  if (trimExtension) {
    return data.tree.map((t) => t.path.replace(/\.[\w\d]{1,5}$/i, ""));
  }

  return data.tree.map((t) => t.path);
}
