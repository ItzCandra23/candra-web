export interface NusaEssentialsAsset {
  name: string;
  tag?: string;
  filename: string;
  url: string;
  download_url: string;
}

export interface NusaPlugin {
  name: string;
  description: string;
  dependencies?: string[];
  visit?: string;
  author?: string;
  license?: string;
}