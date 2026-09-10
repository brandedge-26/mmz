import Header from "@/components/Header";
import CategoryIconStrip from "@/components/CategoryIconStrip";
import HeroBanner from "@/components/HeroBanner";
import FeatureStrip from "@/components/FeatureStrip";
import TopSellers from "@/components/TopSellers";
import NewArrivals from "@/components/NewArrivals";
import ShopByDevice from "@/components/ShopByDevice";
import WhyMMZ from "@/components/WhyMMZ";
import TrendingProducts from "@/components/TrendingProducts";
import BrandShowcase from "@/components/BrandShowcase";
import Newsletter from "@/components/Newsletter";
import TrustStrip from "@/components/TrustStrip";

export default function Home() {
  return (
    <>
      <Header />
      <CategoryIconStrip />
      <main className="flex-1">
        <div className="px-3 sm:px-6 pt-4">
          <HeroBanner />
        </div>
        <FeatureStrip />
        <TopSellers />
        <NewArrivals />
        <ShopByDevice />
        <WhyMMZ />
        <TrendingProducts />
        <BrandShowcase />
        <TrustStrip />
        <Newsletter />
      </main>
    </>
  );
}
