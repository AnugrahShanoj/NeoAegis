import React from 'react'
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, ArrowRightCircle, Calendar, Globe, Shield, LockKeyhole, Info, ExternalLink } from "lucide-react";
function EmailBreachResults({ results }) {
    const { email, breachedSites, breachCount, checkedAt } = results;
    const isBreached = breachCount > 0;

    // Create binary code animation for breach visualization
  const BinaryCodeBackground = () => (
    <div className="absolute inset-0 overflow-hidden opacity-5 z-0">
      {Array.from({ length: 10 }).map((_, i) => (
        <div 
          key={i}
          className="absolute text-[8px] md:text-xs font-mono text-secondary whitespace-nowrap"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.8 + 0.2,
          }}
        >
          {Array.from({ length: 30 }).map(() => Math.round(Math.random())).join('')}
        </div>
      ))}
    </div>
  );
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.5 }}
      className="mt-8 overflow-hidden"
    >
      <div className={`p-6 rounded-xl relative overflow-hidden ${
        isBreached 
          ? 'bg-gradient-to-r from-red-50 to-red-100 border border-red-200' 
          : 'bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200'
      }`}>
        {isBreached && <BinaryCodeBackground />}
        
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 rounded-full ${isBreached ? 'bg-red-100' : 'bg-green-100'}`}>
              {isBreached ? (
                <AlertTriangle className="h-8 w-8 text-red-500" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-600" />
              )}
            </div>
            
            <div>
              <motion.h3 
                className="text-xl font-bold text-primary mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {isBreached ? 'Email Found in Data Breaches' : 'No Breaches Found'}
              </motion.h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-neutral-700">
                  {isBreached 
                    ? `${email} was found in ${breachCount} data breach${breachCount > 1 ? 'es' : ''}` 
                    : `${email} appears to be safe from known data breaches`}
                </p>
                {isBreached && (
                  <p className="text-sm text-secondary mt-1 font-medium flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" />
                    Your personal data may have been exposed to unauthorized parties
                  </p>
                )}
              </motion.div>
            </div>
          </div>
          
          {isBreached && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-primary">
                  Websites where your data was compromised:
                </h4>
              </div>
              
              <div className="space-y-3">
                {breachedSites.map((site, index) => (
                  <motion.div
                    key={site.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="p-4 bg-white rounded-lg border border-neutral-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-red-200 group-hover:bg-white/80 relative overflow-hidden">
                      {/* Mini breach visualization */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between relative z-10">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-red-50">
                              <LockKeyhole className="h-4 w-4 text-red-500" />
                            </div>
                            <h5 className="font-medium text-primary flex items-center gap-2">
                              {site.name}
                              <span className="text-sm font-normal text-neutral-500 hidden sm:inline">({site.domain})</span>
                            </h5>
                          </div>
                          <p className="text-sm text-neutral-600 mt-2">{site.description}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500 whitespace-nowrap bg-neutral-50 px-3 py-1 rounded-full">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Breach: {new Date(site.breachDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 p-4 bg-neutral-100 border border-neutral-200 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-neutral-200 rounded-full mt-0.5">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium text-primary mb-1">What information might be exposed?</h5>
                    <p className="text-sm text-neutral-700">
                      Breached data commonly includes emails, passwords, usernames, and may include personal information like names, addresses, phone numbers, or even financial data depending on the breach.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm text-neutral-500">
            <div className="flex items-center gap-1.5">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  transition: { duration: 2, repeat: Infinity, ease: "linear" }
                }}
              >
                <Shield className="h-4 w-4 text-primary" />
              </motion.div>
              <span>Last checked: {new Date(checkedAt).toLocaleString()}</span>
            </div>
            
            {isBreached && (
              <a 
                href="#tips" 
                className="text-secondary hover:text-accent-darkGray inline-flex items-center gap-1 group transition-colors duration-300"
              >
                <span>How to protect yourself</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRightCircle className="h-4 w-4 group-hover:text-accent-darkGray" />
                </motion.span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EmailBreachResults