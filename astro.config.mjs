import { defineConfig } from "astro/config";
import icon from "astro-icon";

import mdx from "@astrojs/mdx";

export default defineConfig({
  integrations: [icon(), mdx()],
});