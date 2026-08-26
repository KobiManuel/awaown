import { createSlice } from "@reduxjs/toolkit";
import {
  AUTOMATION_RULES_SEED,
  AUDIT_LOG_SEED,
  merchantsDirectory,
  partnersDirectory,
  complaintsSeed,
  refundsSeed,
  contentBanners,
  couponsSeed,
  teamMembersSeed,
  platformSettingsDefaults,
  emailCampaignsSeed,
  communitySectionDefaults,
  homepageContentDefaults,
} from "@/lib/admin-data";

const initialState = {
  automationRules: AUTOMATION_RULES_SEED,
  auditLog: AUDIT_LOG_SEED,
  merchants: merchantsDirectory,
  partners: partnersDirectory,
  complaints: complaintsSeed,
  refunds: refundsSeed,
  banners: contentBanners,
  coupons: couponsSeed,
  team: teamMembersSeed,
  settings: platformSettingsDefaults,
  emailCampaigns: emailCampaignsSeed,
  dashboardBanner: null,
  communitySection: communitySectionDefaults,
  homepageContent: homepageContentDefaults,
};

function logAction(state, action) {
  state.auditLog.unshift({
    id: `log-${Date.now()}`,
    admin: "Ada Nwosu",
    action,
    at: new Date().toISOString(),
  });
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    hydrateAdmin(state, action) {
      const payload = action.payload || {};
      if (payload.automationRules) state.automationRules = payload.automationRules;
      if (payload.auditLog) state.auditLog = payload.auditLog;
      if (payload.merchants) state.merchants = payload.merchants;
      if (payload.partners) state.partners = payload.partners;
      if (payload.complaints) state.complaints = payload.complaints;
      if (payload.refunds) state.refunds = payload.refunds;
      if (payload.banners) state.banners = payload.banners;
      if (payload.coupons) state.coupons = payload.coupons;
      if (payload.team) state.team = payload.team;
      if (payload.settings) state.settings = payload.settings;
      if (payload.emailCampaigns) state.emailCampaigns = payload.emailCampaigns;
      if (payload.dashboardBanner !== undefined) state.dashboardBanner = payload.dashboardBanner;
      if (payload.communitySection) state.communitySection = payload.communitySection;
      if (payload.homepageContent) state.homepageContent = payload.homepageContent;
    },
    toggleAutomationRule(state, action) {
      const rule = state.automationRules.find((r) => r.id === action.payload);
      if (rule) {
        rule.enabled = !rule.enabled;
        logAction(state, `${rule.enabled ? "Enabled" : "Disabled"} automation: "${rule.trigger} → ${rule.action}"`);
      }
    },
    setMerchantStatus(state, action) {
      const { id, status, reason } = action.payload;
      const merchant = state.merchants.find((m) => m.id === id);
      if (merchant) {
        merchant.status = status;
        merchant.statusReason = reason || null;
        logAction(state, `Set merchant "${merchant.storeName}" status to ${status}${reason ? ` — ${reason}` : ""}`);
      }
    },
    setMerchantVerification(state, action) {
      const { id, verification } = action.payload;
      const merchant = state.merchants.find((m) => m.id === id);
      if (merchant) {
        merchant.verification = verification;
        logAction(state, `${verification === "verified" ? "Approved" : "Rejected"} verification for merchant "${merchant.storeName}"`);
      }
    },
    setPartnerStatus(state, action) {
      const { id, status, reason } = action.payload;
      const partner = state.partners.find((p) => p.id === id);
      if (partner) {
        partner.status = status;
        partner.statusReason = reason || null;
        logAction(state, `Set partner "${partner.name}" status to ${status}${reason ? ` — ${reason}` : ""}`);
      }
    },
    setPartnerVerification(state, action) {
      const { id, verification } = action.payload;
      const partner = state.partners.find((p) => p.id === id);
      if (partner) {
        partner.verification = verification;
        logAction(state, `${verification === "verified" ? "Approved" : "Rejected"} verification for partner "${partner.name}"`);
      }
    },
    resolveComplaint(state, action) {
      const complaint = state.complaints.find((c) => c.id === action.payload);
      if (complaint) {
        complaint.status = "resolved";
        logAction(state, `Resolved complaint from ${complaint.customer} (${complaint.order})`);
      }
    },
    setRefundStatus(state, action) {
      const { id, status } = action.payload;
      const refund = state.refunds.find((r) => r.id === id);
      if (refund) {
        refund.status = status;
        logAction(state, `${status === "approved" ? "Approved" : "Rejected"} refund for ${refund.order}`);
      }
    },
    toggleBannerStatus(state, action) {
      const banner = state.banners.find((b) => b.id === action.payload);
      if (banner) {
        banner.status = banner.status === "live" ? "draft" : "live";
        logAction(state, `Set banner "${banner.title}" to ${banner.status}`);
      }
    },
    addBanner(state, action) {
      state.banners.unshift(action.payload);
      logAction(state, `Created banner "${action.payload.title}"`);
    },
    updateBanner(state, action) {
      const { id, changes } = action.payload;
      const banner = state.banners.find((b) => b.id === id);
      if (banner) {
        Object.assign(banner, changes);
        logAction(state, `Updated banner "${banner.title}"`);
      }
    },
    removeBanner(state, action) {
      const banner = state.banners.find((b) => b.id === action.payload);
      state.banners = state.banners.filter((b) => b.id !== action.payload);
      if (banner) logAction(state, `Removed banner "${banner.title}"`);
    },
    saveCommunitySection(state, action) {
      state.communitySection = action.payload;
      logAction(state, "Updated homepage Community section");
    },
    saveHomepageContent(state, action) {
      state.homepageContent = action.payload;
      logAction(state, "Updated homepage content");
    },
    toggleCouponStatus(state, action) {
      const coupon = state.coupons.find((c) => c.id === action.payload);
      if (coupon && coupon.status !== "expired") {
        coupon.status = coupon.status === "active" ? "scheduled" : "active";
        logAction(state, `Set coupon "${coupon.code}" to ${coupon.status}`);
      }
    },
    addCoupon(state, action) {
      state.coupons.unshift(action.payload);
      logAction(state, `Created coupon "${action.payload.code}"`);
    },
    setTeamMemberRole(state, action) {
      const { id, role } = action.payload;
      const member = state.team.find((t) => t.id === id);
      if (member) {
        member.role = role;
        logAction(state, `Changed ${member.name}'s access level to ${role}`);
      }
    },
    updateSettings(state, action) {
      state.settings = { ...state.settings, ...action.payload };
      logAction(state, "Updated platform settings");
    },
    sendEmailCampaign(state, action) {
      state.emailCampaigns.unshift(action.payload);
      logAction(state, `Sent email campaign "${action.payload.subject}" to ${action.payload.recipientCount} recipient${action.payload.recipientCount === 1 ? "" : "s"}`);
    },
    setDashboardBanner(state, action) {
      state.dashboardBanner = action.payload;
      logAction(state, "Updated admin dashboard banner");
    },
  },
});

export const {
  hydrateAdmin,
  toggleAutomationRule,
  setMerchantStatus,
  setMerchantVerification,
  setPartnerStatus,
  setPartnerVerification,
  resolveComplaint,
  setRefundStatus,
  toggleBannerStatus,
  addBanner,
  updateBanner,
  removeBanner,
  saveCommunitySection,
  saveHomepageContent,
  toggleCouponStatus,
  addCoupon,
  setTeamMemberRole,
  updateSettings,
  sendEmailCampaign,
  setDashboardBanner,
} = adminSlice.actions;
export default adminSlice.reducer;
