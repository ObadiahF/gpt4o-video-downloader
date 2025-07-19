## 🧪 API Testing Guide (via `curl`)

### ✅ 1. Direct Download

Downloads a single file directly from a given URL.

```bash
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/video.mp4",
    "mode": "direct",
    "fileName": "test-direct.mp4"
  }'
```
### ✅ 2. M3U8 Stream Download (via FFmpeg)
Downloads an `.m3u8` video stream using FFmpeg.
```bash
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    "mode": "m3u8",
    "fileName": "test-m3u8.mp4"
  }'

```

### ✅ 3. Segmented Download (TS chunks)

Downloads `.ts` video segments like `seg-1-v1-a1.ts`, `seg-2-v1-a1.ts`, etc.

```bash
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/video/seg-1-v1-a1.ts",
    "mode": "segment",
    "fileName": "test-segments.mp4"
  }'
```
