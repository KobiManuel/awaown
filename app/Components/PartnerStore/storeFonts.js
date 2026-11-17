import {
  Bai_Jamjuree,
  Poppins,
  Inter,
  Playfair_Display,
  Lato,
  Space_Grotesk,
  Work_Sans,
  Montserrat,
  Manrope,
  Sora,
  Outfit,
  Cormorant_Garamond,
  Merriweather,
  Bebas_Neue,
  Josefin_Sans,
  DM_Sans,
  Caveat,
} from "next/font/google";

// Self-hosted via next/font (built at compile time). Avoids the runtime
// cdnfonts loading issue the main site's Bai Jamjuree import hit. Isolated to
// the partner storefront only; does not affect the rest of the app.
//
// Every font below requests exactly one weight. Turbopack's Google Fonts
// resolver intermittently fails to build any font requested with 2+ weights
// ("next/font/google queries have exactly one entry") - first hit Montserrat
// and Merriweather, then moved to Caveat, then Cormorant_Garamond and Outfit
// on the next build with none of those three touched. It's a race, not
// specific to any one font, so fixing it font-by-font as it recurs was never
// going to hold - every font here is single-weight so the trigger condition
// (a multi-weight query) never occurs. This matches how each font is already
// used: heading fonts render font-bold (700) on the storefront page (and
// font-semibold in the customize-page preview - a weight it has no file for,
// so the preview renders the same bold face there too), body fonts render at
// normal weight (400) with no override. "brand" (Bai Jamjuree) is the one
// font used as both heading and body, so it's split into two single-weight
// instances the same way Merriweather already was.
const brandHeading = Bai_Jamjuree({ subsets: ["latin"], weight: "700" });
const brandBody = Bai_Jamjuree({ subsets: ["latin"], weight: "400" });
const poppins = Poppins({ subsets: ["latin"], weight: "700" });
const inter = Inter({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: "700" });
const lato = Lato({ subsets: ["latin"], weight: "400" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: "700" });
const workSans = Work_Sans({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], weight: "700" });
const manrope = Manrope({ subsets: ["latin"], weight: "400" });
const sora = Sora({ subsets: ["latin"], weight: "700" });
const outfit = Outfit({ subsets: ["latin"], weight: "700" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: "700" });
const merriweatherBody = Merriweather({ subsets: ["latin"], weight: "400" });
const merriweatherHeading = Merriweather({ subsets: ["latin"], weight: "700" });
const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const josefinSans = Josefin_Sans({ subsets: ["latin"], weight: "700" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: "400" });
const caveat = Caveat({ subsets: ["latin"], weight: "700" });

export const STORE_FONT_FAMILIES = {
  brandHeading,
  brandBody,
  poppins,
  inter,
  playfair,
  lato,
  spaceGrotesk,
  workSans,
  montserrat,
  manrope,
  sora,
  outfit,
  cormorant,
  merriweatherBody,
  merriweatherHeading,
  bebasNeue,
  josefinSans,
  dmSans,
  caveat,
};
