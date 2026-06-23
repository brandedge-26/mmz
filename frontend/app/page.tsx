import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LocationsSection from "@/components/LocationsSection";
import BrandsSection from "@/components/BrandsSection";
import SameDaySection from "@/components/SameDaySection";
import FeaturesStrip from "@/components/FeaturesStrip";
import HowItWorksSection from "@/components/HowItWorksSection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <LocationsSection />
        <BrandsSection />
        <SameDaySection />
        <FeaturesStrip />
        <HowItWorksSection />
        <ReviewsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
