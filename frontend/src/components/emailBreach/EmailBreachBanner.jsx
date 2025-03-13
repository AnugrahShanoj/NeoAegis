import React from 'react'
import { Shield, Lock, AlertTriangle, Fingerprint, Cpu } from "lucide-react";
import { motion } from "framer-motion";
function EmailBreachBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent-darkGray to-primary opacity-95 z-0" />
      
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Binary pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute text-[8px] font-mono text-white whitespace-nowrap"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              >
                {Array.from({ length: 50 }).map(() => Math.round(Math.random())).join('')}
              </div>
            ))}
          </div>
        </div>
        
        {/* Glowing orbs for cyber aesthetic */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <motion.div 
            className="absolute -left-10 -top-10 w-40 h-40 bg-secondary/50 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute right-[20%] top-[20%] w-60 h-60 bg-accent-lightGray/50 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.2, 0.3] 
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div 
            className="absolute left-[30%] -bottom-20 w-60 h-60 bg-secondary/50 rounded-full blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>
      </div>
      
      <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 text-neutral-400 opacity-80"
              >
                <Cpu className="h-10 w-10" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative z-10"
              >
                <Fingerprint className="h-10 w-10 text-white" />
              </motion.div>
            </div>
          </div>
          <motion.div 
            className="absolute -top-1 -right-1 w-8 h-8 bg-secondary rounded-full flex items-center justify-center border-2 border-white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <AlertTriangle className="h-4 w-4 text-white" />
          </motion.div>
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 flex flex-wrap items-center gap-2">
            <span className="mr-2">Cyber Identity Protection</span>
            <motion.span
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-secondary"
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Scanner
            </motion.span>
          </h1>
          <p className="text-white/90 max-w-2xl">
            Your digital footprint is at risk. Data breaches expose personal information to cyber threats daily.
            Our advanced scanner checks if your email has been compromised across the dark web and 
            breach databases. Take control of your digital identity now.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default EmailBreachBanner