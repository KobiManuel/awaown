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
 */
export function useHomepageContent() {
  const { data, isLoading } = useGetHomepageContentQuery();
  return {
    content: { ...homepageContentDefaults, ...(data?.content ?? {}) },
    visibility: { ...sectionVisibilityDefaults, ...(data?.sectionVisibility ?? {}) },
    community: { ...communitySectionDefaults, ...(data?.community ?? {}) },
    isLoading,
  };
}
