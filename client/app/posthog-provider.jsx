"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PHProvider({ children }) {
  useEffect(() => {
    const apiHost =
      process.env.NEXT_PUBLIC_POSTHOG_API_HOST ||
      process.env.NEXT_PUBLIC_POSTHOG_HOST;
    const uiHost =
      process.env.NEXT_PUBLIC_POSTHOG_UI_HOST ||
      process.env.NEXT_PUBLIC_POSTHOG_HOST;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: apiHost,
      ...(uiHost && apiHost !== uiHost ? { ui_host: uiHost } : {}),
      person_profiles: "identified_only",
      capture_pageview: false,
      session_recording: {
        maskAllInputs: true,
      },
      // Re-fetch flags after init (avoids stale cache; helps after toggling in PostHog UI).
      loaded: (client) => {
        client.reloadFeatureFlags();
      },
    });
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
