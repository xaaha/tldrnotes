import { defineConfig } from "astro/config";
import icon from "astro-icon";
import remarkCallout from "@r4ai/remark-callout";

import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

export default defineConfig({
  integrations: [icon(), mdx(), react()],
  markdown: {
    remarkPlugins: [remarkCallout],
    shikiConfig: {
      theme: "night-owl",
      // wrap: true,
    },
  },
});
