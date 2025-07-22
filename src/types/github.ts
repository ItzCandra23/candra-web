export interface GithubAsset {
  name: string;
  tag?: string;
  filename: string;
  url: string;
  download_url: string;
  body?: string;
}

export interface NusaPlugin {
  name: string;
  description: string;
  dependencies?: string[];
  visit?: string;
  author?: string;
  license?: string;
}