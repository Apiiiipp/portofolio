import { getGitHubRepos } from "@/lib/github";
import { GitHubSectionClient } from "@/components/sections/github-client";

export async function GitHubSection() {
  const repos = await getGitHubRepos();

  if (!repos.length) return null;

  return <GitHubSectionClient repos={repos} />;
}
