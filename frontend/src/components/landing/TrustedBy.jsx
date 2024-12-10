import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const TrustedBy = () => {
  const testimonials = [
    {
      name: "Priya M.",
      role: "Solo Traveler",
      content: "NeoAegis gave me peace of mind while traveling. The SOS feature is a lifesaver!",
      rating: 5
    },
    {
      name: "Rahul S.",
      role: "Parent",
      content: "As a parent, the geo-fencing feature helps me ensure my children are safe at all times.",
      rating: 5
    },
    {
      name: "Sarah K.",
      role: "Business Professional",
      content: "The safety check-ins feature is perfect for late-night work schedules. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-neutral-200/50" id="testimonials">
      <div className="container-padding mt-40 mb-40">
        <div className="text-center mb-16">
          <span className="bg-neutral-500/20 text-secondary px-4 py-1.5 rounded-full text-lg font-medium">
            TESTIMONIALS
          </span>
          <h2 className="heading-lg mt-12">What Our Users Say</h2>
          <p className="text-neutral-600 mt-4 max-w-2xl mx-auto">
            Real stories from real users who trust NeoAegis for their personal safety
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="glass-panel p-6 shadow-xl">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-neutral-600 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14"><img src="./yes.gif" alt="" className="" /></div>
                
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-neutral-600">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;