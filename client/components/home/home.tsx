import React from "react";
import HeroSection from "./hero";
import Footer from "./footer";
import FeaturesSection from "./features";
import IntegrationsSection from "./integrations";

const HomeSection = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <IntegrationsSection />
      <Footer />
    </div>
  );
};

export default HomeSection;
