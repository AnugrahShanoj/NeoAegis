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
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-5 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm mb-6 border border-primary/20"
      >
        <div className="flex items-center gap-3 text-primary">
          <ShieldAlert className="h-5 w-5 text-secondary" />
          <p className="text-sm">
            Enter your email to check if it has been exposed in data breaches. We recommend regularly 
            checking all email addresses you use for important accounts.
          </p>
        </div>
      </motion.div>
      
      <motion.form 
        onSubmit={handleSubmit}
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-14 pl-12 text-lg rounded-xl border-neutral-300 focus-visible:ring-primary"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
            
            {/* Email validation animation */}
            {email && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${email.includes('@') ? 'bg-green-100 text-green-500' : 'bg-amber-100 text-amber-500'}`}>
                  {email.includes('@') ? '✓' : '!'}
                </div>
              </motion.div>
            )}
          </div>
          
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <Button
              type="submit"
              disabled={isLoading || !email}
              className="h-14 px-8 rounded-xl text-lg font-medium group relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #4A4848 0%, #EA2B1F 100%)"
              }}
            >
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-accent-lightGray to-accent-red opacity-0"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Scanning Database...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Breach Check</span>
                  </>
                )}
              </span>
            </Button>
          </motion.div>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </motion.form>
    </div>
  )
}

export default EmailBreachResults