import { ProductGallery, type ProductGalleryImage } from "./ProductGallery";
import { ProductInfoCard, type ProductInfoCardProps } from "./ProductInfoCard";
import { clsx } from "@/lib/clsx";

export interface ProductDetailHeroProps extends Omit<ProductInfoCardProps, "className"> {
  images?: ProductGalleryImage[];
  className?: string;
}

export function ProductDetailHero({ images, className, ...infoProps }: ProductDetailHeroProps) {
  return (
    <section className={clsx("section-pad-sm", className)}>
      <div className="container-site">
        {/*
          lg:items-start prevents the default CSS Grid `align-items: stretch`.
          Without it, the right card's bg stretches to match the taller gallery
          column (main image + thumbnails), creating empty bg below content.
          Each column now sizes to its own content.
        */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 lg:items-start">
          <ProductGallery images={images} />
          <ProductInfoCard {...infoProps} />
        </div>
      </div>
    </section>
  );
}
