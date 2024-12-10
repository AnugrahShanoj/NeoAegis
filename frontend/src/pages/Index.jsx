import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import AppOverview from "@/components/landing/AppOverview";
import TrustedBy from "@/components/landing/TrustedBy";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import SafetyNews from "../components/landing/SafetyNews";

const Index = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation />
      <Hero />
      <AppOverview />
      <Features />
      <SafetyNews/>
      <TrustedBy />
      <Footer />
    </div>
  );
};

export default Index;