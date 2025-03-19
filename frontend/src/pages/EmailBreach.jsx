import React from 'react'
import { useState, useEffect } from "react";
import { Shield, Mail, AlertTriangle, ExternalLink, KeyRound, Lock } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import  EmailBreachBanner  from "@/components/emailBreach/EmailBreachBanner";
import  EmailBreachSearch  from "@/components/emailBreach/EmailBreachSearch";
import  EmailBreachResults  from "@/components/emailBreach/EmailBreachResults";
import  EmailBreachTips  from "@/components/emailBreach/EmailBreachTips";
import { toast } from "sonner";
import { emailBreachAPI } from '../../Services/allAPI';
function EmailBreach() {
    const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInfoAlert, setShowInfoAlert] = useState(true);
  const [token, setToken]=useState('')
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Floating security tips animation
  const floatingIcons = [
    { icon: Shield, delay: 0 },
    { icon: Lock, delay: 2 },
    { icon: KeyRound, delay: 4 },
  ];

  useEffect(() => {
    // Show an informational toast when the page loads
    toast.info(
      "Regular email breach checks are an essential security practice",
      {
        description: "We recommend checking all your email addresses quarterly",
        duration: 5000,
      }
    );

    // Fetch token from session storage
    setToken(sessionStorage.getItem('token'))
  }, [token]);

  const handleCheckEmail = async (email) => {
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Token for API call
    if(token){
      const reqHeader={
        'Content-Type':`multipart/form-data`,
        'Authorization':`Bearer ${token}`
      }
      try {
      // API Call for email breach check
      const response= await emailBreachAPI(email, reqHeader)
      console.log(response)
      if(response.status=200){
        setSearchResults({
          email,
          breachedSites: response.data.sources,
          breachCount: response.data.found,
          checkedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      setError("An error occurred while checking the email. Please try again.");
      console.error("Error checking email:", err);
      toast.error("Error checking email", {
        description: "The service is temporarily unavailable. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  };
  return (
    <div className="min-h-screen flex bg-neutral-50">
      <DashboardSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          {/* Floating security decorations */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {floatingIcons.map((IconItem, index) => (
              <motion.div
                key={index}
                className="absolute text-neutral-100/30"
                initial={{ 
                  x: Math.random() * 100, 
                  y: Math.random() * 100,
                  opacity: 0.3
                }}
                animate={{ 
                  x: [
                    `${Math.random() * 100}%`, 
                    `${Math.random() * 100}%`, 
                    `${Math.random() * 100}%`
                  ],
                  y: [
                    `${Math.random() * 100}%`, 
                    `${Math.random() * 100}%`, 
                    `${Math.random() * 100}%`
                  ],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{
                  duration: 20 + Math.random() * 10,
                  repeat: Infinity,
                  delay: IconItem.delay
                }}
                style={{
                  left: `${Math.random() * 90}%`,
                  top: `${Math.random() * 90}%`,
                }}
              >
                <IconItem.icon size={100} />
              </motion.div>
            ))}
          </div>
          
          {/* Page content */}
          <EmailBreachBanner />
          
          {showInfoAlert && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-neutral-100 border border-neutral-200 rounded-lg flex gap-3 items-center"
            >
              <div className="p-2 rounded-full bg-neutral-200">
                <AlertTriangle className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-primary">
                  Data breaches exposed over 5.1 billion records in 2025 alone. Your personal data could be at risk.
                </p>
              </div>
              <button 
                onClick={() => setShowInfoAlert(false)}
                className="text-primary hover:text-secondary"
              >
                ✕
              </button>
            </motion.div>
          )}
          
          <div className="glass-panel p-6 md:p-8 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 z-0"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary ">
                <Shield className="h-10 w-10 text-secondary bg-neutral-200 p-2 rounded-xl " />
                Check Your Email for Security Breaches
              </h2>
              
              <EmailBreachSearch 
                onCheckEmail={handleCheckEmail} 
                isLoading={isLoading} 
                error={error}
              />
              
              {searchResults && (
                <EmailBreachResults results={searchResults} />
              )}
              
              {!searchResults && !isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 p-5 bg-neutral-100/80 backdrop-blur-sm rounded-lg border border-neutral-200 flex items-start gap-3"
                >
                  <div className="p-2 bg-white rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary mb-1">How does this work?</h3>
                    <p className="text-sm text-neutral-600">
                      Enter your email address above to check if it has been found in known data breaches. 
                      Our service scans through databases of compromised accounts to identify potential security risks.
                      If your email is found, we'll show you which websites were affected and when the breaches occurred.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          <EmailBreachTips />
          
          <motion.div 
            style={{ opacity }}
            className="fixed bottom-4 right-4 z-50 hidden md:block"
          >
            <div className="bg-primary text-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5" />
                <p className="text-sm font-medium">Scroll to see security tips</p>
              </div>
            </div>
          </motion.div>
          
          <div className="text-center text-sm text-neutral-500 mt-8 pb-8">
            <p className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              This breach checking service is provided for educational purposes.
            </p>
            <p className="mt-2">
              For comprehensive breach monitoring, consider services like{" "}
              <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary hover:underline inline-flex items-center gap-1">
                Have I Been Pwned <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default EmailBreach