declare var myString: string;
declare function myFunction(): boolean;

// blog's
interface Frontmatter {
  title: string;
  date: string;
  author?: string;
  image?: { src: string; alt: string };
  description?: string;
  draft?: boolean;
  category?: string;
}
