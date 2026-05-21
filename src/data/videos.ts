// src/data/videos.ts

import { Video } from "@/types";

export const videos: Video[] = [
  {
    id: "1",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    author: "@big_buck_bunny",
    description:
      "Big Buck Bunny - Phim hoạt hình mã nguồn mở 🐰 #animation #funny #cute",
    likes: 124_200,
    comments: 3_400,
    shares: 8_900,
  },
  {
    id: "2",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
    author: "@friday_vibes",
    description:
      "Friday vibes đang cảm nhận khác biệt ✨ #friday #mood #weekend #chill",
    likes: 87_500,
    comments: 2_100,
    shares: 4_500,
  },
  {
    id: "3",
    url: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    author: "@sintel_official",
    description:
      "Sintel - Official Trailer 🎬 Open Movie by Blender Foundation #blender #animation",
    likes: 231_000,
    comments: 9_800,
    shares: 15_000,
  },
];
