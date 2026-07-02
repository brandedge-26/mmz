import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";
import type { ShopProduct } from "@/lib/products";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5510";

async function fetchProduct(slug: string): Promise<ShopProduct | null> {
  try {
    const res = await fetch(`${API}/api/products/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const p = json.data;
    return {
      id:            p._id,
      slug:          p.slug,
      name:          p.name,
      brand:         p.brand ?? "",
      category:      p.category,
      price:         p.price,
      originalPrice: p.originalPrice ?? undefined,
      image:         p.image ?? "",
      variantImages: p.variantImages ?? [],
      badge:         p.badge || undefined,
      inStock:       p.inStock,
      colors:        p.colors ?? [],
      description:   p.description ?? "",
      features:      p.features ?? [],
      specifications: (p.specifications ?? []).map((s: { key: string; value: string }) => ({
        key:   s.key,
        value: s.value,
      })),
      rating:  p.rating ?? 0,
      reviews: p.reviews ?? 0,
    };
  } catch {
    return null;
  }
}

async function fetchRelated(category: string, excludeSlug: string): Promise<ShopProduct[]> {
  try {
    const res = await fetch(
      `${API}/api/products?status=Active&category=${encodeURIComponent(category)}&limit=4`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const list: ShopProduct[] = (json.products ?? [])
      .filter((p: { slug: string }) => p.slug !== excludeSlug)
      .slice(0, 4)
      .map((p: {
        _id: string; slug: string; name: string; brand: string; category: string;
        price: number; originalPrice?: number; image: string; variantImages?: string[];
        badge?: string; inStock: boolean; colors?: string[]; rating: number; reviews: number;
      }) => ({
        id:            p._id,
        slug:          p.slug,
        name:          p.name,
        brand:         p.brand ?? "",
        category:      p.category,
        price:         p.price,
        originalPrice: p.originalPrice ?? undefined,
        image:         p.image ?? "",
        variantImages: p.variantImages ?? [],
        badge:         p.badge || undefined,
        inStock:       p.inStock,
        colors:        p.colors ?? [],
        rating:        p.rating ?? 0,
        reviews:       p.reviews ?? 0,
      }));
    return list;
  } catch {
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) notFound();
  const related = await fetchRelated(product.category, slug);
  return <ProductDetail product={product} related={related} />;
}
