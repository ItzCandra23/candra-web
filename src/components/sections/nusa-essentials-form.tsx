"use client";

import { CheckBoxInput, DropdownInput } from "@/types/form";
import JSZip from "jszip";
import { useEffect, useState } from "react";
import { DynamicForm } from "./dynamic-form";
import NusaEssentials from "@/lib/nusa-essentials";
import { NusaPlugin } from "@/types/github";

export default function NusaEssentialsForm({ dataZip, onDownload }: { dataZip: JSZip; onDownload?: () => void; }) {
  const [prefixFolder, setPrefixFolder] = useState<string>();
  const [hasSubmit, setHasSubmit] = useState<boolean>(false);
  const [plugins, setPlugins] = useState<NusaPlugin[]>([]);

  const [pluginsFile, setPluginsFile] = useState<string>();
  const [runnerFile, setRunnerFile] = useState<string>();

  const [configMCCommands, setMCCommands] = useState<DropdownInput>({
    type: "dropdown",
    id: "minecraftcommands",
    name: "Minecraft Commands",
    options: [],
    require: true,
  });
  const [configPlugins, setConfigPlugins] = useState<CheckBoxInput>({
    type: "checkbox",
    id: "plugins",
    name: "Plugins",
    options: [],
    multiple: true,
    require: true,
  });

  useEffect(() => {
    NusaEssentials.getPlugins().then((plugins) => setPlugins(plugins));
  }, []);

  useEffect(() => {
    dataZip.forEach(async (rawpath, file) => {
      let filepath = rawpath;

      if (filepath.startsWith("NusaEssentials")) {
        const newFilepath = filepath.split("/");

        setPrefixFolder(newFilepath[0]);
        newFilepath.shift();

        filepath = newFilepath.join("/");
      }

      if (filepath === "scripts/runner.js") {
        const rawfile = await file.async("text");

        setRunnerFile(rawfile);

        if (rawfile.includes("export const EnableMinecraftCommands = true;")) {
          let configMinecraftCommands: DropdownInput = {
            type: "dropdown",
            id: "minecraftcommands",
            name: "Minecraft Plugins",
            options: [
              {
                id: "enable",
                name: "Enable",
                value: "enable",
                default: true,
              },
              {
                id: "disable",
                name: "Disable",
                value: "disable",
              },
            ],
            require: true,
          };

          setMCCommands(configMinecraftCommands);
        }
      }

      if (filepath === "scripts/plugins.js") {
        const rawfile = await file.async("text");

        setPluginsFile(rawfile);

        const startIndex = rawfile.indexOf("[");
        const endIndex = rawfile.indexOf("]") + 1;
        const rawjson = rawfile.substring(startIndex, endIndex).replace(/,\s*\]/, ']');

        const listplugins: string[] = JSON.parse(rawjson);

        let configPlugins: CheckBoxInput = {
          type: "checkbox",
          id: "plugins",
          name: "Plugins",
          options: listplugins.map((v) => {
            const plugin = plugins.find((_v) => _v.name === v);
            return { id: v, title: v, description: plugin?.description ?? v, value: v, dependencies: plugin?.dependencies, visit: plugin?.visit, checked: true };
          }),
          multiple: true,
          require: true,
        };

        setConfigPlugins(configPlugins);
      }
    });
  }, [plugins]);

  const handleSubmit = (e: Record<string, string>) => {
    setHasSubmit(true);

    if (pluginsFile && e.hasOwnProperty("plugins")) {
      const path = (prefixFolder ? (prefixFolder + "/") : "") + "scripts/plugins.js";
      const plugins = e.plugins;

      const startIndex = pluginsFile.indexOf("[");
      const endIndex = pluginsFile.indexOf("]") + 1;

      const newfile = pluginsFile.substring(0, startIndex) + JSON.stringify(plugins, undefined, 4) + pluginsFile.substring(endIndex);;

      dataZip.file(path, newfile);
    }

    if (runnerFile && e.hasOwnProperty("minecraftcommands")) {
      const path = (prefixFolder ? (prefixFolder + "/") : "") + "scripts/runner.js";
      const isEnable = e.minecraftcommands === "disable" ? "export const EnableMinecraftCommands = false;" : "export const EnableMinecraftCommands = true;";

      const newfile = runnerFile.replace("export const EnableMinecraftCommands = true;", isEnable);

      dataZip.file(path, newfile);

    }

    onDownload && onDownload();
  };

  return (
    <DynamicForm config={[ configMCCommands, configPlugins ]} disabled={hasSubmit} submitText="Download" onSubmit={handleSubmit} />
  );
}