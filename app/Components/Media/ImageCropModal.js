"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Loader2, RotateCcw } from "lucide-react";

/**
 * Photo-editor style cropper. The full image is shown and the user drags /
 * resizes a selection box over it (8 handles + move), exactly like a desktop
 * image editor. `aspect` optionally locks the box to a ratio; leave it out for
 * a completely free crop. "Use photo" renders the selected region to a canvas
 * at its real resolution and hands back a Blob.
 *
 *   <ImageCropModal file={file} onCancel={..} onCropped={(blob) => ..} />
 *   <ImageCropModal file={file} aspect={1} ... />   // locked square
 */
const MAX_OUT = 2000; // cap the longest edge of the exported image (px)

function initialCrop(mediaWidth, mediaHeight, aspect) {
  if (aspect) {
    return centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
      mediaWidth,
      mediaHeight,
    );
  }
  // free crop: start from (almost) the whole image
  return { unit: "%", x: 2, y: 2, width: 96, height: 96 };
}

export default function ImageCropModal({
  file,
  aspect,
  title = "Crop your image",
  onCancel,
  onCropped,
}) {
  const [url, setUrl] = useState(null);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [busy, setBusy] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // syncing an object-URL to the picked File is a legit external-resource effect
    const u = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const seedCrop = useCallback(
    (el) => {
      const { width, height } = el;
      const next = initialCrop(width, height, aspect);
      setCrop(next);
      setCompletedCrop(convertToPixelCrop(next, width, height));
    },
    [aspect],
  );

  const onImageLoad = (e) => seedCrop(e.currentTarget);

  const reset = () => {
    if (imgRef.current) seedCrop(imgRef.current);
  };

  const apply = async () => {
    const img = imgRef.current;
    if (!img || !completedCrop || !completedCrop.width || busy) return;
    setBusy(true);
    try {
      // completedCrop is in on-screen px; scale up to the real image pixels
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      const srcW = completedCrop.width * scaleX;
      const srcH = completedCrop.height * scaleY;
      const srcX = completedCrop.x * scaleX;
      const srcY = completedCrop.y * scaleY;

      // keep the crop's real ratio, cap the longest edge
      const ratio = Math.min(1, MAX_OUT / Math.max(srcW, srcH));
      const outW = Math.max(1, Math.round(srcW * ratio));
      const outH = Math.max(1, Math.round(srcH * ratio));

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff"; // JPEG has no alpha
      ctx.fillRect(0, 0, outW, outH);
      ctx.imageSmoothingQuality = "high";

      // drawImage reads the element's intrinsic pixels, so the already-loaded
      // (and downscaled-for-display) <img> is the full-resolution source.
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 font-shop">
      <div className="flex max-h-[92vh] w-full max-w-[560px] flex-col gap-4 overflow-hidden rounded-[16px] bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-semibold text-shop-heading">{title}</p>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 text-[11.5px] font-medium text-shop-text/70 hover:text-shop-heading"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>

        <p className="-mt-1 text-[11.5px] text-shop-text/60">
          Drag the box to move it, or pull any edge or corner to resize. The
          shaded area is trimmed off.
        </p>

        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-[10px] bg-shop-bg p-2">
          {url && (
            <ReactCrop
              crop={crop ?? undefined}
              onChange={(_px, percent) => setCrop(percent)}
              onComplete={(px) => setCompletedCrop(px)}
              aspect={aspect || undefined}
              keepSelection
              ruleOfThirds
              className="max-h-[60vh]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={url}
                alt=""
                onLoad={onImageLoad}
                className="max-h-[60vh] w-auto select-none"
              />
            </ReactCrop>
          )}
        </div>

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
            disabled={busy || !completedCrop?.width}
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
