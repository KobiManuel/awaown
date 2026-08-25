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

// Self-hosted via next/font (built at compile time) — avoids the runtime
// cdnfonts loading issue the main site's Bai Jamjuree import hit. Isolated to
// the partner storefront only; does not affect the rest of the app.
const baiJamjuree = Bai_Jamjuree({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"] });
const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700"] });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500"] });
const sora = Sora({ subsets: ["latin"], weight: ["600", "700"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["500", "600"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["600", "700"] });
const merriweather = Merriweather({ subsets: ["latin"], weight: ["400", "700"] });
const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });
const josefinSans = Josefin_Sans({ subsets: ["latin"], weight: ["500", "600"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });
const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"] });

export const STORE_FONT_FAMILIES = {
  brand: baiJamjuree,
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
  merriweather,
  bebasNeue,
  josefinSans,
  dmSans,
  caveat,
};
