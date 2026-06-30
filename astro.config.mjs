import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://academy.marcellocoppola.com",
  output: "static",
  integrations: [sitemap()]
});
