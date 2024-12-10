import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const AppOverview = () => {
  return (
    <section className="py-24 bg-neutral-100" id="about">
      <div className="container-padding">
        <div className="max-w-4xl mx-auto text-center  mt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <span className="bg-neutral-500/20 text-secondary px-4 py-1.5 rounded-full text-lg font-medium">
              WHY NEOAEGIS?
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-full bg-neutral-500/20  flex items-center justify-center">
              <Shield className="w-8 h-8 text-secondary" />
            </div>
            
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed mt-4 mb-8">
              <span className="text-primary font-medium">Neo<span className="text-secondary">Aegis</span> </span> is your trusted personal safety companion, built to ensure that help is always a tap away. 
              Designed for individuals and families, this app empowers you with tools to stay safe, informed, and connected.
              <br />
              We are on a mission to make the world a safer place by putting the right information in front of the right people, at the right time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 mb-28 grid grid-cols-1 md:grid-cols-3 gap-14"
          >
            {[
              { title: "SOS Alerts", description: "Instant help at your fingertips" },
              { title: "Real-time Tracking", description: "Know where your loved ones are" },
              { title: "Secure Check-ins", description: "Automated regular safety updates" }
            ].map((item, index) => (
              <div 
                key={item.title}
                className="glass-panel p-6 rounded-xl"
              >
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-neutral-600">{item.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppOverview;