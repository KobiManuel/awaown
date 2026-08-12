import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const alt = "AwaOwn — Shop. Sell. Earn.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoPath = path.join(process.cwd(), "public/v2/images/awa-logo-white.png");
  const logoData = fs.readFileSync(logoPath).toString("base64");
  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(135deg, #6D28D9 0%, #5B21B6 45%, #1a0a33 100%)",
          padding: 80,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 480,
            height: 480,
            borderRadius: 480,
            background: "rgba(196, 181, 253, 0.3)",
            filter: "blur(0px)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            right: -100,
            width: 520,
            height: 520,
            borderRadius: 520,
            background: "rgba(233, 213, 255, 0.2)",
            display: "flex",
          }}
        />

        <img
          src={logoSrc}
          width={440}
          height={124}
          style={{ objectFit: "contain", display: "flex" }}
        />

        <div
          style={{
            marginTop: 44,
            fontSize: 56,
            fontWeight: 700,
            color: "white",
            display: "flex",
          }}
        >
          Shop. Sell. Earn.
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            color: "rgba(255,255,255,0.75)",
            maxWidth: 820,
            textAlign: "center",
            display: "flex",
          }}
        >
          Nigeria&apos;s trusted marketplace, verified merchants, transparent
          pricing, real earnings.
        </div>
      </div>
    ),
    { ...size }
  );
}
