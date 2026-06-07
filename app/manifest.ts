import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IGNITE Traders",
    short_name: "IGNITE",
    description: "Protective wear & safety supply for pharmaceutical production units.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c2b2b",
    theme_color: "#ef6b2a",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
