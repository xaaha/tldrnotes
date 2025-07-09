export const email = "pratik@tldrnotes.net";

export const hero = {
  title: "Pratik | Software Engineer",
  visibleTitle: "Turning Problems Into Pull Requests Since 2019",
  subtitle:
    "I build thoughtful software, fix bugs, and occasionally name things well",
  aside: "And I use Neovim, by the way.",
};

interface ProjectDetails {
  title: string;
  description: string;
  githubUrl?: string;
  webUrl?: string;
  tags?: string;
  status?: "Active" | "Complete" | "Archived";
}

export const projectInfo: ProjectDetails[] = [
  {
    title: "Hulak",
    description:
      "I wanted a fast, no-fuss API client I could run straight from the terminal. So I built Hulak—a lightweight CLI tool written in Go that lets you define requests in YAML and fire them off with zero bloat.",
    githubUrl: "https://github.com/xaaha/hulak",
    tags: "Go CLI-APP Tooling",
    status: "Active",
  },
  {
    title: "This Website",
    description:
      "A personal corner of the internet to share what I’ve learned and what I’m building. Powered by Astro for speed, styled for clarity, and always a work in progress—just like me.",
    githubUrl: "https://github.com/xaaha/tldrnotes",
    tags: "Astro TypeScript CSS JS",
    status: "Active",
  },
  {
    title: "Pratik Picture",
    description:
      "I wanted a simple, fast, and good-looking home for my photography. So I made one. A custom static site built with just HTML, CSS, and JS. No frameworks, just vibes.",
    webUrl: "https://pratikpicture.com/",
    githubUrl: "https://github.com/xaaha/pratikpicture",
    tags: "HTML CSS JS Photography",
    status: "Complete",
  },
  {
    title: "Address API",
    description:
      "Built for internationalization testing, this API returns five complete, randomly selected valid addresses with phone numbers from over 40,000 real-world entries—filtered by country code.",
    webUrl: "https://api.tldrnotes.net/docs",
    tags: "Go",
    status: "Archived",
  },
];
