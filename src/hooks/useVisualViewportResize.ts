"use client";

import { RefObject, useEffect } from "react";

/**
 * Keeps an element pinned to the visible viewport on mobile, so it isn't
 * obscured when the on-screen keyboard opens and shrinks the viewport.
 */
export function useVisualViewportResize<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const updatePosition = () => {
      const vv = window.visualViewport;
      if (!vv) {
        return;
      }

      element.style.position = "fixed";
      element.style.left = `${vv.offsetLeft + 15}px`;
      element.style.top = `${vv.offsetTop + 15}px`;
      element.style.width = `${vv.width - 15}px`;
      element.style.height = `${vv.height - 30}px`;
    };

    updatePosition(); // initial

    window.visualViewport?.addEventListener("resize", updatePosition);
    window.visualViewport?.addEventListener("scroll", updatePosition);

    return () => {
      window.visualViewport?.removeEventListener("resize", updatePosition);
      window.visualViewport?.removeEventListener("scroll", updatePosition);
    };
  }, [elementRef]);
}
