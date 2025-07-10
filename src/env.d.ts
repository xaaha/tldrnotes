declare let myString: string;
declare function myFunction(): boolean;

// notes frontmatter
interface Frontmatter {
  title: string;
  date: Date;
  description: string;
  image?: { src: string; alt: string };
  draft?: boolean;
  category?: string;
}
