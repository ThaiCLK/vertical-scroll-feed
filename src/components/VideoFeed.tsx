"use client";

import { useCallback, useRef, useState } from "react";
import { videos } from "@/data/videos";
import { VideoCardHandle } from "@/types";
import VideoCard from "./VideoCard";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

/**
 * VideoFeed — Container chính quản lý toàn bộ logic:
 *   1. CSS Scroll Snap: cuộn mượt từng video full-screen
 *   2. IntersectionObserver: auto-play/pause theo viewport
 *   3. Ref array: điều khiển từng VideoCard bằng VideoCardHandle API
 */
export default function VideoFeed() {
  // Index của video đang active (đang play)
  const [activeIndex, setActiveIndex] = useState<number>(0);

  /**
   * Mảng ref đến từng VideoCard.
   * Dùng useRef để tránh re-render khi mảng thay đổi.
   * Không dùng state vì đây là imperative handle, không phải UI data.
   */
  const cardRefs = useRef<(VideoCardHandle | null)[]>([]);

  /**
   * Callback được gọi bởi IntersectionObserver mỗi khi
   * một video chiếm ≥70% viewport.
   *
   * Logic:
   *   - Pause video cũ (activeIndex trước đó)
   *   - Play video mới
   *   - Cập nhật activeIndex
   */
  const activeIndexRef = useRef<number>(0);

  const handleIntersect = useCallback(
    (index: number) => {
      const prevIndex = activeIndexRef.current;
      if (prevIndex !== index) {
        // Pause video đang chạy
        cardRefs.current[prevIndex]?.pause();
        
        // Play video mới vào viewport
        cardRefs.current[index]?.play();
        
        activeIndexRef.current = index;
        setActiveIndex(index);
      }
    },
    [] // Không phụ thuộc vào activeIndex → tránh recreate observer
  );

  const { setRef: setObserverRef } = useIntersectionObserver({
    threshold: 0.7,
    onIntersect: handleIntersect,
  });

  /**
   * Callback ref kép: gán cả VideoCardHandle lẫn đăng ký với observer
   * Tại sao gộp chung?
   *   → Một element DOM duy nhất cần được tracked bởi cả 2 hệ thống.
   *     Nếu tách ra, khó đồng bộ giữa container div và VideoCard handle.
   */
  const setCardRef = useCallback(
    (wrapperEl: HTMLDivElement | null, index: number) => {
      // Đăng ký wrapper div với IntersectionObserver
      setObserverRef(wrapperEl, index);
    },
    [setObserverRef]
  );

  return (
    /*
     * ─── SCROLL CONTAINER ────────────────────────────────────────
     * Mobile:  full-screen (w-full h-screen)
     * PC:      tỷ lệ 9:16, căn giữa trong <main>
     *
     * snap-y snap-mandatory → buộc browser dừng tại mỗi snap point
     * overflow-y-scroll     → luôn có scrollbar track (tránh layout shift)
     * hide-scrollbar        → ẩn thanh scroll nhưng vẫn scroll được
     */
    <div
      className="
        w-full h-screen
        md:w-auto md:h-screen md:aspect-[9/16] md:max-h-screen
        overflow-y-scroll
        snap-y snap-mandatory
        hide-scrollbar
        relative
      "
    >
      {videos.map((video, index) => (
        /*
         * ─── SNAP ITEM ────────────────────────────────────────────
         * snap-start  → điểm dừng snap tại đầu mỗi item
         * shrink-0    → không bị co lại (quan trọng với flex container)
         * h-screen    → mỗi video chiếm đúng 1 viewport height
         */
        <div
          key={video.id}
          ref={(el) => setCardRef(el, index)}
          className="snap-start shrink-0 w-full h-screen relative"
        >
          <VideoCard
            video={video}
            ref={(handle) => {
              cardRefs.current[index] = handle;
            }}
          />

          {/* ── Dot Indicator ─────────────────────────────────── */}
          <div className="absolute top-1/2 -translate-y-1/2 right-1.5 md:-right-6 flex flex-col gap-1.5 z-10">
            {videos.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={`block rounded-full transition-all duration-300 ${
                  dotIndex === activeIndex
                    ? "w-1.5 h-5 bg-white"
                    : "w-1.5 h-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
