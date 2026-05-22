"use client";

import { useCallback, useRef, useState } from "react";
import { videos } from "@/data/videos";
import { VideoCardHandle } from "@/types";
import VideoCard from "./VideoCard";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export default function VideoFeed() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const cardRefs = useRef<(VideoCardHandle | null)[]>([]);
  const activeIndexRef = useRef<number>(0);

  const handleIntersect = useCallback(
    (index: number) => {
      const prevIndex = activeIndexRef.current;
      if (prevIndex !== index) {
        cardRefs.current[prevIndex]?.pause();
        cardRefs.current[index]?.play();
        
        activeIndexRef.current = index;
        setActiveIndex(index);
      }
    },
    []
  );

  const { setRef: setObserverRef } = useIntersectionObserver({
    threshold: 0.7,
    onIntersect: handleIntersect,
  });

  const setCardRef = useCallback(
    (wrapperEl: HTMLDivElement | null, index: number) => {
      setObserverRef(wrapperEl, index);
    },
    [setObserverRef]
  );

  return (
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
