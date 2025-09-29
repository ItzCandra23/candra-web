"use client";

import { GithubAsset } from "@/types/github";
import JSZip from "jszip";

namespace TapperNPC {

  const baseURL = "https://api.github.com/repos/ItzCandra23/TapperNPC/releases";

  export async function getReleases() {
    try {
      const response = await fetch(baseURL);
      if (!response.ok) return undefined;

      const data = await response.json();
      if (!data.length) return undefined;

      return data;
    } catch(err) {
      return undefined;
    }
  }

  export async function getRelease(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) return undefined;

      const data = await response.json();
      if (!data.assets) return undefined;

      return data;
    } catch(err) {
      return undefined;
    }
  }

  export async function getAssets(url: string): Promise<GithubAsset[]|undefined> {
    try {
      const response = await fetch(url);
      if (!response.ok) return undefined;

      const data = await response.json();
      if (!data.assets) return undefined;

      const name = data.name;

      return data.assets.filter((v: any) => v.name.startsWith("TapperNPC-")).map((v: any) => ({ name, filename: v.name, url: v.url, download_url: v.browser_download_url }));
    } catch(err) {
      return undefined;
    }
  }

  export async function getAsset(id: number, name?: string): Promise<GithubAsset|undefined> {
    const url = baseURL + "/assets/" + id;

    try {
      const response = await fetch(url);
      if (!response.ok) return undefined;

      const data = await response.json();
      if (!data.name) return undefined;

      let result: GithubAsset = {
        url: data.url,
        name: name || data.name,
        filename: data.name,
        download_url: data.browser_download_url,
      };

      return result;
    } catch(err) {
      return undefined;
    }
  }

  export async function getAllAssets(): Promise<GithubAsset[]> {
    try {
      const response = await fetch(baseURL);
      if (!response.ok) return [];

      const data: {
        url: string;
        name: string;
        tag_name: string;
        assets: {
          url: string;
          name: string;
          browser_download_url: string;
        }[];
        body: string;
      }[] = await response.json();
      if (!data.length) return [];
      
      let result: GithubAsset[] = [];

      for (const release of data) {
        const assets: GithubAsset[] = release.assets.filter(v => v.name.startsWith("TapperNPC-")).map(v => ({ url: v.url, name: release.name, tag: release.tag_name, filename: v.name, download_url: v.browser_download_url, body: release.body }));

        result.push(...assets);
      }

      return result;
    } catch(err) {
      return [];
    }
  }

  export async function getFile(tag: string, filename: string) {
    try {
      const urlParams = new URLSearchParams({
        tag,
        filename,
      });

      const response = await fetch("/tappernpc/download?" + urlParams.toString());
      if (!response.ok) return undefined;

      const zipData = await response.arrayBuffer();
      const zip = await JSZip.loadAsync(zipData);
      
      return zip;
    } catch(err) { return undefined; }
  }
}

export default TapperNPC;