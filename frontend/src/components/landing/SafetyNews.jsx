import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Newspaper, ArrowRight, Tag } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const newsItems = [
  {
    title:       "New Personal Safety App Features Voice Commands",
    date:        "March 15, 2024",
    description: "Latest developments in personal safety technology now include voice-activated emergency alerts, making help more accessible than ever.",
    category:    "Technology",
    color:       "#2563eb",
    bgColor:     "rgba(37,99,235,0.1)",
  },
  {
    title:       "Study Shows 40% Increase in Safety Awareness",
    date:        "March 14, 2024",
    description: "Recent research indicates a significant rise in personal safety awareness among young adults, driven by mobile technology adoption.",
    category:    "Research",
    color:       "#7c3aed",
    bgColor:     "rgba(124,58,237,0.1)",
  },
  {
    title:       "Government Launches Nationwide Safety Initiative",
    date:        "March 13, 2024",
    description: "New program aims to enhance personal safety through community engagement and digital tools available to every citizen.",
    category:    "Policy",
    color:       "#EA2B1F",
    bgColor:     "rgba(234,43,31,0.1)",
  },
  {
    title:       "Experts Share Top Safety Tips for Urban Living",
    date:        "March 12, 2024",
    description: "Leading security experts provide updated guidelines for personal safety in urban areas, emphasizing the role of real-time alerts.",
    category:    "Tips",
    color:       "#16a34a",
    bgColor:     "rgba(22,163,74,0.1)",
  },
  {
    title:       "AI-Powered Safety Tools Reach Mainstream Users",
    date:        "March 10, 2024",
    description: "Artificial intelligence is now being used to predict safety risks and proactively alert users before incidents escalate.",
    category:    "Technology",
    color:       "#ea580c",
    bgColor:     "rgba(234,88,12,0.1)",
  },
];

const SafetyNews = () => {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteract: true }));
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 bg-neutral-50" id="safety-news">
      <div className="max-w-6xl mx-auto px-6">

        <div ref={ref} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{
                background: "rgba(234,43,31,0.08)",
                border: "1px solid rgba(234,43,31,0.2)",
                color: "#EA2B1F",
              }}
            >
              <Newspaper className="w-3.5 h-3.5" />
              Safety News
            </div>
            <h2
              className="font-black text-neutral-900 mb-5"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Stay informed,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #EA2B1F, #5a1515)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                stay safe
              </span>
            </h2>
            <p className="text-neutral-500 text-lg max-w-xl mx-auto leading-relaxed">
              The latest developments in personal safety, security research, and protective technology.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {newsItems.map((item, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div
                    className="group flex flex-col h-full p-6 rounded-2xl bg-white"
                    style={{
                      border: "1px solid rgba(0,0,0,0.07)",
                      boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                      transition: "all 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.12)";
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div className="flex items-center gap-2 mb-5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: item.bgColor }}
                      >
                        <Tag className="w-3.5 h-3.5" style={{ color: item.color }} />
                      </div>
                      <span
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: item.color }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-neutral-900 text-base leading-snug mb-3 flex-shrink-0">
                      {item.title}
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed flex-grow mb-5">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <time className="text-xs text-neutral-400 font-medium">{item.date}</time>
                      <div
                        className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: item.color }}
                      >
                        Read more <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-3 mt-8">
              <CarouselPrevious className="static translate-y-0 rounded-xl border-neutral-200 text-neutral-600 hover:bg-neutral-100" />
              <CarouselNext className="static translate-y-0 rounded-xl border-neutral-200 text-neutral-600 hover:bg-neutral-100" />
            </div>
          </Carousel>
        </motion.div>

      </div>
    </section>
  );
};

export default SafetyNews;