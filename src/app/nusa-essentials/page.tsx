"use client";

import { DynamicForm } from "@/components/sections/dynamic-form";
import NusaEssentialsForm from "@/components/sections/nusa-essentials-form";
import { SectionTitle } from "@/components/shared/section-title";
import NusaEssentials from "@/lib/nusa-essentials";
import { DropdownInput, JsonForm } from "@/types/form";
import JSZip from "jszip";
import { useEffect, useState } from "react";

export default function NusaEssentialsPage() {
  const [data, setData] = useState<JSZip>();
  const [filename, setFilename] = useState<string>();

  const [disableVersion, setDisableVersion] = useState<boolean>(false);
  const [configVersion, setConfigVersion] = useState<DropdownInput>(
    {
      id: "target",
      type: "dropdown",
      name: "Select Version",
      options: []
    }
  );

  useEffect(() => {
    NusaEssentials.getAllAssets().then((data) => {
      setConfigVersion(
        {
          ...configVersion,
          options: data.map((v) => ({ id: v.filename, name: v.name, description: v.filename, value: `["${v.tag}", "${v.filename}"]` })),
        }
      );
    });
  }, []);

  const handleVersion = async (e: Record<string, any>) => {
    if (!e?.target) return;

    const target = JSON.parse(e.target);
    if (!target?.length) return;

    setDisableVersion(true);

    const [ tag, filename ] = target;
    const response = await NusaEssentials.getFile(tag, filename);

    setFilename(filename);
    setData(response);
  };

  const handleDownload = async () => {
    if (!data || !filename) return;

    const modifiedZip = await data.generateAsync({ type: 'blob' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(modifiedZip);
    downloadLink.download = filename;
    downloadLink.click();
  };
  
  return (
    <div className="container mx-auto px-4 py-20">
      <SectionTitle 
        title="Nusa Essentials" 
        subtitle="Customize your nusa essentials addon before download"
      />
      
      {data ? (
        <NusaEssentialsForm dataZip={data} onDownload={handleDownload} />
      ) : (
        <DynamicForm config={[configVersion]} disabled={disableVersion} onSubmit={handleVersion} />
      )}
    </div>
  );
}