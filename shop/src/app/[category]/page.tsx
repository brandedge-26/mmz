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

const CATEGORY_DESC: Record<string, string> = {
  "cases":             "Shop premium phone cases in Karachi — drop protection, slim covers, wallet cases & more at MMZ Shop.",
  "screen-protection": "Buy tempered glass & screen protectors in Karachi. Best brands, perfect fit. MMZ Shop.",
  "power-charging":    "Shop chargers, power banks & cables in Karachi. Fast charging, reliable brands. MMZ Shop.",
  "audio":             "Buy earphones, earbuds & headphones in Karachi. Wired & wireless. MMZ Shop.",
  "accessories":       "Shop mobile accessories in Karachi — holders, stands, cleaning kits & more. MMZ Shop.",
  "panels":            "Buy OEM mobile panels & replacement screens in Karachi. iPhone, Samsung, Oppo & more. MMZ Shop.",
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const categoryName = CATEGORY_MAP[slug];
  if (!categoryName) return { title: "Not Found" };
  return {
    title: `${categoryName} in Karachi — MMZ Shop`,
    description: CATEGORY_DESC[slug] ?? `Shop the best ${categoryName} products in Karachi at MMZ Shop.`,
    alternates: { canonical: `https://shop.memonmobilezone122.pk/${slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const categoryName = CATEGORY_MAP[slug];
  if (!categoryName) notFound();

  return <CategoryListing category={categoryName} categorySlug={slug} />;
}
