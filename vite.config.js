import { svelte } from "@sveltejs/vite-plugin-svelte";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [svelte()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
};

export default config;
