import { promisify } from "node:util";
import { exec } from "node:child_process";

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { timeZone: "UTC" });
}

export async function getLastGitDate(filePath: string): Promise<Date | null> {
  try {
    const cmd = `git log -1 --format="%aI" -- "${filePath}"`;
    const dateString = await promisify(exec)(cmd).then(({ stdout }) =>
      stdout.trim(),
    );
    return dateString ? new Date(dateString) : null;
  } catch (_) {
    return null;
  }
}
