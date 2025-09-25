import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import pkg from "./package.json";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      svgr(),
      sentryVitePlugin({
        org: "sentry",         
        project: "117",        
        authToken: process.env.SENTRY_AUTH_TOKEN,
        url: "https://sentrynew.sdh.com.ua",
      }),
    ],
    define: {
      __API_BASE__: JSON.stringify(env.VITE_API_BASE_URL),
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    build: {
      sourcemap: true, 
    },
  };
});
