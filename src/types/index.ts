export interface Video {
  id: string;
  url: string;
  author: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface VideoCardHandle {
  play: () => Promise<void> | undefined;
  pause: () => void;
}
