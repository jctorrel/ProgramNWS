// src/utils/prompts.ts

// Template engine: {{ var }}
export default function render(template: string, vars: Record<string, unknown>): string {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    const value = (vars as any)[key];
    return value !== undefined && value !== null ? String(value) : "";
  });
}