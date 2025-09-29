"use client";

import JSZip from "jszip";
import { useEffect, useState, useRef } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { FormRenderer } from "../shared/form-renderer";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

async function isRealImageClient(file: File): Promise<boolean> {
  if (!file) return false;
  try {
    const bmp = await createImageBitmap(file);
    bmp.close();
    return true;
  } catch {
    return false;
  }
}

export default function CustomNPCForm({ dataZip, onDownload }: { dataZip: JSZip; onDownload?: () => void; }) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [editingPosition, setEditingPosition] = useState<number | null>(null);
  const positionInputRef = useRef<HTMLInputElement>(null);

  const [prefixFolder, setPrefixFolder] = useState<string>();
  const [hasSubmit, setHasSubmit] = useState<boolean>(false);

  const [render_controllers, set_render_controllers] = useState<string>();
  const [manifest, set_manifest] = useState<string>();

  useEffect(() => {
    dataZip.forEach(async (rawpath, file) => {
      let filepath = rawpath;

      if (filepath.startsWith("CustomNPC")) {
        const newFilepath = filepath.split("/");

        setPrefixFolder(newFilepath[0]);
        newFilepath.shift();

        filepath = newFilepath.join("/");
      }
      if (filepath === "render_controllers/npc.render_controllers.json") {
        const rawfile = await file.async("text");

        set_render_controllers(rawfile);
      }
      if (filepath === "manifest.json") {
        const rawfile = await file.async("text");

        set_manifest(rawfile);
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmit(true);

    const data = formData;
    
    const manifest_path = (prefixFolder ? (prefixFolder + "/") : "") + "manifest.json";
    let newManifest = manifest ?? "";

    if (render_controllers && data.hasOwnProperty("skins")) {
      const render_controller_path = (prefixFolder ? (prefixFolder + "/") : "") + "render_controllers/npc.render_controllers.json";
      const prefixpath = (prefixFolder ? (prefixFolder + "/") : "") + "textures/entity/npc/npc_";
      const skins = data.skins as [File, "wide"|"slim"][];
      const registeredGeos: string[] = [];
      const registeredSkins: string[] = [];
      
      skins.forEach(([file, type], i) => {
        registeredGeos.push(type === "slim" ? "Geometry.slim" : "Geometry.wide");
        registeredSkins.push(`Texture.npc_${i + 1}`);

        dataZip.file(`${prefixpath}${i + 1}.png`, file);
      });

      const newRenderControllers = render_controllers.replace(`["Geometry.wide", "Geometry.slim"]`, JSON.stringify(registeredGeos)).replace(`["Texture.npc_1", "Texture.npc_2"]`, JSON.stringify(registeredSkins));

      set_render_controllers(newRenderControllers);

      dataZip.file(render_controller_path, newRenderControllers);
    }

    if (manifest && data.hasOwnProperty("title-pack")) {
      newManifest = newManifest.replace("\"Custom NPC\"", JSON.stringify(data["title-pack"] + " [CustomNPC]"));
    }

    if (manifest && data.hasOwnProperty("random-uuid") && data["random-uuid"]) {
      const newUUID = uuidv4();
      newManifest = newManifest.replace("\"ca5f968f-4f3a-4b92-9641-5f764b33e711\"", JSON.stringify(newUUID));
    }

    if (newManifest) dataZip.file(manifest_path, newManifest);

    onDownload && onDownload();
  };

  async function handleChange(name: string, value: any) {
    if (name === "skins") {
      const validFiles: [File, "wide"|"slim"][] = [];

      for (const file of value as File[]) {
        if (await isRealImageClient(file)) {
          validFiles.push([file, "wide"]);
        }
      }

      setFormData((prev) => {
        const existingSkins = Array.isArray(prev?.skins) ? [...prev.skins] : [];
        const next = {
          ...prev,
          skins: [...existingSkins, ...validFiles],
        };
        return next;
      });

      return;
    }

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };
      return next;
    });
  }

  function handleChangeSkinType(index: number, type: string) {
    if (index < 0) return;
    
    setFormData((prev) => {
      const skins = Array.isArray(prev?.skins) ? [...prev.skins] : [];
      if (index >= skins.length) return prev;
      
      skins[index][1] = type;

      return {
        ...prev,
        skins,
      };
    });
  }

  function handleMoveUp(index: number) {
    if (index <= 0) return;
    
    setFormData((prev) => {
      const skins = Array.isArray(prev?.skins) ? [...prev.skins] : [];
      if (index >= skins.length) return prev;
      
      // Swap the current item with the one above it
      const temp = skins[index];
      skins[index] = skins[index - 1];
      skins[index - 1] = temp;
      
      return {
        ...prev,
        skins,
      };
    });
  }

  function handleMoveDown(index: number) {
    setFormData((prev) => {
      const skins = Array.isArray(prev?.skins) ? [...prev.skins] : [];
      if (index >= skins.length - 1) return prev;
      
      // Swap the current item with the one below it
      const temp = skins[index];
      skins[index] = skins[index + 1];
      skins[index + 1] = temp;
      
      return {
        ...prev,
        skins,
      };
    });
  }

  function handleRemove(index: number) {
    setFormData((prev) => {
      const skins = Array.isArray(prev?.skins) ? [...prev.skins] : [];
      if (index >= skins.length) return prev;
      
      skins.splice(index, 1);
      
      return {
        ...prev,
        skins,
      };
    });
  }

  function handleChangePosition(currentIndex: number, newPosition: number) {
    setFormData((prev) => {
      const skins = Array.isArray(prev?.skins) ? [...prev.skins] : [];
      if (currentIndex >= skins.length) return prev;
      
      // Adjust newPosition to be 0-indexed and within bounds
      const adjustedNewPosition = Math.max(0, Math.min(skins.length - 1, newPosition - 1));
      
      // If position is the same, no change needed
      if (currentIndex === adjustedNewPosition) return prev;
      
      // Remove the item from its current position
      const [movedItem] = skins.splice(currentIndex, 1);
      
      // Insert it at the new position
      skins.splice(adjustedNewPosition, 0, movedItem);
      
      return {
        ...prev,
        skins,
      };
    });
  }

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormRenderer
          config={[
            {
              id: "skins",
              name: "Skins",
              type: "image",
              multiple: true,
              accept: "png",
            },
          ]}
          values={formData}
          onChange={handleChange}
        />
        
        {formData.skins && formData.skins.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Uploaded Skins</h3>
            <div className="space-y-2 border rounded-md p-4">
              {formData.skins.map(([file, type]: [File, "wide"|"slim"], index: number) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted/30 rounded-md p-2 gap-2">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {editingPosition === index ? (
                      <div className="w-10 relative">
                        <input
                          ref={positionInputRef}
                          type="number"
                          min="1"
                          max={formData.skins.length}
                          defaultValue={index + 1}
                          className="w-10 h-6 text-center text-sm rounded-md border border-input"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const newPosition = parseInt((e.target as HTMLInputElement).value);
                              if (!isNaN(newPosition)) {
                                handleChangePosition(index, newPosition);
                              }
                              setEditingPosition(null);
                            } else if (e.key === 'Escape') {
                              setEditingPosition(null);
                            }
                          }}
                          onBlur={() => {
                            const newPosition = parseInt(positionInputRef.current?.value || '0');
                            if (!isNaN(newPosition)) {
                              handleChangePosition(index, newPosition);
                            }
                            setEditingPosition(null);
                          }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button 
                        type="button"
                        className="font-medium text-muted-foreground w-6 text-center hover:text-primary hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded"
                        onClick={() => setEditingPosition(index)}
                        title="Click to change position"
                      >
                        {index + 1}
                      </button>
                    )}
                    <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Skin ${index + 1}`} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <span className="font-medium truncate max-w-[150px] sm:max-w-[200px]">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Select
                      defaultValue={type}
                      onValueChange={(value) => handleChangeSkinType(index, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem defaultChecked value="wide">Wide</SelectItem>
                        <SelectItem value="slim">Slim</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="h-8 w-8"
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMoveDown(index)}
                      disabled={index === formData.skins.length - 1}
                      className="h-8 w-8"
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemove(index)}
                      className="h-8 w-8"
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        

        <FormRenderer
          config={[
            {
              type: "text",
              id: "title-pack",
              name: "Title Pack",
              placeholder: "Custom NPC",
            },
            {
              type: "toggle",
              id: "random-uuid",
              name: "Random UUID",
              defaultValue: true,
            },
          ]}
          values={formData}
          onChange={handleChange}
        />

        <div className="flex gap-4 pt-6">
          <Button type="submit" size="lg" disabled={hasSubmit}>
            Download
          </Button>
          <Button type="button" variant="outline" size="lg" disabled={hasSubmit}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
