import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ignitetradersbd.com";

// Staging/preview deployments set NOINDEX=1 to keep the whole site out of search
// until the real launch (so the staging URL isn't indexed and there's no later
// duplicate-content problem). Remove NOINDEX at apex launch to re-enable crawling.
const NOINDEX = process.env.NOINDEX === "1";

export default function robots(): MetadataRoute.Robots {
  if (NOINDEX) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/design-system", "/preview/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
