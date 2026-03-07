import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import AppOverview from "@/components/landing/AppOverview";
import Features from "@/components/landing/Features";
import SafetyNews from "@/components/landing/SafetyNews";
import TrustedBy from "@/components/landing/TrustedBy";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: "#f5f5f5" }}>
      <Navigation />
      <Hero />
      <AppOverview />
      <Features />
      <SafetyNews />
      <TrustedBy />
      <Footer />
    </div>
  );
};

export default Index;