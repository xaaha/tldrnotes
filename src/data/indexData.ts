const hero = {
  subtitle: "To stay sane, I work on side projects that add value to my life.",
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

const projectInfo = {
  title: "Hulak",
  description:
    "I needed a lightweight, dependency-free API client for my terminal. So, I built Hulak - a CLI tool written in Go that provides a fast and minimal API client that can be defined in yaml file.",
};
