"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, ZoomIn } from "lucide-react";

/**
 * Lightweight pan + zoom cropper. The user drags the photo behind a fixed
 * aspect frame and zooms with the slider; "Use photo" renders exactly the
 * framed region to a canvas and hands back a Blob.
 *
 *   <ImageCropModal file={file} aspect={1} onCancel={..} onCropped={(blob)=>..} />
 */
const FRAME_W = 300; // on-screen frame width in px
const OUT_W = 1000; // exported width in px (height follows the aspect)

export default function ImageCropModal({
  file,
  aspect = 1,
  title = "Position your photo",
  onCancel,
  onCropped,
}) {
  const frameH = Math.round(FRAME_W / aspect);
  const [url, setUrl] = useState(null);
  const [nat, setNat] = useState(null); // { w, h }
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const drag = useRef(null);

  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  // base scale = cover the frame at zoom 1
  const baseScale = nat
    ? Math.max(FRAME_W / nat.w, frameH / nat.h)
    : 1;
  const scale = baseScale * zoom;
  const dispW = nat ? nat.w * scale : 0;
  const dispH = nat ? nat.h * scale : 0;

  const clamp = useCallback(
    (o) => {
      const maxX = Math.max(0, (dispW - FRAME_W) / 2);
      const maxY = Math.max(0, (dispH - frameH) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, o.x)),
        y: Math.min(maxY, Math.max(-maxY, o.y)),
      };
    },
    [dispW, dispH, frameH],
  );

  useEffect(() => {
    setOffset((o) => clamp(o));
  }, [zoom, nat, clamp]);

  const onImgLoad = (e) => {
    setNat({ w: e.target.naturalWidth, h: e.target.naturalHeight });
  };

  const startDrag = (e) => {
    const pt = "touches" in e ? e.touches[0] : e;
    drag.current = { px: pt.clientX, py: pt.clientY, ...offset };
  };
  const moveDrag = (e) => {
    if (!drag.current) return;
    const pt = "touches" in e ? e.touches[0] : e;
    setOffset(
      clamp({
        x: drag.current.x + (pt.clientX - drag.current.px),
        y: drag.current.y + (pt.clientY - drag.current.py),
      }),
    );
  };
  const endDrag = () => {
    drag.current = null;
  };

  const apply = async () => {
    if (!nat || busy) return;
    setBusy(true);
    try {
      const outW = OUT_W;
      const outH = Math.round(OUT_W / aspect);
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outW, outH);

      // Map the on-screen frame back to source-image pixels. The image's centre
      // sits at (FRAME_W/2 + offset.x, frameH/2 + offset.y) in frame space.
      let sx = nat.w / 2 - (FRAME_W / 2 + offset.x) / scale;
      let sy = nat.h / 2 - (frameH / 2 + offset.y) / scale;
      let sw = FRAME_W / scale;
      let sh = frameH / scale;
      sx = Math.max(0, Math.min(sx, nat.w - sw));
      sy = Math.max(0, Math.min(sy, nat.h - sh));

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      await new Promise((res) => {
        if (img.complete) res();
        else img.onload = res;
      });
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
      canvas.toBlob(
        (blob) => {
          setBusy(false);
          if (blob) onCropped(blob);
        },
        "image/jpeg",
        0.9,
      );
    } catch {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 font-shop"
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchEnd={endDrag}
    >
      <div className="flex w-full max-w-[360px] flex-col gap-4 rounded-[16px] bg-white p-4">
        <p className="text-[14px] font-semibold text-shop-heading">{title}</p>

        <div
          className="relative mx-auto overflow-hidden rounded-[10px] bg-shop-bg select-none"
          style={{ width: FRAME_W, height: frameH, touchAction: "none" }}
          onMouseDown={startDrag}
          onMouseMove={moveDrag}
          onTouchStart={startDrag}
          onTouchMove={moveDrag}
        >
          {url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt=""
              onLoad={onImgLoad}
              draggable={false}
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
              style={{
                width: dispW || "auto",
                height: dispH || "auto",
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              }}
            />
          )}
          <div className="pointer-events-none absolute inset-0 border border-white/40" />
        </div>

        <label className="flex items-center gap-2">
          <ZoomIn className="h-4 w-4 text-shop-text/60" />
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-shop-accent-1"
          />
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-[10px] border border-shop-border py-2.5 text-[13px] font-semibold text-shop-heading"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={apply}
            disabled={!nat || busy}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-shop-accent-1 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Use photo
          </button>
        </div>
      </div>
    </div>
  );
}
