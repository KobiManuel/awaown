// Password policy — mirrors backend/src/common/password.util.ts. Keep in sync.
export const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { id: "upper", label: "One capital letter", test: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "number", label: "One number", test: (p) => /\d/.test(p) },
  {
    id: "symbol",
    label: "One symbol (! ? $ # …)",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

export function passwordOk(pw) {
  return typeof pw === "string" && PASSWORD_RULES.every((r) => r.test(pw));
}
