import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { ProductsBrowser } from "./_browser";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Industrial supplies, PPE, and clean-room essentials — sourced and stocked for fast dispatch. Bulk pricing available on all products.",
};

export default function ProductsPage() {
  const products = getAllProducts();
  return <ProductsBrowser products={products} />;
}
