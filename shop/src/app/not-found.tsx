import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — MMZ Shop",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      {/* 404 number */}
      <p className="text-[120px] sm:text-[160px] font-extrabold leading-none text-violet-100 select-none">
        404
      </p>

      {/* Icon */}
      <div className="-mt-8 mb-6 w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-3">
        Page not found
      </h1>
      <p className="text-gray-500 text-sm sm:text-base text-center max-w-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-violet-600 text-white font-semibold text-sm rounded-full hover:bg-violet-700 transition-colors shadow-md shadow-violet-200"
        >
          Back to Shop
        </Link>
        <Link
          href="/products"
          className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold text-sm rounded-full hover:bg-gray-200 transition-colors"
        >
          All Products
        </Link>
      </div>
    </div>
  );
}
