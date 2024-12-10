import { Check, Bell, MapPin, CheckCircle, List, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      title: "SOS Button",
      description: "Send instant alerts to your trusted contacts during emergencies.",
      icon: Bell,
      points: ["One-tap emergency activation", "Instant notification to contacts", "Location sharing"]
    },
    {
      title: "Safety Check-Ins",
      description: "Automate regular safety updates to your loved ones.",
      icon: CheckCircle,
      points: ["Scheduled check-ins", "Customizable intervals", "Automated notifications"]
    },
    // {
    //   title: "Geo-Fencing Alerts",
    //   description: "Define safe zones and get notified of unexpected movements.",
    //   icon: MapPin,
    //   points: ["Custom safe zones", "Real-time monitoring", "Instant breach alerts"]
    // },
    {
      title: "Activity Logs",
      description: "Keep track of all safety activities and incidents.",
      icon: List,
      points: ["Detailed activity history", "Incident reports", "Data analytics"]
    },
    {
      title: "Resource Hub",
      description: "Access vital emergency numbers and safety guides.",
      icon: BookOpen,
      points: ["Emergency contacts", "Safety guidelines", "Local resources"]
    }
  ];

  return (
    <section className="py-24 bg-white" id="features">
      <div className="container-padding">
        <div className="text-center mt-28 mb-16">
          <span className="bg-neutral-500/20 text-secondary px-4 py-2 rounded-full text-lg font-medium">
            KEY FEATURES
          </span>
          <h2 className="heading-lg mt-12">Key Features of Neo<span className="text-secondary">Aegis</span></h2>
          <p className="text-neutral-600 mt-6 max-w-2xl mx-auto text-lg">
            Empowering you with comprehensive tools for personal safety and peace of mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-16 mt-28 px-4 md:px-8 lg:px-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="glass-panel p-6 hover:shadow-2xl transition-shadow w-full md:w-full lg:w-2/3 mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-neutral-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-neutral-700 mb-6">{feature.description}</p>
                <ul className="space-y-4">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-neutral-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="text-sm text-neutral-600">{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link to={'/sign-in'}>
          <button className="button-primary">Explore All Features</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;