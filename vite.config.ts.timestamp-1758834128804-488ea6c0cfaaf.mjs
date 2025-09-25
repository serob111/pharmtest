// vite.config.ts
import { defineConfig, loadEnv } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import svgr from "file:///home/project/node_modules/vite-plugin-svgr/dist/index.js";
import { sentryVitePlugin } from "file:///home/project/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";

// package.json
var package_default = {
  name: "pharmacy-one",
  private: true,
  version: "0.0.0",
  type: "module",
  engines: {
    node: "22.18.0"
  },
  scripts: {
    qa: "vite --mode qa",
    developer: "vite --mode developer",
    dev: "vite",
    build: "vite build",
    "build:qa": "vite build --mode qa",
    "build:dev": "vite build --mode development",
    "build:developer": "vite build --mode developer",
    "build:prod": "vite build --mode production",
    lint: "eslint .",
    "lint:fix": "eslint . --fix",
    preview: "vite preview",
    test: "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest --run --coverage --bail=1",
    "test:ci": "vitest --run --coverage --silent --coverage.reportOnFailure --coverage.reporter cobertura --coverage.reporter json-summary --reporter=default --reporter=junit --outputFile=reports/junit-report.xml",
    format: "prettier --write .",
    "format:check": "prettier --check ."
  },
  dependencies: {
    "@sentry/react": "^10.9.0",
    axios: "^1.10.0",
    "axios-auth-refresh": "^3.3.6",
    clsx: "^2.1.1",
    i18next: "^23.8.2",
    qs: "^6.14.0",
    react: "^18.3.1",
    "react-dom": "^18.3.1",
    "react-i18next": "^14.0.5",
    "react-input-mask": "^2.0.4",
    "react-router": "^7.6.3",
    "tailwind-merge": "^3.3.1"
  },
  devDependencies: {
    "@eslint/js": "^9.9.1",
    "@sentry/vite-plugin": "^4.3.0",
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^24.1.0",
    "@types/qs": "^6.14.0",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@types/react-input-mask": "^3.0.6",
    "@vitejs/plugin-react": "^4.3.1",
    "@vitest/coverage-v8": "^3.2.4",
    "@vitest/ui": "^3.2.4",
    autoprefixer: "^10.4.18",
    eslint: "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    globals: "^15.9.0",
    jsdom: "^24.0.0",
    msw: "^2.10.4",
    postcss: "^8.4.35",
    prettier: "^3.2.5",
    tailwindcss: "^3.4.1",
    typescript: "^5.5.3",
    "typescript-eslint": "^8.3.0",
    vite: "^5.4.2",
    "vite-plugin-svgr": "^4.3.0",
    vitest: "^3.2.4"
  }
};

