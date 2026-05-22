"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Heart, MessageCircle, Pause, Play, Share2, Volume2, VolumeX } from "lucide-react";
import { Video, VideoCardHandle } from "@/types";

interface VideoCardProps {
  video: Video;
}

const VideoCard = forwardRef<VideoCardHandle, VideoCardProps>(
  ({ video }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(video.likes);
    const [isMuted, setIsMuted] = useState(true);
    const [isPaused, setIsPaused] = useState(true);
    const [showIcon, setShowIcon] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          if (!videoRef.current) return;
          setIsPaused(false);
          return videoRef.current.play();
        },
        pause: () => {
          if (!videoRef.current) return;
          setIsPaused(true);
          videoRef.current.pause();
        },
      }),
      []
    );

    const handleVideoClick = useCallback(() => {
      const el = videoRef.current;
      if (!el) return;

      if (el.paused) {
        el.play();
        setIsPaused(false);
      } else {
        el.pause();
        setIsPaused(true);
      }

      setShowIcon(true);
      setTimeout(() => setShowIcon(false), 800);
    }, []);

    const handleLike = useCallback(() => {
      const nextLiked = !isLiked;
      setIsLiked(nextLiked);
      setLikeCount((count) => (nextLiked ? count + 1 : count - 1));
    }, [isLiked]);

    const handleMuteToggle = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        const el = videoRef.current;
        if (!el) return;
        el.muted = !el.muted;
        setIsMuted(el.muted);
      },
      []
    );

    return (
      <div className="relative w-full h-full bg-black select-none overflow-hidden">
        <video
          ref={videoRef}
          src={video.url}
          className="w-full h-full object-cover cursor-pointer"
          loop
          muted
          playsInline
          preload="metadata"
          onClick={handleVideoClick}
          onPlay={() => setIsPaused(false)}
          onPause={() => setIsPaused(true)}
        />

        <div
          className={`absolute inset-0 flex items-center justify-center
                      pointer-events-none transition-opacity duration-300
                      ${showIcon ? "opacity-100" : "opacity-0"}`}
        >
          <div className="p-5 rounded-full bg-black/40 backdrop-blur-sm">
            {isPaused
              ? <Play  size={48} className="text-white fill-white" />
              : <Pause size={48} className="text-white fill-white" />
            }
          </div>
        </div>

        <div
          className="absolute inset-0 pointer-events-none
                     bg-gradient-to-t from-black/75 via-transparent to-black/20"
        />

        <div
          className="absolute bottom-20 left-4 right-20
                     pointer-events-none
                     md:bottom-12"
        >
          <p className="text-white font-bold text-base mb-1.5 drop-shadow-lg">
            {video.author}
          </p>
          <p className="text-white/90 text-sm leading-relaxed line-clamp-3 drop-shadow-lg">
            {video.description}
          </p>
        </div>

        <div
          className="absolute right-3 bottom-24 flex flex-col items-center gap-5
                     md:bottom-16"
        >
          <ActionButton
            onClick={handleLike}
            aria-label={isLiked ? "Bỏ thích" : "Thích"}
            count={formatCount(likeCount)}
          >
            <Heart
              size={33}
              strokeWidth={1.75}
              className={`transition-all duration-200 drop-shadow-lg
                ${isLiked
                  ? "fill-red-500 text-red-500 scale-110"
                  : "fill-transparent text-white"
                }`}
            />
          </ActionButton>

          <ActionButton aria-label="Bình luận" count={formatCount(video.comments)}>
            <MessageCircle size={33} strokeWidth={1.75} className="text-white drop-shadow-lg" />
          </ActionButton>

          <ActionButton aria-label="Chia sẻ" count={formatCount(video.shares)}>
            <Share2 size={33} strokeWidth={1.75} className="text-white drop-shadow-lg" />
          </ActionButton>
        </div>

        <button
          onClick={handleMuteToggle}
          aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          className="absolute top-4 right-4 p-2.5 rounded-full
                     bg-black/30 backdrop-blur-sm text-white
                     hover:bg-black/50 transition-colors duration-150"
        >
          {isMuted
            ? <VolumeX size={18} strokeWidth={1.75} />
            : <Volume2 size={18} strokeWidth={1.75} />
          }
        </button>
      </div>
    );
  }
);

VideoCard.displayName = "VideoCard";
export default VideoCard;

interface ActionButtonProps {
  onClick?: () => void;
  "aria-label": string;
  count: string;
  children: React.ReactNode;
}

function ActionButton({ onClick, "aria-label": label, count, children }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center gap-1.5 group cursor-pointer"
    >
      <span className="transition-transform duration-150 group-active:scale-90">
        {children}
      </span>
      <span className="text-white text-xs font-semibold drop-shadow-lg">
        {count}
      </span>
    </button>
  );
}

function formatCount(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}
