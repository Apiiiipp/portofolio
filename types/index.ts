import type { Project, Skill, Experience, Certificate, Post, Contact } from "@prisma/client";

export type { Project, Skill, Experience, Certificate, Post, Contact };

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  pushed_at: string;
  fork: boolean;
}

export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface SocialLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
}
