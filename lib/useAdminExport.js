"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "@/lib/api/baseApi";

/**
 * Downloads an admin CSV export (merchants/partners/customers). Not an RTK
 * Query endpoint - the response is a file, not JSON, and the export needs
 * the same Bearer access token every other admin request carries (it lives
 * in memory, not a cookie, so a plain <a href> download link wouldn't be
 * authenticated).
 */
export function useAdminExport(path, filenamePrefix) {
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useSelector((s) => s.auth.accessToken);

  const download = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}${path}`, {
        credentials: "include",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { download, isLoading };
}
