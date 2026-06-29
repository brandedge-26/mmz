import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryCards from "@/components/CategoryCards";
import NewArrivals from "@/components/NewArrivals";
import WhyMMZ from "@/components/WhyMMZ";
import TrendingProducts from "@/components/TrendingProducts";
import BrandShowcase from "@/components/BrandShowcase";
import Newsletter from "@/components/Newsletter";
import TrustStrip from "@/components/TrustStrip";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="px-3 sm:px-6 pt-4">
          <HeroBanner />
        </div>
        <CategoryCards />
        <NewArrivals />
        <WhyMMZ />
        <TrendingProducts />
        <BrandShowcase />
        <TrustStrip />
        <Newsletter />
      </main>
    </>
  );
}
