import { useGetHomepageContentQuery } from "@/lib/api/storefrontApi";
import {
  homepageContentDefaults,
  sectionVisibilityDefaults,
  communitySectionDefaults,
} from "@/lib/admin-data";

/**
 * Live homepage content from the admin CMS (`/storefront/homepage`), deep-merged
 * onto the code defaults so a section the admin has never touched still renders
 * its original copy. Only overrides are stored server-side.
 *
 * The code defaults are deliberately low-priority: they're withheld entirely
 * while the request is in flight, so a section renders nothing (most sections
 * already return null on empty content/visibility) rather than flashing static
 * placeholder banners that then get swapped for the real ones a moment later.
 * Once the request settles, real data still wins wherever it exists and a
 * default only fills a gap the admin has never touched.
 */
export function useHomepageContent() {
  const { data, isLoading } = useGetHomepageContentQuery();
  if (isLoading) {
    return { content: {}, visibility: {}, community: {}, isLoading };
  }
  return {
    content: { ...homepageContentDefaults, ...(data?.content ?? {}) },
    visibility: { ...sectionVisibilityDefaults, ...(data?.sectionVisibility ?? {}) },
    community: { ...communitySectionDefaults, ...(data?.community ?? {}) },
    isLoading,
  };
}
