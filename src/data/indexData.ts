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
      "I needed a lightweight, dependency-free API client for my terminal. So, I built Hulak - a CLI tool written in Go that provides a fast and minimal API client that can be defined in yaml file.",
    githubUrl: "https://github.com/xaaha/hulak",
    tags: "Go CLI-APP Tooling",
    status: "Active",
  },
  {
    title: "This Website",
    description:
      "This is a personal space to document my learning and showcase my work. I built this with Astro for performance and designed to be a clean, readable, and ever-evolving digital notebook.",
    githubUrl: "https://github.com/xaaha/tldrnotes",
    tags: "Astro TypeScript CSS JS",
    status: "Active",
  },
  {
    title: "Pratik Picture",
    description:
      "I needed a clean, fast, and visually appealing online portfolio for my pictures. So, I built this custom static site that showcases photography with a focus on performance and aesthetics. Built purely on basic web technology.",
    webUrl: "https://pratikpicture.com/",
    githubUrl: "https://github.com/xaaha/pratikpicture",
    tags: "HTML CSS JS Photography",
    status: "Complete",
  },
  {
    title: "Address API",
    description:
      "I built this API for internationalization testing that delivers five complete, valid, and randomly selected addresses—including phone numbers — based on a given country code. It draws from a dataset of over 40,000 real-world addresses across the globe, making it ideal for testing localization and global user scenarios.",
    webUrl: "https://api.tldrnotes.net/docs",
    tags: "Go",
    status: "Archived",
  },
];
