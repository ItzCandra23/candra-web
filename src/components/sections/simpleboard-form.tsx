"use client";

import JSZip from "jszip";
import { useEffect, useState } from "react";
import { DynamicForm } from "./dynamic-form";
import { v4 as uuidv4 } from "uuid";

export default function SimpleBoardForm({ dataZip, onDownload }: { dataZip: JSZip; onDownload?: () => void; }) {
  const [prefixFolder, setPrefixFolder] = useState<string>();
  const [hasSubmit, setHasSubmit] = useState<boolean>(false);
  
  let manifest: string;

  useEffect(() => {
    dataZip.forEach(async (rawpath, file) => {
      let filepath = rawpath;

      if (filepath.startsWith("SimpleBoard")) {
        const newFilepath = filepath.split("/");

        setPrefixFolder(newFilepath[0]);
        newFilepath.shift();

        filepath = newFilepath.join("/");
      }
      if (filepath === "manifest.json") {
        const rawfile = await file.async("text");

        manifest = rawfile;
      }
    });
  }, []);

  const handleSubmit = (e: Record<string, string>) => {
    setHasSubmit(true);

    if (e.hasOwnProperty("logo") && e.logo) {
      const path = (prefixFolder ? (prefixFolder + "/") : "") + "textures/ui/logo.png";
      
      dataZip.file(path, e.logo);
    }

    if (manifest && e.hasOwnProperty("title-pack")) {
      const path = (prefixFolder ? (prefixFolder + "/") : "") + "manifest.json";

      const newManifest = manifest.replace("\"§aSimpleBoard §d[NusaRP]\"", JSON.stringify(e["title-pack"] + " [SimpleBoard]"));
      
      manifest = newManifest;
      
      dataZip.file(path, newManifest);
    }

    if (manifest && e.hasOwnProperty("random-uuid")) {
      const path = (prefixFolder ? (prefixFolder + "/") : "") + "manifest.json";

      const newUUID = uuidv4()
      const newManifest = manifest.replace("\"578735e3-35dd-4b2f-807c-48e9dec61eab\"", JSON.stringify(newUUID));

      manifest = newManifest;
      
      dataZip.file(path, newManifest);
    }

    onDownload && onDownload();
  };

  return (
    <DynamicForm config={[
      {
        type: "image",
        id: "logo",
        name: "Logo",
        multiple: false,
      },
      {
        type: "text",
        id: "title-pack",
        name: "Title Pack",
        placeholder: "Custom Logo 1",
      },
      {
        type: "toggle",
        id: "random-uuid",
        name: "Random UUID",
        defaultValue: true,
      }
    ]} disabled={hasSubmit} submitText="Download" onSubmit={handleSubmit} />
  );
}