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
    },
    toggleAutomationRule(state, action) {
      const rule = state.automationRules.find((r) => r.id === action.payload);
      if (rule) {
        rule.enabled = !rule.enabled;
        logAction(state, `${rule.enabled ? "Enabled" : "Disabled"} automation: "${rule.trigger} → ${rule.action}"`);
      }
    },
    setMerchantStatus(state, action) {
      const { id, status } = action.payload;
      const merchant = state.merchants.find((m) => m.id === id);
      if (merchant) {
        merchant.status = status;
        logAction(state, `Set merchant "${merchant.storeName}" status to ${status}`);
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
      const { id, status } = action.payload;
      const partner = state.partners.find((p) => p.id === id);
      if (partner) {
        partner.status = status;
        logAction(state, `Set partner "${partner.name}" status to ${status}`);
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
  toggleCouponStatus,
  addCoupon,
  setTeamMemberRole,
  updateSettings,
  sendEmailCampaign,
} = adminSlice.actions;
export default adminSlice.reducer;
