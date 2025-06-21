import { defineConfig } from "astro/config";
import icon from "astro-icon";
import remarkCallout from "@r4ai/remark-callout";

import mdx from "@astrojs/mdx";

export default defineConfig({
  integrations: [icon(), mdx()],
  markdown: {
    remarkPlugins: [remarkCallout],
    shikiConfig: {
      theme: "tokyo-night",
      // wrap: true,
    },
  },
});
