import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * `ScrollManager` keeps scroll behavior sane across SPA navigations.
 *
 * 1. New route (path changes, no hash): scroll to the top so visitors don't
 *    land deep on the next page just because they were scrolled when they
 *    clicked the link.
 * 2. Hash navigation (e.g. `/#articles` or `/#newsletter`): smooth-scroll
 *    the element into view. React Router's <Link> doesn't do this on its
 *    own, so without this helper the header's "Articles" link silently
 *    leaves the page wherever it was. Honors `prefers-reduced-motion`.
 * 3. Same-page hash clicks: re-trigger the scroll even though `pathname`
 *    didn't change (the location object's identity changes on each push,
 *    so a hash-only navigation still fires the effect).
 *
 * The component renders nothing — drop it once inside <BrowserRouter> in
 * App.tsx.
 */
const ScrollManager = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const behavior: ScrollBehavior = prefersReduced ? "auto" : "smooth";

    if (hash) {
      // The target may not be in the DOM yet on first paint after a route
      // change — wait one frame to give the new page a chance to mount.
      const scrollToTarget = () => {
        const id = hash.startsWith("#") ? hash.slice(1) : hash;
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior, block: "start" });
        }
      };
      // requestAnimationFrame so the new route's tree has committed.
      const raf = window.requestAnimationFrame(scrollToTarget);
      return () => window.cancelAnimationFrame(raf);
    }

    window.scrollTo({ top: 0, left: 0, behavior });
    // `key` (a per-history-entry id) ensures hash-only nav still re-runs the
    // effect even when pathname hasn't changed.
  }, [pathname, hash, key]);

  return null;
};

export default ScrollManager;
