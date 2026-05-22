import { useEffect, useRef } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  onIntersect: (index: number) => void;
}

export function useIntersectionObserver({
  threshold = 0.7,
  onIntersect,
}: UseIntersectionObserverOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementMapRef = useRef<Map<Element, number>>(new Map());
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = elementMapRef.current.get(entry.target);
            if (index !== undefined) {
              onIntersectRef.current(index);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold,
      }
    );
    observerRef.current = observer;

    elementMapRef.current.forEach((_, el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [threshold]);

  const setRef = (element: HTMLDivElement | null, index: number) => {
    if (element) {
      elementMapRef.current.set(element, index);
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    } else {
      let elToRemove: Element | null = null;
      elementMapRef.current.forEach((idx, el) => {
        if (idx === index) elToRemove = el;
      });
      if (elToRemove) {
        observerRef.current?.unobserve(elToRemove);
        elementMapRef.current.delete(elToRemove);
      }
    }
  };

  return { setRef };
}
