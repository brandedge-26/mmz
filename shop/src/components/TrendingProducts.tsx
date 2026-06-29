import Link from "next/link";
import ProductCard, { type Product } from "./ProductCard";

const TRENDING: Product[] = [
  {
    id: "t1",
    name: "iPhone 16 Clear Case with MagSafe — Military Grade Drop Protection",
    brand: "Spigen",
    price: 2499,
    image: "/shop/category/Cases.webp",
    badge: "Hot",
    badgeColor: "red",
    href: "/products/spigen-iphone-16-clear-case",
  },
  {
    id: "t2",
    name: "Universal Magnetic Wireless Charging Pad 15W",
    brand: "Belkin",
    price: 3499,
    originalPrice: 4799,
    image: "/shop/category/Charging.webp",
    badge: "Sale",
    badgeColor: "red",
    href: "/products/belkin-wireless-pad",
  },
  {
    id: "t3",
    name: "Privacy Screen Protector for iPhone 16 Pro",
    brand: "ZAGG",
    price: 1999,
    image: "/shop/category/Screen_Protectors.webp",
    badge: "Trending",
    badgeColor: "green",
    href: "/products/zagg-privacy-screen",
  },
  {
    id: "t4",
    name: "Portable Bluetooth Speaker — 360° Surround Sound Waterproof",
    brand: "JBL",
    price: 5999,
    originalPrice: 7999,
    image: "/shop/category/Audio_Category_Tile.webp",
    badge: "Hot",
    badgeColor: "red",
    href: "/products/jbl-bluetooth-speaker",
  },
];

export default function TrendingProducts() {
  return (
    <section className="px-3 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Trending Products</h2>
          <p className="text-sm text-gray-400 mt-1">What everyone is buying right now.</p>
        </div>
        <Link
          href="/products"
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
        {TRENDING.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
