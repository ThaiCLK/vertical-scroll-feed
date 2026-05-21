import { useEffect, useRef } from "react";

interface UseIntersectionObserverOptions {
  /**
   * Ngưỡng hiển thị để trigger callback.
   * 0.7 = video phải chiếm ≥70% viewport mới được tính là "đang xem"
   */
  threshold?: number;
  /** Callback nhận index của video đang active (vào viewport) */
  onIntersect: (index: number) => void;
}

/**
 * Hook theo dõi danh sách elements bằng IntersectionObserver.
 *
 * Trả về một ref-setter function — truyền function này vào prop `ref`
 * của từng VideoCard để đăng ký phần tử với observer.
 *
 * Tại sao dùng ref callback thay vì useRef + index?
 *   → Đảm bảo observer luôn nhận đúng element hiện tại kể cả khi
 *     component re-render hoặc element bị thay thế trong DOM.
 */
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

    // Khi useEffect chạy, các element có thể đã được lưu vào map
    // (vì ref callback chạy trước useEffect) -> cần observe chúng
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
      // Lọc và xoá element ứng với index này khi nó bị unmount
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

