"use client";

import React, { useCallback, useRef, useState } from "react";
import { useMediaUpload } from "@/lib/api/mediaApi";
import ImageCropModal from "./ImageCropModal";

/**
 * Pick an image, crop it with the photo-editor tool, then upload the result.
 *
 *   const { pickAndCrop, uploading, modal } = useImageCropUpload("products");
 *   // in an <input type=file> onChange:
 *   const url = await pickAndCrop(file, { aspect: 1 });   // locked square
 *   const url = await pickAndCrop(file);                  // free crop, any shape
 *   // render {modal} once anywhere in the component
 */
export function useImageCropUpload(folder = "misc") {
  const { upload, uploading } = useMediaUpload(folder);
  const [pending, setPending] = useState(null); // { file, aspect, title }
  const resolverRef = useRef(null);

  // `aspect` is optional - omit it (or pass null) for a completely free crop.
  const pickAndCrop = useCallback((file, { aspect, title } = {}) => {
    if (!file) return Promise.resolve(null);
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setPending({ file, aspect: aspect || undefined, title });
    });
  }, []);

  const settle = (value) => {
    const r = resolverRef.current;
    resolverRef.current = null;
    setPending(null);
    r?.(value);
  };

  const onCropped = async (blob) => {
    setPending(null);
    const url = blob ? await upload(blob) : null;
    const r = resolverRef.current;
    resolverRef.current = null;
    r?.(url || null);
  };

  const modal = pending ? (
    <ImageCropModal
      file={pending.file}
      aspect={pending.aspect}
      title={pending.title}
      onCancel={() => settle(null)}
      onCropped={onCropped}
    />
  ) : null;

  return { pickAndCrop, uploading, modal };
}
