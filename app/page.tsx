import CtaSection from "@/components/ctasection";
import FeaturesSection from "@/components/featuressection";
import HeroSection from "@/components/herosection";
import HowItWorksSection from "@/components/howitworkssection";
import PreviewSection from "@/components/previewsection";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
      <PreviewSection />
    </div>
  );
};

export default HomePage;
