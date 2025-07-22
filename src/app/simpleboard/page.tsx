"use client";

import { DynamicForm } from "@/components/sections/dynamic-form";
import { MarkdownWrapper } from "@/components/shared/markdown-wrapper";
import { SectionTitle } from "@/components/shared/section-title";
import { DropdownInput } from "@/types/form";
import ReactMarkdown from "react-markdown";
import JSZip from "jszip";
import { useEffect, useState } from "react";
import SimpleBoard from "@/lib/simpleboard";
import SimpleBoardForm from "@/components/sections/simpleboard-form";

export default function NusaEssentialsPage() {
  const [data, setData] = useState<JSZip>();
  const [filename, setFilename] = useState<string>();
  const [content, setContent] = useState<string>();

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
    SimpleBoard.getAllAssets().then((data) => {
      setConfigVersion(
        {
          ...configVersion,
          options: data.map((v) => ({ id: v.filename, name: v.name, description: v.filename, value: JSON.stringify([v.tag, v.filename, v.body]) })),
        }
      );
    });
  }, []);

  const handleVersion = async (e: Record<string, any>) => {
    if (!e?.target) return;

    const target = JSON.parse(e.target);
    if (!target?.length) return;

    setDisableVersion(true);

    const [ tag, filename, body ] = target;
    const response = await SimpleBoard.getFile(tag, filename);

    setFilename(filename);
    setContent(body);
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
        title="SimpleBoard" 
        subtitle="Customize your sideboard logo"
      />
      
      {data ? (
        <>
          {content && (
            <div className="max-w-4xl mx-auto mt-12">
              <MarkdownWrapper variant="transparent">
                <h2>{filename}</h2>
                <ReactMarkdown>{content}</ReactMarkdown>
              </MarkdownWrapper>
            </div>
          )}
          <SimpleBoardForm dataZip={data} onDownload={handleDownload} />
        </>
      ) : (
        <DynamicForm config={[configVersion]} disabled={disableVersion} onSubmit={handleVersion} />
      )}
    </div>
  );
}