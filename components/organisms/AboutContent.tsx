import { AboutBlock } from "@/components/molecules/AboutBlock";
import { clsx } from "@/lib/clsx";

export interface AboutContentBlock {
  heading: string;
  body: React.ReactNode;
}

export interface AboutContentProps {
  blocks: AboutContentBlock[];
  className?: string;
}

export function AboutContent({ blocks, className }: AboutContentProps) {
  return (
    <section className={clsx("section-pad-sm", className)}>
      <div className="container-site">
        <div className="space-y-8 max-w-4xl">
          {blocks.map((b, i) => (
            <AboutBlock key={i} heading={b.heading} body={b.body} />
          ))}
        </div>
      </div>
    </section>
  );
}
