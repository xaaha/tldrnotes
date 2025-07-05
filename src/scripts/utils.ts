import { getCollection } from "astro:content";

// Make string url friendly
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

export function formatDate(date: Date | null) {
  if (date === null) {
    throw new Error("Notes must contain date frontmatter");
  }

  return new Date(date).toLocaleDateString("en-US", { timeZone: "UTC" });
}

/**
 * @description: Get all notes, currently sorted by recent time only
 * */
export const getNotes = async () => {
  const allPosts = await getCollection("notes", ({ data }) => {
    return data.draft !== true;
  });

  return allPosts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
};
