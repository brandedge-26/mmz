import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-3">MMZ Shop</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">Coming Soon</h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Accessories, parts, and devices — all in one place. Shop launching soon.
          </p>
        </div>
      </main>
    </>
  );
}
