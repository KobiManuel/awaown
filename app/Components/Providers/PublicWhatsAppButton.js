"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { WHATSAPP_URL } from "@/lib/site-config";

// Same set of routes PublicCommerceGate excludes - dashboards, auth flows and
// checkout-adjacent screens shouldn't get a floating chat bubble competing
// for attention.
const EXCLUDED = [
  "/dashboard",
  "/merchant",
  "/partner",
  "/admin",
  "/login",
  "/signup",
  "/onboarding",
  "/maintenance",
];

export default function PublicWhatsAppButton() {
  const pathname = usePathname() || "/";
  const excluded = EXCLUDED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (excluded) return null;

  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with AwaOwn on WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" />
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" className="relative">
        <path d="M16.02 2.667c-7.36 0-13.334 5.973-13.334 13.333 0 2.351.616 4.66 1.788 6.688L2.667 29.333l6.79-1.78a13.28 13.28 0 0 0 6.56 1.72h.006c7.36 0 13.333-5.973 13.333-13.333 0-3.56-1.386-6.907-3.903-9.424a13.24 13.24 0 0 0-9.427-3.849Zm0 24.4h-.005a11.06 11.06 0 0 1-5.636-1.542l-.404-.24-4.03 1.057 1.076-3.928-.263-.403a11.05 11.05 0 0 1-1.7-5.91c0-6.11 4.973-11.083 11.088-11.083 2.96 0 5.744 1.154 7.837 3.25a11.01 11.01 0 0 1 3.245 7.839c-.003 6.11-4.976 11.06-11.208 11.06Zm6.076-8.288c-.333-.167-1.966-.97-2.27-1.081-.305-.111-.527-.167-.749.167-.222.333-.86 1.08-1.054 1.303-.194.222-.388.25-.72.083-.334-.167-1.409-.519-2.684-1.652-.992-.885-1.663-1.978-1.858-2.311-.194-.334-.021-.514.146-.68.15-.15.334-.389.5-.583.167-.194.222-.333.334-.555.111-.223.055-.417-.028-.584-.083-.166-.749-1.804-1.026-2.472-.27-.65-.545-.563-.75-.573l-.638-.011c-.222 0-.583.083-.888.417-.305.333-1.165 1.138-1.165 2.777 0 1.638 1.192 3.222 1.359 3.444.167.223 2.347 3.584 5.685 5.026.795.343 1.415.548 1.898.702.797.254 1.523.218 2.097.132.64-.095 1.966-.804 2.243-1.581.278-.777.278-1.443.194-1.582-.083-.138-.305-.222-.639-.389Z" />
      </svg>
    </motion.a>
  );
}
