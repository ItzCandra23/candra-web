"use client";

import JSZip from "jszip";
import { useEffect, useState, useRef } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { FormRenderer } from "../shared/form-renderer";
import { Button } from "../ui/button";

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

export default function TapperNPCForm({ dataZip, onDownload }: { dataZip: JSZip; onDownload?: () => void; }) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [editingPositionSkin, setEditingPositionSkin] = useState<number | null>(null);
  const [editingNameSkin, setEditingNameSkin] = useState<number | null>(null);
  const positionSkinInputRef = useRef<HTMLInputElement>(null);
  const nameSkinInputRef = useRef<HTMLInputElement>(null);
  const [editingPositionCape, setEditingPositionCape] = useState<number | null>(null);
  const [editingNameCape, setEditingNameCape] = useState<number | null>(null);
  const positionCapeInputRef = useRef<HTMLInputElement>(null);
  const nameCapeInputRef = useRef<HTMLInputElement>(null);

  const [prefixFolder, setPrefixFolder] = useState<string>();
  const [hasSubmit, setHasSubmit] = useState<boolean>(false);

  const [version, set_version] = useState<[number, number, number] | string>();

  const [skins_data, set_skins_data] = useState<string>();
  const [capes_data, set_capes_data] = useState<string>();

  const [entity_data, set_entity_data] = useState<string>();
  const [entity_textures, set_entity_textures] = useState<string>();
  const [render_controllers, set_render_controllers] = useState<string>();

  const [manifest_bp, set_manifest_bp] = useState<string>();
  const [manifest_rp, set_manifest_rp] = useState<string>();

  const regex = /[^A-Za-z0-9 _'\-]/g;

  useEffect(() => {
    dataZip.forEach(async (rawpath, file) => {
      let filepath = rawpath;

      if (filepath.startsWith("TapperNPC") && !filepath.startsWith("TapperNPC-BP") && !filepath.startsWith("TapperNPC-RP")) {
        const newFilepath = filepath.split("/");

        setPrefixFolder(newFilepath[0]);
        newFilepath.shift();

        filepath = newFilepath.join("/");
      }
      if (filepath.startsWith("TapperNPC-RP/textures/entity/tappernpc")) {
        dataZip.remove(rawpath);
      }
      if (filepath === "TapperNPC-BP/scripts/skins.js") {
        const rawfile = await file.async("text");

        set_skins_data(rawfile);
      }
      if (filepath === "TapperNPC-BP/scripts/capes.js") {
        const rawfile = await file.async("text");

        set_capes_data(rawfile);
      }
      if (filepath === "TapperNPC-BP/entities/dummy.json") {
        const rawfile = await file.async("text");

        set_entity_data(rawfile);
      }
      if (filepath === "TapperNPC-RP/entity/dummy.entity.json") {
        const rawfile = await file.async("text");

        set_entity_textures(rawfile);
      }
      if (filepath === "TapperNPC-RP/render_controllers/dummy.render_controllers.json") {
        const rawfile = await file.async("text");

        set_render_controllers(rawfile);
      }
      if (filepath === "TapperNPC-BP/manifest.json") {
        const rawfile = await file.async("text");

        set_manifest_bp(rawfile);

        try {
          set_version(JSON.parse(rawfile).header.version);
        } catch(err) {}
      }
      if (filepath === "TapperNPC-RP/manifest.json") {
        const rawfile = await file.async("text");

        set_manifest_rp(rawfile);
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmit(true);

    const data = formData;
    
    const manifest_path_bp = (prefixFolder ? (prefixFolder + "/") : "") + "TapperNPC-BP/manifest.json";
    const manifest_path_rp = (prefixFolder ? (prefixFolder + "/") : "") + "TapperNPC-RP/manifest.json";

    let newManifestBP = manifest_bp ?? "";
    let newManifestRP = manifest_rp ?? "";

    let new_entity_data = entity_data ? JSON.parse(entity_data) : undefined;
    let new_entity_textures = entity_textures ? JSON.parse(entity_textures) : undefined;
    let new_render_controllers = render_controllers ? JSON.parse(render_controllers) : undefined;

    if (manifest_bp && manifest_rp && data.hasOwnProperty("title-pack")) {
      newManifestBP = newManifestBP.replace("\"TapperNPC\"", JSON.stringify(data["title-pack"] + " [TapperNPC]"));
      newManifestRP = newManifestRP.replace("\"TapperNPC\"", JSON.stringify(data["title-pack"] + " [TapperNPC]"));
    }

    if (manifest_bp && manifest_rp && data.hasOwnProperty("random-uuid") && data["random-uuid"]) {
      const uuid_bp = JSON.stringify(uuidv4());
      const uuid_rp = JSON.stringify(uuidv4());

      newManifestBP = newManifestBP.replace("\"127ce913-7129-477a-b9a1-260f5bbe5415\"", uuid_bp).replace("\"e2f9dbe0-cdff-49eb-945a-e0732ed175a8\"", uuid_rp);
      newManifestRP = newManifestRP.replace("\"127ce913-7129-477a-b9a1-260f5bbe5415\"", uuid_bp).replace("\"e2f9dbe0-cdff-49eb-945a-e0732ed175a8\"", uuid_rp);
    }

    if (newManifestBP && newManifestRP) {
      dataZip.file(manifest_path_bp, newManifestBP);
      dataZip.file(manifest_path_rp, newManifestRP);
    }

    if (new_entity_data && new_entity_textures && new_render_controllers) {

      const current_version: string|undefined = version ? version.toString().replaceAll(",", ".") : undefined;
      
      let skinsData: Record<string, string> = skins_data ? JSON.parse(skins_data.slice(skins_data.indexOf("{"), skins_data.lastIndexOf("}") + 1).replace(/,\s*}/, "}")) : {};

      let capesData: Record<string, string> = capes_data ? JSON.parse(capes_data.slice(capes_data.indexOf("{"), capes_data.lastIndexOf("}") + 1).replace(/,\s*}/, "}")) : {};
      
      if (current_version === "1.0.0") {
        skinsData = {
          "skin_steve": "Steve",
          "skin_alex": "Alex",
        };

        capesData = {
          "cape_none": "None",
        };

        new_entity_data["minecraft:entity"].component_groups = {
          "model_wide": {
            "minecraft:variant": {
              "value": 0
            }
          },
          "model_slim": {
            "minecraft:variant": {
              "value": 1
            }
          },
          "cape_none": {
            "minecraft:mark_variant": {
              "value": 0
            }
          },
          "skin_steve": {
            "minecraft:skin_id": {
              "value": 0
            }
          },
          "skin_alex": {
            "minecraft:skin_id": {
              "value": 1
            }
          },
        };

        new_entity_data["minecraft:entity"].events = {
          "model_wide": {
            "add": { "component_groups": [ "model_wide" ] }
          },
          "model_slim": {
            "add": { "component_groups": [ "model_slim" ] }
          },
          "cape_none": {
            "add": { "component_groups": [ "cape_none" ] }
          },
          "skin_steve": {
            "add": { "component_groups": [ "skin_steve" ] }
          },
          "skin_alex": {
            "add": { "component_groups": [ "skin_alex" ] }
          },
        };

        new_entity_textures["minecraft:client_entity"].description.textures = {
          "cape_none": "textures/entity/cape_invisible",
          "skin_steve": "textures/entity/steve",
          "skin_alex": "textures/entity/alex",
        };

        new_render_controllers.render_controllers["controller.render.dummy.cape"].arrays.textures["Array.capes"] = [
          "Texture.cape_none",
        ];

        new_render_controllers.render_controllers["controller.render.dummy"].arrays.textures["Array.skins"] = [
          "Texture.skin_steve",
          "Texture.skin_alex",
        ];
        
        new_render_controllers.render_controllers["controller.render.locator"].textures = [
          "Texture.skin_steve",
        ];
      }
      
      if (data.hasOwnProperty("skins") && data["skins"]) {
        const skins: [File, string][] = data.skins;

        skins.forEach(([file, name], i) => {
          
          try {
            const textureId = `skin_${i}`;

            const texture_path = (prefixFolder ? (prefixFolder + "/") : "") + `TapperNPC-RP/textures/entity/tappernpc/${textureId}.png`;
            dataZip.file(texture_path, file);

            new_entity_data["minecraft:entity"].component_groups[textureId] = { "minecraft:skin_id": { "value": i + 2 } };
            new_entity_data["minecraft:entity"].events[textureId] = { "add": { "component_groups": [ textureId ] } };
            new_entity_textures["minecraft:client_entity"].description.textures[textureId] = `textures/entity/tappernpc/${textureId}`;
            new_render_controllers.render_controllers["controller.render.dummy"].arrays.textures["Array.skins"].push(`Texture.${textureId}`);

            skinsData[textureId] = name;
          } catch(err) {}
        });
      }
      
      if (data.hasOwnProperty("capes") && data["capes"]) {
        const capes: [File, string][] = data.capes;

        capes.forEach(([file, name], i) => {
          
          try {
            const textureId = `cape_${i}`;

            const texture_path = (prefixFolder ? (prefixFolder + "/") : "") + `TapperNPC-RP/textures/entity/tappernpc/${textureId}.png`;
            dataZip.file(texture_path, file);

            new_entity_data["minecraft:entity"].component_groups[textureId] = { "minecraft:mark_variant": { "value": i + 1 } };
            new_entity_data["minecraft:entity"].events[textureId] = { "add": { "component_groups": [ textureId ] } };
            new_entity_textures["minecraft:client_entity"].description.textures[textureId] = `textures/entity/tappernpc/${textureId}`;
            new_render_controllers.render_controllers["controller.render.dummy.cape"].arrays.textures["Array.capes"].push(`Texture.${textureId}`);

            capesData[textureId] = name;
          } catch(err) {}
        });
      }

      const new_skins_data = `const TapperSkins = ${JSON.stringify(skinsData, undefined, 4)};\n\nexport default TapperSkins;`;
      const new_capes_data = `const TapperCapes = ${JSON.stringify(capesData, undefined, 4)};\n\nexport default TapperCapes;`;

      const prefix_path = (prefixFolder ? (prefixFolder + "/") : "");
      
      dataZip.file(prefix_path + "TapperNPC-BP/scripts/skins.js", new_skins_data);
      dataZip.file(prefix_path + "TapperNPC-BP/scripts/capes.js", new_capes_data);
      dataZip.file(prefix_path + "TapperNPC-BP/entities/dummy.json", JSON.stringify(new_entity_data, undefined, 4));
      dataZip.file(prefix_path + "TapperNPC-RP/entity/dummy.entity.json", JSON.stringify(new_entity_textures, undefined, 4));
      dataZip.file(prefix_path + "TapperNPC-RP/render_controllers/dummy.render_controllers.json", JSON.stringify(new_render_controllers, undefined, 4));
    }

    onDownload && onDownload();
  };

  async function handleChange(name: string, value: any) {
    if (name === "skins") {
      const validFiles: [File, string][] = [];

      for (const [i, file] of (value as File[]).entries()) {
        if (await isRealImageClient(file)) {
          let name = file.name.replace(regex, '').slice(0, file.name.lastIndexOf(".")).slice(0, 19).trim() || `${i}`;
          if (name.lastIndexOf("."))
          validFiles.push([file, name]);
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
    if (name === "capes") {
      const validFiles: [File, string][] = [];

      for (const [i, file] of (value as File[]).entries()) {
        if (await isRealImageClient(file)) {
          let name = file.name.replace(regex, '').slice(0, file.name.lastIndexOf(".")).slice(0, 19).trim() || `${i}`;
          validFiles.push([file, name]);
        }
      }

      setFormData((prev) => {
        const existingCapes = Array.isArray(prev?.capes) ? [...prev.capes] : [];
        const next = {
          ...prev,
          capes: [...existingCapes, ...validFiles],
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

  function handleMoveUpSkin(index: number) {
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

  function handleMoveUpCape(index: number) {
    if (index <= 0) return;
    
    setFormData((prev) => {
      const capes = Array.isArray(prev?.capes) ? [...prev.capes] : [];
      if (index >= capes.length) return prev;
      
      // Swap the current item with the one above it
      const temp = capes[index];
      capes[index] = capes[index - 1];
      capes[index - 1] = temp;
      
      return {
        ...prev,
        capes,
      };
    });
  }

  function handleMoveDownSkin(index: number) {
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

  function handleMoveDownCape(index: number) {
    setFormData((prev) => {
      const capes = Array.isArray(prev?.capes) ? [...prev.capes] : [];
      if (index >= capes.length - 1) return prev;
      
      // Swap the current item with the one below it
      const temp = capes[index];
      capes[index] = capes[index + 1];
      capes[index + 1] = temp;
      
      return {
        ...prev,
        capes,
      };
    });
  }

  function handleRemoveSkin(index: number) {
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
  
  function handleRemoveCape(index: number) {
    setFormData((prev) => {
      const capes = Array.isArray(prev?.capes) ? [...prev.capes] : [];
      if (index >= capes.length) return prev;
      
      capes.splice(index, 1);
      
      return {
        ...prev,
        capes,
      };
    });
  }

  function handleChangePositionSkin(currentIndex: number, newPosition: number) {
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

  function handleChangePositionCape(currentIndex: number, newPosition: number) {
    setFormData((prev) => {
      const capes = Array.isArray(prev?.capes) ? [...prev.capes] : [];
      if (currentIndex >= capes.length) return prev;
      
      // Adjust newPosition to be 0-indexed and within bounds
      const adjustedNewPosition = Math.max(0, Math.min(capes.length - 1, newPosition - 1));
      
      // If position is the same, no change needed
      if (currentIndex === adjustedNewPosition) return prev;
      
      // Remove the item from its current position
      const [movedItem] = capes.splice(currentIndex, 1);
      
      // Insert it at the new position
      capes.splice(adjustedNewPosition, 0, movedItem);
      
      return {
        ...prev,
        capes,
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

        <FormRenderer
          config={[
            {
              id: "capes",
              name: "Capes",
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
              {formData.skins.map(([file, fileName]: [File, string], index: number) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted/30 rounded-md p-2 gap-2">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {editingPositionSkin === index ? (
                      <div className="w-10 relative">
                        <input
                          ref={positionSkinInputRef}
                          type="number"
                          min="1"
                          max={formData.skins.length}
                          defaultValue={index + 1}
                          className="w-10 h-6 text-center text-sm rounded-md border border-input"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const newPosition = parseInt((e.target as HTMLInputElement).value);
                              if (!isNaN(newPosition)) {
                                handleChangePositionSkin(index, newPosition);
                              }
                              setEditingPositionSkin(null);
                            } else if (e.key === 'Escape') {
                              setEditingPositionSkin(null);
                            }
                          }}
                          onBlur={() => {
                            const newPosition = parseInt(positionSkinInputRef.current?.value || '0');
                            if (!isNaN(newPosition)) {
                              handleChangePositionSkin(index, newPosition);
                            }
                            setEditingPositionSkin(null);
                          }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button 
                        type="button"
                        className="font-medium text-muted-foreground w-6 text-center hover:text-primary hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded"
                        onClick={() => setEditingPositionSkin(index)}
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
                    {editingNameSkin === index ? (
                      <div className="relative">
                        <input
                          ref={nameSkinInputRef}
                          type="text"
                          defaultValue={fileName}
                          className="w-full max-w-[150px] sm:max-w-[200px] h-6 text-sm rounded-md border border-input px-2"
                          maxLength={20}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const newName = nameSkinInputRef.current?.value || '';
                              if (newName && newName.length >= 1 && newName.length <= 20 && !regex.test(newName)) {
                                const newSkins = [...formData.skins];
                                newSkins[index] = [newSkins[index][0], newName];
                                setFormData({...formData, skins: newSkins});
                              }
                              setEditingNameSkin(null);
                            } else if (e.key === 'Escape') {
                              setEditingNameSkin(null);
                            }
                          }}
                          onBlur={() => {
                            const newName = nameSkinInputRef.current?.value || '';
                            if (newName && newName.length >= 1 && newName.length <= 20 && !regex.test(newName)) {
                              const newSkins = [...formData.skins];
                              newSkins[index] = [newSkins[index][0], newName];
                              setFormData({...formData, skins: newSkins});
                            }
                            setEditingNameSkin(null);
                          }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <span 
                        className="font-medium truncate max-w-[150px] sm:max-w-[200px] cursor-pointer hover:text-primary hover:underline"
                        onClick={() => setEditingNameSkin(index)}
                        title="Click to edit name"
                      >
                        {fileName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMoveUpSkin(index)}
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
                      onClick={() => handleMoveDownSkin(index)}
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
                      onClick={() => handleRemoveSkin(index)}
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
        
        {formData.capes && formData.capes.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Uploaded Capes</h3>
            <div className="space-y-2 border rounded-md p-4">
              {formData.capes.map(([file, fileName]: [File, string], index: number) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted/30 rounded-md p-2 gap-2">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {editingPositionCape === index ? (
                      <div className="w-10 relative">
                        <input
                          ref={positionCapeInputRef}
                          type="number"
                          min="1"
                          max={formData.capes.length}
                          defaultValue={index + 1}
                          className="w-10 h-6 text-center text-sm rounded-md border border-input"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const newPosition = parseInt((e.target as HTMLInputElement).value);
                              if (!isNaN(newPosition)) {
                                handleChangePositionCape(index, newPosition);
                              }
                              setEditingPositionCape(null);
                            } else if (e.key === 'Escape') {
                              setEditingPositionCape(null);
                            }
                          }}
                          onBlur={() => {
                            const newPosition = parseInt(positionCapeInputRef.current?.value || '0');
                            if (!isNaN(newPosition)) {
                              handleChangePositionCape(index, newPosition);
                            }
                            setEditingPositionCape(null);
                          }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button 
                        type="button"
                        className="font-medium text-muted-foreground w-6 text-center hover:text-primary hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded"
                        onClick={() => setEditingPositionCape(index)}
                        title="Click to change position"
                      >
                        {index + 1}
                      </button>
                    )}
                    <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Cape ${index + 1}`} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    {editingNameCape === index ? (
                      <div className="relative">
                        <input
                          ref={nameCapeInputRef}
                          type="text"
                          defaultValue={fileName}
                          className="w-full max-w-[150px] sm:max-w-[200px] h-6 text-sm rounded-md border border-input px-2"
                          maxLength={20}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const newName = nameCapeInputRef.current?.value || '';
                              if (newName && newName.length >= 1 && newName.length <= 20 && !regex.test(newName)) {
                                const newCapes = [...formData.capes];
                                newCapes[index] = [newCapes[index][0], newName];
                                setFormData({...formData, capes: newCapes});
                              }
                              setEditingNameCape(null);
                            } else if (e.key === 'Escape') {
                              setEditingNameCape(null);
                            }
                          }}
                          onBlur={() => {
                            const newName = nameCapeInputRef.current?.value || '';
                            if (newName && newName.length >= 1 && newName.length <= 20 && !regex.test(newName)) {
                              const newCapes = [...formData.capes];
                              newCapes[index] = [newCapes[index][0], newName];
                              setFormData({...formData, capes: newCapes});
                            }
                            setEditingNameCape(null);
                          }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <span 
                        className="font-medium truncate max-w-[150px] sm:max-w-[200px] cursor-pointer hover:text-primary hover:underline"
                        onClick={() => setEditingNameCape(index)}
                        title="Click to edit name"
                      >
                        {fileName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMoveUpCape(index)}
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
                      onClick={() => handleMoveDownCape(index)}
                      disabled={index === formData.capes.length - 1}
                      className="h-8 w-8"
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveCape(index)}
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
              placeholder: "Tapper NPC",
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
