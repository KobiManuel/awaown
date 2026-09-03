import { useCallback, useState } from "react";
import { baseApi } from "./baseApi";
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
 * Pick-and-upload helper. Reads a File, uploads it to Cloudinary via the API,
 * and returns the hosted URL — replacing the old "stuff a base64 data-URI into
 * Redux" pattern. `folder` is one of products|stores|kyc|banners|campaigns|avatars.
 *
 *   const { upload, uploading, error } = useMediaUpload("stores");
 *   const url = await upload(file);
 */
export function useMediaUpload(folder = "misc") {
  const [uploadMedia] = useUploadMediaMutation();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = useCallback(
    async (file, { image = true } = {}) => {
      if (!file) return null;
      setError("");
      setUploading(true);
      try {
        const data = image
          ? await readImageAsCompressedDataURL(file)
          : await readFileAsDataURL(file);
        const res = await uploadMedia({
          data,
          folder,
          resourceType: image ? "image" : "auto",
        }).unwrap();
        return res.url;
      } catch (err) {
        setError(errorMessage(err, "Upload failed"));
        return null;
      } finally {
        setUploading(false);
      }
    },
    [uploadMedia, folder],
  );

  return { upload, uploading, error };
}
