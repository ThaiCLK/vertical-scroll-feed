export interface Video {
  id: string;
  url: string;
  author: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
}

/**
 * Handle được expose ra ngoài từ VideoCard thông qua useImperativeHandle.
 * Cho phép VideoFeed điều khiển play/pause mà không cần truy cập trực tiếp
 * vào DOM element của <video>.
 */
export interface VideoCardHandle {
  play: () => Promise<void> | undefined;
  pause: () => void;
}
