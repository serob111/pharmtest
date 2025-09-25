import { createRoot } from "react-dom/client";
import App from "./App";
import * as Sentry from "@sentry/react";
import './index.css';
import './i18n';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  replaysSessionSampleRate: import.meta.env.DEV ? 1.0 : 0.05,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env.MODE,
  release: "my-app@" + __APP_VERSION__,
});

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
