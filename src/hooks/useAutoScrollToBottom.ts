"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Auto-scrolls a scrollable container to its bottom whenever watchedValue
 * changes, but only while the bottom sentinel is already in view — so it
 * stops auto-scrolling as soon as the user manually scrolls up to read
 * earlier content.
 */
export function useAutoScrollToBottom<T>(watchedValue: T) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setAutoScroll(entry.isIntersecting),
      { root: el, threshold: 1.0 },
    );

    observer.observe(bottomRef.current!);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [watchedValue, autoScroll]);

  return { containerRef, bottomRef };
}
