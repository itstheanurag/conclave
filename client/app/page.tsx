import FAQ from "@/components/home/faq";
import Features from "@/components/home/features";
import Footer from "@/components/home/footer";
import HeroSection from "@/components/home/hero-section";
import Pricing from "@/components/home/pricing";
import Testimonials from "@/components/home/testimonials";

export default function Root() {
  return (
    <>
      <HeroSection />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  );
}
