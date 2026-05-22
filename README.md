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

## Giải thích kỹ thuật: Auto-play/Pause bằng Intersection Observer

### Vấn đề cần giải quyết

Trong một video feed kiểu TikTok, ứng dụng cần tự động **phát video đang
hiển thị** và **tạm dừng video đã cuộn qua** — mà không cần người dùng
tương tác thủ công. Sử dụng sự kiện `scroll` thông thường để đo vị trí
từng video sẽ rất tốn kém về hiệu suất vì nó fires liên tục trên main thread.

### Giải pháp: Intersection Observer API

`IntersectionObserver` là một Web API cho phép theo dõi **tỷ lệ hiển thị**
của một element trong viewport **hoàn toàn bất đồng bộ** — không chặn
main thread, không cần lắng nghe sự kiện scroll.

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

### Chi tiết triển khai

**1. Khởi tạo Observer với ngưỡng 70%**

```typescript
new IntersectionObserver(callback, { threshold: 0.7 })
```

Ngưỡng `0.7` được chọn có chủ đích: đủ lớn để tránh trigger sớm khi video
chỉ vừa xuất hiện ở rìa màn hình, nhưng không quá cao để tránh trường hợp
không bao giờ đạt ngưỡng trên thiết bị nhỏ.

**2. Pattern `forwardRef` + `useImperativeHandle`**

Mỗi `VideoCard` expose một API `{ play, pause }` ra ngoài thông qua
`useImperativeHandle`. Điều này tách biệt hoàn toàn logic điều khiển
(VideoFeed) khỏi implementation nội bộ (VideoCard) — đúng nguyên tắc
**Separation of Concerns**.

```typescript
useImperativeHandle(ref, () => ({
  play: () => videoRef.current?.play(),
  pause: () => videoRef.current?.pause(),
}));
```

**3. Tránh Stale Closure trong Callback**

Callback của observer được khởi tạo một lần duy nhất (trong `useEffect`).
Để tránh stale closure khi đọc `activeIndex`, `handleIntersect` sử dụng
**functional update** của `setState`:

```typescript
setActiveIndex((prevIndex) => {
  cardRefs.current[prevIndex]?.pause(); // ← luôn là giá trị mới nhất
  cardRefs.current[index]?.play();
  return index;
});
```

Pattern này đảm bảo luôn đọc được `prevIndex` chính xác mà không cần
đưa `activeIndex` vào dependency array — tránh việc observer bị recreate
mỗi lần index thay đổi.

**4. Ref Callback thay vì `useRef` + index trực tiếp**

Thay vì `useRef<HTMLDivElement[]>([])`, dự án dùng **ref callback function**
được truyền vào prop `ref` của từng wrapper div. Cách này đảm bảo
observer luôn nhận đúng DOM element hiện tại kể cả khi component
re-render hoặc list thay đổi thứ tự.

### Kết quả

| Tiêu chí | Giá trị |
|---|---|
| Trigger threshold | 70% viewport |
| Blocking main thread | Không (async API) |
| Số observer instance | 1 (dùng chung cho toàn bộ feed) |
| Cleanup | `observer.disconnect()` khi unmount |

---

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
