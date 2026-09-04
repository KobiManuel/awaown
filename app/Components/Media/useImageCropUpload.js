"use client";

import React, { useCallback, useRef, useState } from "react";
import { useMediaUpload } from "@/lib/api/mediaApi";
import ImageCropModal from "./ImageCropModal";

/**
 * Pick an image, position/crop it to a fixed aspect, then upload the result.
 *
 *   const { pickAndCrop, uploading, modal } = useImageCropUpload("products");
 *   // in an <input type=file> onChange:
 *   const url = await pickAndCrop(file, { aspect: 1 });
 *   // render {modal} once anywhere in the component
 */
export function useImageCropUpload(folder = "misc") {
  const { upload, uploading } = useMediaUpload(folder);
  const [pending, setPending] = useState(null); // { file, aspect, title }
  const resolverRef = useRef(null);

  const pickAndCrop = useCallback((file, { aspect = 1, title } = {}) => {
    if (!file) return Promise.resolve(null);
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setPending({ file, aspect, title });
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
