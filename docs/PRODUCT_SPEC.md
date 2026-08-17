# AwaOwn Product Spec (from project owner)

This is the source-of-truth brief for AwaOwn as a full marketplace platform, beyond the
homepage clone. Read this before building any account/dashboard/merchant/affiliate/admin
functionality.

## 1. Product Vision
Nigeria's most trusted social-commerce marketplace where customers shop confidently,
merchants grow their businesses, and affiliates earn through authentic recommendations.

## 2. Product Objectives
- Trust-first shopping
- Secure escrow payments
- Simple merchant onboarding
- Powerful affiliate ecosystem (**affiliates are now called "Partners"**)
- Fast, mobile-first experience

## 3. User Types
Customer, Merchant, Affiliate (**"Partner"**), Admin.

## 4. Core Product Modules
Marketplace, Merchant Stores, Affiliate Hub, Wallet, Escrow, Orders, Checkout, Search,
Notifications, Customer Support.

## 5. Customer Journey
Discover → Browse → Product → Cart → Checkout → Payment → Escrow → Delivery → Review.

## 6. Merchant Journey
Register → Verify → Create Store → Upload Products → Receive Orders → Fulfil → Payout.

## 7. Affiliate ("Partner") Journey
Register → Verify → Dashboard → Get Referral Link → Share → Earn Commission → Withdraw.

## 8. Website Structure
Home, Shop, Categories, Merchant Stores, Become a Merchant, Become an Affiliate, Help
Centre, Dashboard, Wallet, Orders, Notifications, Settings.

## 9. Core Features
Wishlist, Wallet, Order Tracking, Reviews, Merchant Analytics, Affiliate Dashboard,
Commission Tracking, Escrow Protection, Search, Notifications.

## 10. Business Rules
- Escrow holds funds until successful delivery.
- Only verified merchants receive payouts.
- Only verified affiliates ("Partners") withdraw commissions.
- Refund requests pause escrow release.

## 11. Notification System
Real-time notifications for customers, merchants, affiliates and admins covering orders,
payments, verification, withdrawals, refunds and support.

## 12. Marketing & Communication
Built-in campaign management, coupon creation, promotional banners, push notifications,
email broadcasts and SMS broadcasts directly from the admin panel — reducing dependence
on third-party email marketing tools for standard campaigns.

## 13. AI & Customer Support
Integrated AI assistant capable of answering common questions, guiding users through the
platform, and seamlessly handing conversations over to a live customer support agent when
human intervention is required.

## 14. Future Roadmap
Loyalty programme, AI product recommendations, live chat, merchant subscriptions,
advanced analytics, mobile apps.

## Product Principles
Trust First · Mobile First · Simple User Experience · Transparent Transactions ·
Fast Performance · Empower Customers, Merchants and Affiliates · Build for Scale.

## Integrations
Payment Gateway, Shipping Partners, Email, SMS, AI Customer Assistant, Analytics.

---

## Admin Panel

Responsibilities:
1. Real-time platform overview, most important information surfaced first.
2. Manage the complete order lifecycle: payment status, escrow, delivery, refunds,
   customer issues.
3. Manage merchant onboarding, verification, performance, payouts, products, account
   status.
4. Manage affiliate ("Partner") onboarding, verification, commissions/profit, withdrawals,
   referrals, performance.
5. View customer profiles, orders, complaints, support history, reviews, wallets.
6. Manage products, inventory, approvals, categories, featured products, product status.
7. Monitor escrow, payouts, commissions, refunds, revenue, financial reports.
8. Manage homepage content, banners, FAQs, announcements, categories, blogs, static
   pages.
9. Create coupons, campaigns, flash sales, email broadcasts, SMS notifications, push
   notifications.
10. Generate reports: sales, merchants, affiliates, customers, products, business
    performance.
11. Control access levels: Super Admin, Operations, Finance, Marketing, Support, Content
    teams.
12. Configure platform settings: payment gateways, shipping, notifications, security,
    integrations, system preferences.
13. Maintain a complete audit log of administrative actions.

### Admin Dashboard Widgets
All widgets: clean, modern, clickable cards/widgets, minimal clutter, intuitive
navigation.

- **Action Required** — top-priority clickable cards: pending verifications,
  withdrawals, refunds, complaints, failed payments, escrow releases.
- **Business Overview** — KPI cards: Revenue Today, Orders Today, Customers, Merchants,
  Affiliates, Escrow Balance.
- **Global Search** — universal search: orders, customers, merchants, affiliates,
  products, emails, phone numbers, tracking IDs.
- **Notifications** — verification requests, withdrawals, refunds, payment failures,
  critical alerts.
- **Recent Activity** — live timeline of platform activities with timestamps.
- **Platform Health** — status cards for Website, Payment Gateway, Escrow, Email/SMS,
  Integrations — green/amber/red indicators.
- **Today's Snapshot** — today's revenue, orders, new customers, merchants, affiliates.
- **Campaign Calendar** — upcoming campaigns, coupon expiry dates, scheduled promotions.
- **Automation Center** — no-code trigger→action automations instead of manual staff
  work, e.g.:
  - Merchant verified → send welcome email automatically.
  - Affiliate ("Partner") joins → send onboarding resources automatically.
  - Order delivered → ask customer for a review.
  - Withdrawal approved → notify user instantly.
  - Cart abandoned → send reminder after a few hours.

---

## Features To Be Explored (AwaOwn-specific)

- When an order is placed, the vendor must confirm it's ready for pickup. AwaOwn's own
  orders (and any readily-available products) can skip this and auto-confirm.
- Vendors don't distinguish between simple, variable, and group products — the merchant
  UX needs to make this distinction easy/obvious.
- Processing-time / agentic AI or bot to communicate delivery timelines and status to
  shoppers.
- When uploading a product, vendor can toggle "back in stock" notifications. When a
  product is out of stock, customers can opt in to an email notification for when it's
  back in stock.
- A vendor can toggle "offer commission" per product. **Only products with commission
  enabled appear in the add-product list for Partners.**
- **Terminology change — no more "affiliate"/"commission":**
  - "Affiliates" → **"Partners"**
  - They "earn commission" → they **"make profit from reselling"**
  - Example: Public/Customer Price: ₦30,000 · Partner Discount: ₦25,500 · Partner Profit:
    ₦4,500
  - Apply this terminology everywhere on the new website.
- Email "letters" on the platform, with delegated send access.
- Merchant/vendor can choose whether to show stock count publicly (hide-stock feature).

---

## Current Build Scope

Per the project owner, **only the customer dashboard + customer flow is being built for
now** (not merchant, affiliate/partner, or admin panels — those come later but should
follow this same terminology and business-rule set when built).

The customer dashboard/app is **mobile-first and app-like**: its own `layout.tsx` with
app-style bottom tab navigation, distinct from the marketing site's desktop-first layout.
Design inspiration lives at `public/images/landing-banner-01.png` and
`landing-banner-02.png` (layout/UX reference only — actual colors follow the AwaOwn brand
purple `#6D28D9` + Bai Jamjuree, not the green shown in those references).
