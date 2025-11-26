import FAQ from "@/components/home/faq";
import MainFeatures from "@/components/home/features/main-features";
import SecondaryFeatures from "@/components/home/features/secondary-features";
import Footer from "@/components/home/footer";
import HeroSection from "@/components/home/hero-section";
import Pricing from "@/components/home/pricing";
import Testimonials from "@/components/home/testimonials";

export default function Root() {
  return (
    <>
      <HeroSection />
      <MainFeatures />
      <Testimonials />
      <SecondaryFeatures />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  );
}
