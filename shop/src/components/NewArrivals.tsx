import Link from "next/link";
import ProductCard, { type Product } from "./ProductCard";

const NEW_ARRIVALS: Product[] = [
  {
    id: "1",
    name: "iPhone 16 Pro Max Silicone Case with MagSafe",
    brand: "Apple",
    price: 3999,
    originalPrice: 4999,
    image: "/shop/category/Cases.webp",
    badge: "New",
    badgeColor: "violet",
    href: "/products/iphone-16-pro-max-case",
  },
  {
    id: "2",
    name: "Galaxy S25 Ultra Tempered Glass Screen Protector",
    brand: "Samsung",
    price: 1499,
    image: "/shop/category/Screen_Protectors.webp",
    badge: "New",
    badgeColor: "violet",
    href: "/products/galaxy-s25-ultra-screen-protector",
  },
  {
    id: "3",
    name: "65W USB-C GaN Fast Charger with Cable",
    brand: "Anker",
    price: 2999,
    originalPrice: 3799,
    image: "/shop/category/Charging.webp",
    badge: "New",
    badgeColor: "violet",
    href: "/products/65w-gan-charger",
  },
  {
    id: "4",
    name: "True Wireless Noise Cancelling Earbuds Pro",
    brand: "JBL",
    price: 8999,
    originalPrice: 11999,
    image: "/shop/category/Audio_Category_Tile.webp",
    badge: "New",
    badgeColor: "violet",
    href: "/products/jbl-earbuds-pro",
  },
];

export default function NewArrivals() {
  return (
    <section className="px-3 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">New Arrivals</h2>
          <p className="text-sm text-gray-400 mt-1">Fresh drops — the latest products just added to the store.</p>
        </div>
        <Link
          href="/products?badge=New"
          className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors shrink-0 flex items-center gap-1"
        >
          View all
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* 4-column grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {NEW_ARRIVALS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
