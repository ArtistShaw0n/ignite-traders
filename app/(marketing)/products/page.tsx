import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { getCategoryOptions } from "@/lib/categories";
import { ProductsBrowser } from "./_browser";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Industrial supplies, PPE, and clean-room essentials — sourced and stocked for fast dispatch. Bulk pricing available on all products.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategoryOptions()]);
  return <ProductsBrowser products={products} categories={categories} />;
}
