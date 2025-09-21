"use client";

import { useEffect, useState } from "react";
import { FormRenderer } from "@/components/shared/form-renderer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JsonForm } from "@/types/form";

export function DynamicForm({ config, submitText, disabled, onChange, onSubmit }: { config: JsonForm; submitText?: string; disabled?: boolean; onChange?: (data: Record<string, any>) => void; onSubmit?: (data: Record<string, any>) => void; }) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
    setSubmitted(true);
  };

  const handleFormChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    onChange && onChange(formData);
  };

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormRenderer 
          config={config} 
          values={formData}
          onChange={handleFormChange}
        />
        
        <div className="flex gap-4 pt-6">
          <Button type="submit" size="lg" disabled={disabled}>
            {submitText || "Submit"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            disabled={disabled}
            onClick={() => {
              setFormData({});
              setSubmitted(false);
            }}
          >
            Reset
          </Button>
        </div>
      </form>

      {/* {submitted && (
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold mb-4">Form Data Submitted:</h3>
          <pre className="bg-muted p-4 rounded-md overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </Card>
      )} */}
    </div>
  );
}