import {
  Bai_Jamjuree,
  Poppins,
  Inter,
  Playfair_Display,
  Lato,
  Space_Grotesk,
  Work_Sans,
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

export const STORE_FONT_FAMILIES = {
  brand: baiJamjuree,
  poppins,
  inter,
  playfair,
  lato,
  spaceGrotesk,
  workSans,
};
