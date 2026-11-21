import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import {
  rasterizeIcons,
  HUB_ICONS,
} from "./node_modules/study-companion/src/lib/rasterizeIcons.ts";

// Forsiden som samler alle kompendiene. Vanlig Astro uten kursintegrasjonen:
// siden henter stilene og komponentene direkte fra study-companion, slik
// rammeverkets egen hub gjør. Hvert kompendium ligger på sin egen rotadresse.

/** Samme aksentfarge som forsiden bruker i lyst tema (også favicon). */
const HUB_ACCENT = "#2f7a6b";

// Vite må ikke skrive om denne til et kall på en lukket SSR-runner i astro:build:done.
const nativeImport = new Function("specifier", "return import(specifier)");

// Rasteriserer ikonet så og:image og apple-touch-icon har en ekte fil.
function hubIcons() {
  return {
    name: "hub-icons",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const written = await rasterizeIcons({
          accent: HUB_ACCENT,
          outDir: fileURLToPath(dir),
          targets: HUB_ICONS,
          importSharp: () => nativeImport("sharp"),
        });
        logger.info(`Lagde ikoner (${written.join(", ")})`);
      },
    },
  };
}

export default defineConfig({
  site: "https://fthorset.github.io",
  integrations: [hubIcons()],
});
