import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
const SafetyNews = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteract: true })
  );
  const newsItems = [
    {
      title: "New Personal Safety App Features Voice Commands",
      date: "March 15, 2024",
      description: "Latest developments in personal safety technology now include voice-activated emergency alerts.",
      category: "Technology"
    },
    {
      title: "Study Shows Increase in Safety Awareness",
      date: "March 14, 2024",
      description: "Recent research indicates a 40% rise in personal safety awareness among young adults.",
      category: "Research"
    },
    {
      title: "Government Launches Safety Initiative",
      date: "March 13, 2024",
      description: "New nationwide program aims to enhance personal safety through community engagement.",
      category: "Policy"
    },
    {
      title: "Experts Share Top Safety Tips",
      date: "March 12, 2024",
      description: "Leading security experts provide updated guidelines for personal safety in urban areas.",
      category: "Tips"
    }
  ];
  return (
    <section className="py-24 bg-white" id="safety-news">
      <div className="container-padding mb-40">
        <div className="text-center mb-16 mt-36">
          <span className="bg-neutral-500/20 text-secondary px-4 py-1.5 rounded-full text-lg font-medium">
            SAFETY NEWS
          </span>
          <h2 className="heading-lg mt-12">Latest in Personal Safety</h2>
          <p className="text-neutral-600 mt-4 max-w-2xl mx-auto">
            Stay informed about the latest developments in personal safety and security
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {newsItems.map((item, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <Card className="glass-panel p-6 h-full hover:shadow-2xl transition-shadow">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-9 h-9 rounded-lg bg-neutral-500/20 flex items-center justify-center">
                            <Newspaper className="w-5 h-5 text-secondary" />
                          </div>
                          <span className="text-sm text-neutral-600">{item.category}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-neutral-600 text-sm mb-4 flex-grow">{item.description}</p>
                        <time className="text-sm text-neutral-500">{item.date}</time>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
export default SafetyNews;