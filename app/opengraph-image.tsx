import { ImageResponse } from "next/og";

export const alt = "IGNITE Traders — Protective Wear for Pharmaceutical Production";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social-share card, generated at build time (no asset file needed).
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#0c2b2b",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "36px",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "18px",
            background: "#ef6b2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "44px",
            fontWeight: 800,
          }}
        >
          I
        </div>
        <div style={{ fontSize: "42px", fontWeight: 800, letterSpacing: "-1px" }}>
          IGNITE Traders
        </div>
      </div>
      <div
        style={{
          fontSize: "66px",
          fontWeight: 800,
          lineHeight: 1.1,
          maxWidth: "920px",
        }}
      >
        Protective Wear for Pharmaceutical Production
      </div>
      <div style={{ fontSize: "30px", color: "#b9cccc", marginTop: "30px" }}>
        Gowns · Gloves · Head & Shoe Covers · Safety Footwear · Goggles
      </div>
    </div>,
    { ...size },
  );
}
