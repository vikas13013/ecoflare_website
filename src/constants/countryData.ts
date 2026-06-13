import { ReactNode } from "react";

export interface CountryCodeOption {
  value: string;
  code: string;
  label: string; // Using simple string
}

const countryCodes: CountryCodeOption[] = [
  { value: "+1", code: "CA", label: "🇨🇦 +1" },
  { value: "+91", code: "IN", label: "🇮🇳 +91" },
  { value: "+971", code: "AE", label: "🇦🇪 +971" },
  { value: "+1", code: "US", label: "🇺🇸 +1" },
];

export default countryCodes;
