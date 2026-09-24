import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { baseApi, API_URL } from "./baseApi";
import { readImageAsCompressedDataURL, readFileAsDataURL } from "@/lib/file-utils";
import { errorMessage } from "./errorMessage";

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadMedia: build.mutation({
      query: ({ data, folder = "misc", resourceType }) => ({
        url: "/media/upload",
        method: "POST",
        body: { data, folder, resourceType },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useUploadMediaMutation } = mediaApi;

/**
 * Same request the uploadMedia mutation sends, but via XMLHttpRequest so
 * upload progress is observable - fetch() (what RTK Query's fetchBaseQuery
 * uses under the hood) has no upload-progress event at all.
 */
function uploadMediaWithProgress(body, accessToken, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/media/upload`);
    xhr.setRequestHeader("Content-Type", "application/json");
    if (accessToken) xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    xhr.withCredentials = true;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      let parsed = null;
      try {
        parsed = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300) resolve(parsed);
      else reject(new Error(parsed?.message || "Upload failed"));
    };
    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(JSON.stringify(body));
  });
}

/**
 * Pick-and-upload helper. Reads a File, uploads it to Cloudinary via the API,
 * and returns the hosted URL, replacing the old "stuff a base64 data-URI into
 * Redux" pattern. `folder` is one of products|digital-products|stores|kyc|
 * banners|campaigns|avatars.
 *
 *   const { upload, uploading, error } = useMediaUpload("stores");
 *   const url = await upload(file);
 *
 * Pass `onProgress` to get upload percentage as it happens (routes through
 * XMLHttpRequest instead of the RTK Query mutation, which can't report it).
 */
export function useMediaUpload(folder = "misc") {
  const [uploadMedia] = useUploadMediaMutation();
  const accessToken = useSelector((s) => s.auth.accessToken);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = useCallback(
    async (file, { image = true, onProgress } = {}) => {
      if (!file) return null;
      setError("");
      setUploading(true);
      try {
        const data = image
          ? await readImageAsCompressedDataURL(file)
          : await readFileAsDataURL(file);
        const body = { data, folder, resourceType: image ? "image" : "auto" };
        const res = onProgress
          ? await uploadMediaWithProgress(body, accessToken, onProgress)
          : await uploadMedia(body).unwrap();
        return res.url;
      } catch (err) {
        setError(errorMessage(err, "Upload failed"));
        return null;
      } finally {
        setUploading(false);
      }
    },
    [uploadMedia, folder, accessToken],
  );

  return { upload, uploading, error };
}
