import { ViewTransition, type ReactNode } from "react";

/**
 * Directional slide between pages. Links tagged transitionTypes={["nav-forward"]}
 * slide the new page in from the right, ["nav-back"] from the left. Untagged
 * transitions (browser back, refresh) swap instantly. The header stays put.
 * Wrap each page.tsx (not the layout: layouts don't remount on navigation).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
