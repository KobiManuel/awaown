"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "@/lib/api/baseApi";

/**
 * Downloads a purchased digital product with real progress, not just a bare
 * browser link. Two steps: ask the backend for a fresh, short-lived signed
 * Cloudinary URL for this one order item (auth'd for a signed-in customer,
 * phone-verified for a guest), then stream that file with `fetch()` so we
 * can report bytes-received against Content-Length - a plain <a href> to a
 * remote URL gives the browser no hook to show progress at all.
 */
export function useDigitalDownload() {
  const accessToken = useSelector((s) => s.auth.accessToken);
  const [progress, setProgress] = useState(null); // 0-100 while active, else null
  const [downloadingId, setDownloadingId] = useState(null);

  const download = async (infoPath, { auth = true, itemId } = {}) => {
    setDownloadingId(itemId ?? infoPath);
    setProgress(0);
    try {
      const infoRes = await fetch(`${API_URL}${infoPath}`, {
        credentials: "include",
        headers:
          auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      if (!infoRes.ok) {
        const body = await infoRes.json().catch(() => null);
        throw new Error(body?.message || "Could not prepare the download");
      }
      const { url, title } = await infoRes.json();

      const fileRes = await fetch(url);
      if (!fileRes.ok || !fileRes.body) throw new Error("Download failed");
      const total = Number(fileRes.headers.get("content-length")) || 0;
      const reader = fileRes.body.getReader();
      const chunks = [];
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total) setProgress(Math.round((received / total) * 100));
      }

      const blob = new Blob(chunks);
      const ext = url.split("?")[0].split(".").pop();
      const filename =
        ext && ext.length <= 6 ? `${title || "download"}.${ext}` : title || "download";
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err?.message || "Download failed" };
    } finally {
      setProgress(null);
      setDownloadingId(null);
    }
  };

  return { download, progress, downloadingId };
}
