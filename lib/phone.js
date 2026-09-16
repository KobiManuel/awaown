// Nigerian mobile numbers: 11 digits local (0XXXXXXXXXX), or the same 10
// digits after the country code - 234XXXXXXXXXX / +234XXXXXXXXXX. Whichever
// form someone types, there must be exactly 10 digits after the leading 0
// or 234, and that first of the 10 must be a real GSM prefix digit (7, 8 or
// 9 - no Nigerian mobile number starts with anything else).
export function isValidNigerianPhone(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  let local;
  if (digits.startsWith("234") && digits.length === 13) {
    local = digits.slice(3);
  } else if (digits.startsWith("0") && digits.length === 11) {
    local = digits.slice(1);
  } else {
    return false;
  }
  return /^[789]\d{9}$/.test(local);
}

/** Local 11-digit form (0XXXXXXXXXX) - what's stored/displayed everywhere. */
export function normalizeNigerianPhone(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.startsWith("234") && digits.length === 13) return `0${digits.slice(3)}`;
  if (digits.startsWith("0") && digits.length === 11) return digits;
  return digits;
}
