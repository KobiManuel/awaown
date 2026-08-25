// Reads a File into a base64 data URL so it can be stored directly in Redux
// state (and therefore localStorage) without needing a real upload backend.
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MAX_IMAGE_DIMENSION = 1600;
const IMAGE_QUALITY = 0.82;

// Downscales + re-encodes photo uploads before they're stored as a base64 data
// URL — localStorage has a hard ~5-10MB-per-origin quota shared across the whole
// app (cart, orders, every product photo, every banner/logo, etc.), and a single
// uncompressed phone photo (often 4-8MB) can blow past what's left on its own.
// When that happens, `localStorage.setItem` throws and the write is silently
// lost — the change looks like it worked (Redux state updated in memory) until
// the next refresh, when the stale pre-change value comes back. Keeping every
// stored image under ~1600px/JPEG-82% avoids that in the vast majority of cases.
// Only applies to raster image/* files — SVGs pass through unchanged (canvas
// re-encoding would rasterize them), and this is not used for video/other
// uploads at all (see call sites in the product-upload pages).
export function readImageAsCompressedDataURL(file, maxDimension = MAX_IMAGE_DIMENSION, quality = IMAGE_QUALITY) {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return readFileAsDataURL(file);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        const scale = maxDimension / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Fall back to the uncompressed read rather than failing the upload outright.
      readFileAsDataURL(file).then(resolve, reject);
    };
    img.src = objectUrl;
  });
}
