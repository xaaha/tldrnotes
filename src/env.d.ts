declare var myString: string;
declare function myFunction(): boolean;

// blog's frontmatter
interface Frontmatter {
  title: string;
  date: string | null;
  description: string;
  author?: string;
  image?: { src: string; alt: string };
  draft?: boolean;
  category?: string;
}
