import type { Metadata } from "next";
import { AboutContent, PageHeader } from "@/components/organisms";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "A Dhaka-based B2B supplier of protective wear and safety items, focused on the consistent, reliable supply that pharmaceutical production needs.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About IGNITE"
        description="A Dhaka-based B2B supplier of protective wear and safety items, focused on the consistent, reliable supply that pharmaceutical production needs."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />
      <AboutContent
        blocks={[
          {
            heading: "Who we are",
            body: "IGNITE Traders is a Dhaka-based B2B supplier built specifically for the procurement needs of pharmaceutical production lines, packaging facilities, food processing units, and clinical laboratories. [TODO replace verbatim]",
          },
          {
            heading: "What we focus on",
            body: "Hygiene-sensitive supply chains where consistency, batch quality, and predictable lead times matter more than retail-style variety. We stock the working-line essentials — gowns, head and shoe covers, gloves, safety footwear, goggles and masks — in volumes tuned to recurring B2B demand. [TODO replace verbatim]",
          },
          {
            heading: "Industry specialisation",
            body: "Our customer base is concentrated in pharmaceutical manufacturing and adjacent production environments. That focus shapes our material choices (non-woven polypropylene, SMS, nitrile, polycarbonate) and how we screen upstream suppliers. [TODO replace verbatim]",
          },
          {
            heading: "Commitment to quality and timely delivery",
            body: "Every batch is checked against documented specs before dispatch. We invest in predictability over breadth — if a SKU is in our catalogue, we keep enough stock to fulfil repeat orders without surprises. [TODO replace verbatim]",
          },
          {
            heading: "Our values",
            body: "Direct human communication, transparent quoting, and lead times you can plan around. We do not chase retail customers and we do not bid for one-off contracts that we cannot sustain. [TODO replace verbatim]",
          },
        ]}
      />
    </>
  );
}
