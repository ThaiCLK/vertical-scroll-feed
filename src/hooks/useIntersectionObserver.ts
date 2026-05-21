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
  // Lưu tham chiếu đến observer instance — không cần re-render khi thay đổi
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Map element → index để tra cứu nhanh O(1) khi callback fires
  const elementMapRef = useRef<Map<Element, number>>(new Map());

  // Giữ callback mới nhất mà không cần recreate observer
  const onIntersectRef = useRef(onIntersect);
  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    // Khởi tạo observer một lần duy nhất
    observerRef.current = new IntersectionObserver(
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
        // root: null → dùng viewport của trình duyệt làm vùng quan sát
        root: null,
        rootMargin: "0px",
        threshold,
      }
    );

    // Cleanup: ngắt kết nối observer khi component unmount
    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold]);

  /**
   * ref-setter callback — truyền vào prop `ref` của mỗi VideoCard wrapper.
   * Khi element mount:   đăng ký vào observer + lưu vào map.
   * Khi element unmount: hủy đăng ký + xóa khỏi map.
   */
  const setRef = (element: HTMLDivElement | null, index: number) => {
    const observer = observerRef.current;
    if (!observer) return;

    if (element) {
      observer.observe(element);
      elementMapRef.current.set(element, index);
    } else {
      // element = null nghĩa là component đã unmount
      elementMapRef.current.forEach((_, el) => {
        observer.unobserve(el);
      });
    }
  };

  return { setRef };
}