// vite.config.ts
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react(),
      svgr(),
      sentryVitePlugin({
        org: "sentry",
        project: "117",
        authToken: process.env.SENTRY_AUTH_TOKEN,
        url: "https://sentrynew.sdh.com.ua"
      })
    ],
    define: {
      __API_BASE__: JSON.stringify(env.VITE_API_BASE_URL),
      __APP_VERSION__: JSON.stringify(package_default.version)
    },
    build: {
      sourcemap: true
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvcHJvamVjdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvcHJvamVjdC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBzdmdyIGZyb20gXCJ2aXRlLXBsdWdpbi1zdmdyXCI7XG5pbXBvcnQgeyBzZW50cnlWaXRlUGx1Z2luIH0gZnJvbSBcIkBzZW50cnkvdml0ZS1wbHVnaW5cIjtcbmltcG9ydCBwa2cgZnJvbSBcIi4vcGFja2FnZS5qc29uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKTtcblxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KCksXG4gICAgICBzdmdyKCksXG4gICAgICBzZW50cnlWaXRlUGx1Z2luKHtcbiAgICAgICAgb3JnOiBcInNlbnRyeVwiLCAgICAgICAgIFxuICAgICAgICBwcm9qZWN0OiBcIjExN1wiLCAgICAgICAgXG4gICAgICAgIGF1dGhUb2tlbjogcHJvY2Vzcy5lbnYuU0VOVFJZX0FVVEhfVE9LRU4sXG4gICAgICAgIHVybDogXCJodHRwczovL3NlbnRyeW5ldy5zZGguY29tLnVhXCIsXG4gICAgICB9KSxcbiAgICBdLFxuICAgIGRlZmluZToge1xuICAgICAgX19BUElfQkFTRV9fOiBKU09OLnN0cmluZ2lmeShlbnYuVklURV9BUElfQkFTRV9VUkwpLFxuICAgICAgX19BUFBfVkVSU0lPTl9fOiBKU09OLnN0cmluZ2lmeShwa2cudmVyc2lvbiksXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgc291cmNlbWFwOiB0cnVlLCBcbiAgICB9LFxuICB9O1xufSk7XG4iLCAie1xuICBcIm5hbWVcIjogXCJwaGFybWFjeS1vbmVcIixcbiAgXCJwcml2YXRlXCI6IHRydWUsXG4gIFwidmVyc2lvblwiOiBcIjAuMC4wXCIsXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcImVuZ2luZXNcIjoge1xuICAgIFwibm9kZVwiOiBcIjIyLjE4LjBcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwicWFcIjogXCJ2aXRlIC0tbW9kZSBxYVwiLFxuICAgIFwiZGV2ZWxvcGVyXCI6IFwidml0ZSAtLW1vZGUgZGV2ZWxvcGVyXCIsXG4gICAgXCJkZXZcIjogXCJ2aXRlXCIsXG4gICAgXCJidWlsZFwiOiBcInZpdGUgYnVpbGRcIixcbiAgICBcImJ1aWxkOnFhXCI6IFwidml0ZSBidWlsZCAtLW1vZGUgcWFcIixcbiAgICBcImJ1aWxkOmRldlwiOiBcInZpdGUgYnVpbGQgLS1tb2RlIGRldmVsb3BtZW50XCIsXG4gICAgXCJidWlsZDpkZXZlbG9wZXJcIjogXCJ2aXRlIGJ1aWxkIC0tbW9kZSBkZXZlbG9wZXJcIixcbiAgICBcImJ1aWxkOnByb2RcIjogXCJ2aXRlIGJ1aWxkIC0tbW9kZSBwcm9kdWN0aW9uXCIsXG4gICAgXCJsaW50XCI6IFwiZXNsaW50IC5cIixcbiAgICBcImxpbnQ6Zml4XCI6IFwiZXNsaW50IC4gLS1maXhcIixcbiAgICBcInByZXZpZXdcIjogXCJ2aXRlIHByZXZpZXdcIixcbiAgICBcInRlc3RcIjogXCJ2aXRlc3RcIixcbiAgICBcInRlc3Q6dWlcIjogXCJ2aXRlc3QgLS11aVwiLFxuICAgIFwidGVzdDpydW5cIjogXCJ2aXRlc3QgcnVuXCIsXG4gICAgXCJ0ZXN0OmNvdmVyYWdlXCI6IFwidml0ZXN0IC0tcnVuIC0tY292ZXJhZ2UgLS1iYWlsPTFcIixcbiAgICBcInRlc3Q6Y2lcIjogXCJ2aXRlc3QgLS1ydW4gLS1jb3ZlcmFnZSAtLXNpbGVudCAtLWNvdmVyYWdlLnJlcG9ydE9uRmFpbHVyZSAtLWNvdmVyYWdlLnJlcG9ydGVyIGNvYmVydHVyYSAtLWNvdmVyYWdlLnJlcG9ydGVyIGpzb24tc3VtbWFyeSAtLXJlcG9ydGVyPWRlZmF1bHQgLS1yZXBvcnRlcj1qdW5pdCAtLW91dHB1dEZpbGU9cmVwb3J0cy9qdW5pdC1yZXBvcnQueG1sXCIsXG4gICAgXCJmb3JtYXRcIjogXCJwcmV0dGllciAtLXdyaXRlIC5cIixcbiAgICBcImZvcm1hdDpjaGVja1wiOiBcInByZXR0aWVyIC0tY2hlY2sgLlwiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBzZW50cnkvcmVhY3RcIjogXCJeMTAuOS4wXCIsXG4gICAgXCJheGlvc1wiOiBcIl4xLjEwLjBcIixcbiAgICBcImF4aW9zLWF1dGgtcmVmcmVzaFwiOiBcIl4zLjMuNlwiLFxuICAgIFwiY2xzeFwiOiBcIl4yLjEuMVwiLFxuICAgIFwiaTE4bmV4dFwiOiBcIl4yMy44LjJcIixcbiAgICBcInFzXCI6IFwiXjYuMTQuMFwiLFxuICAgIFwicmVhY3RcIjogXCJeMTguMy4xXCIsXG4gICAgXCJyZWFjdC1kb21cIjogXCJeMTguMy4xXCIsXG4gICAgXCJyZWFjdC1pMThuZXh0XCI6IFwiXjE0LjAuNVwiLFxuICAgIFwicmVhY3QtaW5wdXQtbWFza1wiOiBcIl4yLjAuNFwiLFxuICAgIFwicmVhY3Qtcm91dGVyXCI6IFwiXjcuNi4zXCIsXG4gICAgXCJ0YWlsd2luZC1tZXJnZVwiOiBcIl4zLjMuMVwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBlc2xpbnQvanNcIjogXCJeOS45LjFcIixcbiAgICBcIkBzZW50cnkvdml0ZS1wbHVnaW5cIjogXCJeNC4zLjBcIixcbiAgICBcIkB0ZXN0aW5nLWxpYnJhcnkvamVzdC1kb21cIjogXCJeNi40LjJcIixcbiAgICBcIkB0ZXN0aW5nLWxpYnJhcnkvcmVhY3RcIjogXCJeMTQuMS4yXCIsXG4gICAgXCJAdGVzdGluZy1saWJyYXJ5L3VzZXItZXZlbnRcIjogXCJeMTQuNS4yXCIsXG4gICAgXCJAdHlwZXMvbm9kZVwiOiBcIl4yNC4xLjBcIixcbiAgICBcIkB0eXBlcy9xc1wiOiBcIl42LjE0LjBcIixcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4zLjVcIixcbiAgICBcIkB0eXBlcy9yZWFjdC1kb21cIjogXCJeMTguMy4wXCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtaW5wdXQtbWFza1wiOiBcIl4zLjAuNlwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjogXCJeNC4zLjFcIixcbiAgICBcIkB2aXRlc3QvY292ZXJhZ2UtdjhcIjogXCJeMy4yLjRcIixcbiAgICBcIkB2aXRlc3QvdWlcIjogXCJeMy4yLjRcIixcbiAgICBcImF1dG9wcmVmaXhlclwiOiBcIl4xMC40LjE4XCIsXG4gICAgXCJlc2xpbnRcIjogXCJeOS45LjFcIixcbiAgICBcImVzbGludC1wbHVnaW4tcmVhY3QtaG9va3NcIjogXCJeNS4xLjAtcmMuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdC1yZWZyZXNoXCI6IFwiXjAuNC4xMVwiLFxuICAgIFwiZ2xvYmFsc1wiOiBcIl4xNS45LjBcIixcbiAgICBcImpzZG9tXCI6IFwiXjI0LjAuMFwiLFxuICAgIFwibXN3XCI6IFwiXjIuMTAuNFwiLFxuICAgIFwicG9zdGNzc1wiOiBcIl44LjQuMzVcIixcbiAgICBcInByZXR0aWVyXCI6IFwiXjMuMi41XCIsXG4gICAgXCJ0YWlsd2luZGNzc1wiOiBcIl4zLjQuMVwiLFxuICAgIFwidHlwZXNjcmlwdFwiOiBcIl41LjUuM1wiLFxuICAgIFwidHlwZXNjcmlwdC1lc2xpbnRcIjogXCJeOC4zLjBcIixcbiAgICBcInZpdGVcIjogXCJeNS40LjJcIixcbiAgICBcInZpdGUtcGx1Z2luLXN2Z3JcIjogXCJeNC4zLjBcIixcbiAgICBcInZpdGVzdFwiOiBcIl4zLjIuNFwiXG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxjQUFjLGVBQWU7QUFDL1AsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHdCQUF3Qjs7O0FDSGpDO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxTQUFXO0FBQUEsRUFDWCxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsSUFDVCxNQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsU0FBVztBQUFBLElBQ1QsSUFBTTtBQUFBLElBQ04sV0FBYTtBQUFBLElBQ2IsS0FBTztBQUFBLElBQ1AsT0FBUztBQUFBLElBQ1QsWUFBWTtBQUFBLElBQ1osYUFBYTtBQUFBLElBQ2IsbUJBQW1CO0FBQUEsSUFDbkIsY0FBYztBQUFBLElBQ2QsTUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osU0FBVztBQUFBLElBQ1gsTUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsWUFBWTtBQUFBLElBQ1osaUJBQWlCO0FBQUEsSUFDakIsV0FBVztBQUFBLElBQ1gsUUFBVTtBQUFBLElBQ1YsZ0JBQWdCO0FBQUEsRUFDbEI7QUFBQSxFQUNBLGNBQWdCO0FBQUEsSUFDZCxpQkFBaUI7QUFBQSxJQUNqQixPQUFTO0FBQUEsSUFDVCxzQkFBc0I7QUFBQSxJQUN0QixNQUFRO0FBQUEsSUFDUixTQUFXO0FBQUEsSUFDWCxJQUFNO0FBQUEsSUFDTixPQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixpQkFBaUI7QUFBQSxJQUNqQixvQkFBb0I7QUFBQSxJQUNwQixnQkFBZ0I7QUFBQSxJQUNoQixrQkFBa0I7QUFBQSxFQUNwQjtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDakIsY0FBYztBQUFBLElBQ2QsdUJBQXVCO0FBQUEsSUFDdkIsNkJBQTZCO0FBQUEsSUFDN0IsMEJBQTBCO0FBQUEsSUFDMUIsK0JBQStCO0FBQUEsSUFDL0IsZUFBZTtBQUFBLElBQ2YsYUFBYTtBQUFBLElBQ2IsZ0JBQWdCO0FBQUEsSUFDaEIsb0JBQW9CO0FBQUEsSUFDcEIsMkJBQTJCO0FBQUEsSUFDM0Isd0JBQXdCO0FBQUEsSUFDeEIsdUJBQXVCO0FBQUEsSUFDdkIsY0FBYztBQUFBLElBQ2QsY0FBZ0I7QUFBQSxJQUNoQixRQUFVO0FBQUEsSUFDViw2QkFBNkI7QUFBQSxJQUM3QiwrQkFBK0I7QUFBQSxJQUMvQixTQUFXO0FBQUEsSUFDWCxPQUFTO0FBQUEsSUFDVCxLQUFPO0FBQUEsSUFDUCxTQUFXO0FBQUEsSUFDWCxVQUFZO0FBQUEsSUFDWixhQUFlO0FBQUEsSUFDZixZQUFjO0FBQUEsSUFDZCxxQkFBcUI7QUFBQSxJQUNyQixNQUFRO0FBQUEsSUFDUixvQkFBb0I7QUFBQSxJQUNwQixRQUFVO0FBQUEsRUFDWjtBQUNGOzs7QURsRUEsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQztBQUV2QyxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixLQUFLO0FBQUEsTUFDTCxpQkFBaUI7QUFBQSxRQUNmLEtBQUs7QUFBQSxRQUNMLFNBQVM7QUFBQSxRQUNULFdBQVcsUUFBUSxJQUFJO0FBQUEsUUFDdkIsS0FBSztBQUFBLE1BQ1AsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLGNBQWMsS0FBSyxVQUFVLElBQUksaUJBQWlCO0FBQUEsTUFDbEQsaUJBQWlCLEtBQUssVUFBVSxnQkFBSSxPQUFPO0FBQUEsSUFDN0M7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFdBQVc7QUFBQSxJQUNiO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
