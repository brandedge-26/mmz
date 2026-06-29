import Link from "next/link";

const CATEGORIES = [
  {
    label: "Cases",
    image: "/shop/category/Cases.webp",
    href:  "/products?category=Cases",
  },
  {
    label: "Screen Protectors",
    image: "/shop/category/Screen_Protectors.webp",
    href:  "/products?category=Screen+Protection",
  },
  {
    label: "Power & Charging",
    image: "/shop/category/Charging.webp",
    href:  "/products?category=Power",
  },
  {
    label: "Audio",
    image: "/shop/category/Audio_Category_Tile.webp",
    href:  "/products?category=Audio",
  },
  {
    label: "Accessories",
    image: "/shop/category/accessory.webp",
    href:  "/products?category=Accessories",
  },
];

export default function CategoryCards() {
  return (
    <section className="px-3 sm:px-6 py-8">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">
        Browse by Category
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="group flex flex-col bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 hover:border-violet-200 hover:shadow-md transition-all duration-300"
          >
            {/* Image area */}
            <div className="w-full bg-gray-100 flex items-center justify-center p-4" style={{ height: "160px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Label */}
            <div className="px-4 py-3 bg-white border-t border-gray-100">
              <p className="text-sm font-bold text-gray-900">{cat.label}</p>
              <p className="text-xs text-violet-600 font-semibold mt-0.5 flex items-center gap-1">
                Shop now
                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
