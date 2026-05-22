# VideoFeed — Short Video Scrolling App

Ứng dụng xem video cuộn dọc (tương tự TikTok/Reels) được xây dựng với
**Next.js 14 (App Router)**, **TypeScript** và **Tailwind CSS**.

---

## Tính năng

- Giao diện full-screen trên Mobile, tỷ lệ 9:16 căn giữa trên PC
- Cuộn mượt từng video bằng CSS Scroll Snap
- Auto-play/pause thông minh theo viewport (Intersection Observer API)
- Click vào video để Play/Pause với hiệu ứng icon nhất thời
- Nút "Tim" đổi màu đỏ và cập nhật số lượng realtime
- Navigation responsive: Bottom Bar (Mobile) / Left Sidebar (PC)
- Tắt/bật âm thanh từng video

---

## Hướng dẫn chạy

```bash
npm install
npm run dev
# Mở http://localhost:3000
```
---

### Luồng hoạt động

```
Người dùng cuộn xuống
│
▼
IntersectionObserver phát hiện video[index] chiếm ≥ 70% viewport
│
▼
Callback handleIntersect(index) được gọi
│
├──▶ cardRefs[prevIndex].pause()   ← Dừng video cũ
│
└──▶ cardRefs[index].play()        ← Phát video mới
```

## Cấu trúc dự án

```
src/
├── app/
│   ├── globals.css       # Scroll Snap utilities, hide-scrollbar
│   ├── layout.tsx        # Root layout + Navigation
│   └── page.tsx          # Entry point
├── components/
│   ├── Navigation.tsx    # Responsive nav (Bottom / Sidebar)
│   ├── VideoCard.tsx     # Player + UI overlay + Like logic
│   └── VideoFeed.tsx     # Scroll container + Observer logic
├── data/
│   └── videos.ts         # Mock data (3 videos)
├── hooks/
│   └── useIntersectionObserver.ts
└── types/
    └── index.ts          # Video, VideoCardHandle interfaces
```

---

## Các quyết định kỹ thuật nổi bật

| Vấn đề | Giải pháp | Lý do |
|---|---|---|
| Parent điều khiển video | `forwardRef` + `useImperativeHandle` | Tách biệt logic, không expose DOM trực tiếp |
| Tránh stale closure | Functional `setState(prev => ...)` | Observer callback không cần recreate |
| Auto-play/pause | `IntersectionObserver` (threshold 0.7) | Non-blocking, hiệu suất cao hơn scroll event |
| Responsive nav | Tailwind `md:hidden` / `hidden md:flex` | Zero JS, pure CSS breakpoint |
| Ẩn scrollbar | Custom CSS utility `hide-scrollbar` | Giữ UX mượt mà trên mọi trình duyệt |
