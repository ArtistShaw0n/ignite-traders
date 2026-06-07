import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// Branded favicon / app icon — "I" mark on brand orange.
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ef6b2a",
        color: "#ffffff",
        fontSize: 360,
        fontWeight: 800,
        fontFamily: "sans-serif",
      }}
    >
      I
    </div>,
    { ...size },
  );
}
