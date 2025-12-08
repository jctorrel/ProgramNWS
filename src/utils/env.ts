import "dotenv/config";

export default function getEnv(key: string, fallback?: string): string {
  const val = process.env[key];
  if (val === undefined || val === "") {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing env var: ${key}`);
  }
  return val;
}
