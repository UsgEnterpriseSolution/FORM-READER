import { useEffect, useRef } from "react";

/**
 * Scroll a container to the bottom when the observed length increases.
 *
 * @param containerRef - ref to a scrollable container element
 * @param length - numeric length to watch (e.g. items.length)
 */
export function useAutoScrollOnAppend(
  containerRef: React.RefObject<HTMLElement | null>,
  length: number | undefined | null,
) {
  const prevLengthRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    const next = length ?? 0;

    if (!container) {
      prevLengthRef.current = next;
      return;
    }

    if (prevLengthRef.current < next) {
      try {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      } catch (e) {
        // fallback for environments that don't support scrollTo with options
        // directly assign scrollTop
        // @ts-ignore - some HTML elements expose scrollTop
        container.scrollTop = container.scrollHeight;
      }
    }

    prevLengthRef.current = next;
  }, [containerRef, length]);
}
