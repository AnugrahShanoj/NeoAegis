import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <header className="container-padding py-12">
      <div className="max-w-4xl mx-auto text-center relative z-10 pt-60 pb-32 ">
        <motion.h1
          className="heading-xl mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your <span className="text-secondary">Safety</span> , Our{" "}
          <span className="text-secondary">Priority</span>
        </motion.h1>
        <motion.p
          className="text-xl text-neutral-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="text-primary font-semibold">Neo<span className="text-secondary">Aegis</span> </span> ensures your peace of mind wherever you go.
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to={'/sign-up'}>
          <button className="button-primary flex items-center gap-2 mt-8">
            Get Started
          </button>
          </Link>
          {/* <button className="px-6 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-200/50 transition-colors">
            Learn More
          </button> */}
        </motion.div>
        <motion.div
  className="flex flex-wrap justify-center gap-12 mt-28"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.4 }}
>
  <section className="bg-white shadow-2xl border-4 border-primary rounded-xl p-10 max-w-md mx-auto">
    <div className="flex flex-col items-center">
      <h2 className="text-4xl font-bold text-secondary">
        <span className="counter">100,000</span>+
      </h2>
      <p className="text-lg font-xs text-primary">App Downloads</p>
    </div>
  </section>

  <section className="bg-white shadow-2xl border-4 border-primary rounded-xl p-10 max-w-md mx-auto ">
    <div className="flex flex-col items-center">
      <h3 className="text-4xl font-bold text-secondary">
        <span className="counter">600,000</span>+
      </h3>
      <p className="text-lg font-xs text-primary">Activities Started</p>
    </div>
  </section>

  <section className="bg-white shadow-2xl border-4 border-primary rounded-xl p-10 max-w-md mx-auto">
    <div className="flex flex-col items-center">
      <h3 className="text-4xl font-bold text-secondary">
        <span className="counter">20,000,000</span>+
      </h3>
      <p className="text-lg font-xs text-primary">Check-Ins Sent</p>
    </div>
  </section>
</motion.div>
      </div>
    </header>
  );
};

export default Hero;
