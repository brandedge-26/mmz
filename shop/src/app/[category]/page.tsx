import { notFound } from "next/navigation";
import CategoryListing from "@/components/CategoryListing";

// Maps URL slug → API category name
const CATEGORY_MAP: Record<string, string> = {
  "cases":             "Cases",
  "screen-protection": "Screen Protection",
  "power-charging":    "Power & Charging",
  "audio":             "Audio",
  "accessories":       "Accessories",
  "panels":            "Panels",
};

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({ category: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const categoryName = CATEGORY_MAP[slug];
  if (!categoryName) return { title: "Not Found" };
  return {
    title: `${categoryName} | MMZ Store`,
    description: `Shop the best ${categoryName} products at MMZ Store.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const categoryName = CATEGORY_MAP[slug];
  if (!categoryName) notFound();

  return <CategoryListing category={categoryName} categorySlug={slug} />;
}
