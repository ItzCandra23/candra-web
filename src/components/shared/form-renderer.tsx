"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, FileIcon, ExternalLink } from "lucide-react";
import type { JsonForm, InputType } from "@/types/form";
import { useEffect, useState } from "react";

interface FormRendererProps {
  config: JsonForm;
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
}

export function FormRenderer({ config, values, onChange }: FormRendererProps) {
  const [isDragOver, setDragOver] = useState<boolean>(false);
  useEffect(() => {
    config.forEach((input) => {
      if (input.type === "checkbox" && values[input.id] === undefined) {
        const defaultChecked = input.options
          .filter(opt => opt.checked)
          .map(opt => opt.value);
        
        if (defaultChecked.length > 0) {
          onChange(input.id, input.multiple ? defaultChecked : defaultChecked[0]);
        }
      } else if (input.type === "checklist" && values[input.id] === undefined) {
        const defaultChecked = input.options
          .filter(opt => opt.checked)
          .map(opt => opt.value);
        
        if (defaultChecked.length > 0) {
          onChange(input.id, input.multiple ? defaultChecked : defaultChecked[0]);
        }
      } else if (input.type === "dropdown" && values[input.id] === undefined) {
        const defaultOption = input.options.find(opt => opt.default);
        if (defaultOption) {
          onChange(input.id, defaultOption.value || defaultOption.id);
        }
      } else if (input.type === "toggle" && values[input.id] === undefined) {
        onChange(input.id, input.defaultValue || false);
      } else if (input.type === "group") {
        if (input.first.type === "dropdown" && values[input.first.id] === undefined) {
          const defaultOption = input.first.options.find(opt => opt.default);
          if (defaultOption) {
            onChange(input.first.id, defaultOption.value || defaultOption.id);
          }
        }
        if (input.second.type === "dropdown" && values[input.second.id] === undefined) {
          const defaultOption = input.second.options.find(opt => opt.default);
          if (defaultOption) {
            onChange(input.second.id, defaultOption.value || defaultOption.id);
          }
        }
        if (input.first.type === "toggle" && values[input.first.id] === undefined) {
          onChange(input.first.id, input.first.defaultValue || false);
        }
        if (input.second.type === "toggle" && values[input.second.id] === undefined) {
          onChange(input.second.id, input.second.defaultValue || false);
        }
      }
    });
  }, [config]);
  
  const renderInput = (input: InputType) => {
    switch (input.type) {
      case "text":
        return (
          <div key={input.id} className="space-y-2">
            <Label htmlFor={input.id}>
              {input.name}
              {input.require && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={input.id}
              type="text"
              placeholder={input.placeholder}
              value={values[input.id] || input.defaultValue || ""}
              onChange={(e) => onChange(input.id, e.target.value)}
              required={input.require}
            />
          </div>
        );

      case "textarea":
        return (
          <div key={input.id} className="space-y-2">
            <Label htmlFor={input.id}>
              {input.name}
              {input.require && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={input.id}
              placeholder={input.placeholder}
              rows={input.rows || 4}
              value={values[input.id] || input.defaultValue || ""}
              onChange={(e) => onChange(input.id, e.target.value)}
              required={input.require}
            />
          </div>
        );

      case "number":
        return (
          <div key={input.id} className="space-y-2">
            <Label htmlFor={input.id}>
              {input.name}
              {input.require && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={input.id}
              type="number"
              placeholder={input.placeholder}
              min={input.min}
              max={input.max}
              value={values[input.id] || input.defaultValue || ""}
              onChange={(e) => onChange(input.id, e.target.value)}
              required={input.require}
            />
          </div>
        );

      case "toggle":
        return (
          <div key={input.id} className="space-y-2">
            <div className="flex items-center space-x-3">
              <Switch
                id={input.id}
                checked={values[input.id] || false}
                onCheckedChange={(checked) => onChange(input.id, checked)}
              />
              <Label htmlFor={input.id}>
                {input.name}
                {input.require && <span className="text-destructive ml-1">*</span>}
              </Label>
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div key={input.id} className="space-y-4">
            <Label>
              {input.name}
              {input.require && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="grid gap-4">
              {input.options.map((option) => (
                <Card key={option.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={option.id}
                        checked={
                          input.multiple
                            ? (values[input.id] || []).includes(option.value)
                            : values[input.id] === option.value
                        }
                        onCheckedChange={(checked) => {
                          if (input.multiple) {
                            const current = values[input.id] || [];
                            const updated = checked
                              ? option.dependencies ? [...current, option.value, ...option.dependencies] : [...current, option.value]
                              : current.filter((v: string) => v !== option.value);
                            onChange(input.id, updated);
                          } else {
                            onChange(input.id, checked ? option.value : undefined);
                          }
                        }}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={option.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {option.title}
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                        {option.visit && (
                          <a
                            href={option.visit}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-primary hover:underline mt-2"
                          >
                            Learn more
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        );

      case "checklist":
        return (
          <div key={input.id} className="space-y-4">
            <Label>
              {input.name}
              {input.require && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className={`space-y-2 ${input.listStyle || ""}`}>
              {input.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={
                      input.multiple
                        ? (values[input.id] || []).includes(option.value)
                        : values[input.id] === option.value
                    }
                    onCheckedChange={(checked) => {
                      if (input.multiple) {
                        const current = values[input.id] || [];
                        const updated = checked
                          ? option.dependencies ? [...current, option.value, ...option.dependencies] : [...current, option.value]
                          : current.filter((v: string) => v !== option.value);
                        onChange(input.id, updated);
                      } else {
                        onChange(input.id, checked ? option.value : undefined);
                      }
                    }}
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case "dropdown":
        return (
          <div key={input.id} className="space-y-2">
            <Label htmlFor={input.id}>
              {input.name}
              {input.require && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={values[input.id] || ""}
              onValueChange={(value) => onChange(input.id, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {input.options.map((option) => (
                  <SelectItem key={option.id} value={option.value || option.id}>
                    <div>
                      <div className="font-medium">{option.name}</div>
                      {option.description && (
                        <div className="text-sm text-muted-foreground">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "image":
        return (
          <div key={input.id} className="space-y-2">
            <Label 
            htmlFor={input.id}
            >
              {input.name}
              {input.require && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor={input.id}
                className={"flex flex-col items-center justify-center w-full h-32 border-2 rounded-lg cursor-pointer hover:bg-muted" + (isDragOver ? " border-primary bg-primary/5" : " border-dashed bg-muted/50")}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const files = e.dataTransfer.files;
                  onChange(input.id, input.multiple ? files : files[0])
                }}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {input.multiple ? "Multiple images allowed" : "Single image only"}
                  </p>
                </div>
                <input
                  id={input.id}
                  type="file"
                  className="hidden"
                  accept={"image/" + (input.accept || "png")} 
                  multiple={input.multiple}
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    onChange(input.id, input.multiple ? files : files[0]);
                  }}
                  required={input.require}
                />
              </label>
            </div>
            {values[input.id] && (
              <div className="mt-2">
                <Badge variant="secondary">
                  {input.multiple
                    ? `${values[input.id].length} file(s) selected`
                    : values[input.id].name}
                </Badge>
              </div>
            )}
          </div>
        );

      case "file":
        return (
          <div key={input.id} className="space-y-2">
            <Label htmlFor={input.id}>
              {input.name}
              {input.require && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor={input.id}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Accepted: {input.accept}
                  </p>
                </div>
                <input
                  id={input.id}
                  type="file"
                  className="hidden"
                  accept={input.accept}
                  multiple={input.multiple}
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    onChange(input.id, input.multiple ? files : files[0]);
                  }}
                  required={input.require}
                />
              </label>
            </div>
            {values[input.id] && (
              <div className="mt-2">
                <Badge variant="secondary">
                  {input.multiple
                    ? `${values[input.id].length} file(s) selected`
                    : values[input.id].name}
                </Badge>
              </div>
            )}
          </div>
        );

      case "group":
        return (
          <div key={`${input.first.id}-${input.second.id}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {renderInput(input.first)}
            {renderInput(input.second)}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {config.map((input) => renderInput(input))}
    </div>
  );
}