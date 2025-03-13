import React from 'react'
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  KeyRound, 
  AlertOctagon, 
  Mail, 
  RefreshCw, 
  Layers, 
  Eye, 
  Lock,
  FileText,
  Smartphone,
  ArrowRight,
  CreditCard,
  FileWarning 
} from "lucide-react";
function EmailBreachTips() {
    const securityTips = [
        {
          icon: KeyRound,
          title: "Use Strong, Unique Passwords",
          description: "Create complex passwords (12+ characters) with uppercase, lowercase, numbers, and symbols. Never reuse passwords across sites."
        },
        {
          icon: RefreshCw,
          title: "Change Compromised Passwords",
          description: "Immediately update passwords for any accounts that were involved in a data breach, plus any accounts using similar passwords."
        },
        {
          icon: Layers,
          title: "Enable Two-Factor Authentication",
          description: "Add an extra layer of security by requiring a second verification method. Use an authenticator app rather than SMS when possible."
        },
        {
          icon: Lock,
          title: "Use a Password Manager",
          description: "Password managers generate and store unique, complex passwords securely, reducing the risk from a single breach."
        },
        {
          icon: AlertOctagon,
          title: "Be Alert for Phishing",
          description: "After a breach, be especially cautious of emails claiming to be from affected companies. Never click suspicious links."
        },
        {
          icon: Eye,
          title: "Monitor Your Accounts",
          description: "Regularly check your accounts for suspicious activity, unexpected changes, or unauthorized access attempts."
        }
      ];
    
      const advancedTips = [
        {
          icon: FileText,
          title: "Check Credit Reports",
          description: "Monitor your credit reports regularly for suspicious activities or accounts you don't recognize."
        },
        {
          icon: CreditCard,
          title: "Monitor Financial Accounts",
          description: "Set up alerts on your financial accounts to notify you of any unusual transactions."
        },
        {
          icon: Smartphone,
          title: "Secure Your Devices",
          description: "Keep all devices up-to-date with the latest security patches and use reputable security software."
        },
        {
          icon: FileWarning,
          title: "Consider a Credit Freeze",
          description: "For serious breaches, consider freezing your credit to prevent new accounts from being opened in your name."
        }
      ];
    
      const container = {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
          }
        }
      };
    
      const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      };
  return (
    <motion.div
      id="tips"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl overflow-hidden"
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-accent-darkGray to-primary p-8 mb-8 rounded-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0eiIvPjxwYXRoIGQ9Ik0zMCAzMmgtMnYtOGgydjh6bTAgMGgtMnYtOGgydjh6bTYgMGgtMnYtOGgydjh6bTYgMGgtMnYtOGgydjh6Ii8+PHBhdGggZD0iTTQ4IDI4aC00djRoNHYtNHptMCA4aC00djRoNHYtNHptLTgtNGgtNHY0aDR2LTR6bTAgOGgtNHY0aDR2LTR6bS04LThoLTR2NGg0di00em0wIDhoLTR2NGg0di00em0tOC00aC00djRoNHYtNHptMCA4aC00djRoNHYtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        </div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Protect Your Digital Identity</h2>
            <p className="text-white/80 mt-1">
              Follow these essential practices to secure your personal information and minimize breach damage
            </p>
          </div>
        </div>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {securityTips.map((tip, index) => (
          <motion.div
            key={tip.title}
            variants={item}
            className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="h-1.5 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            <div className="p-5">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                    <tip.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">{tip.title}</h3>
                  <p className="text-sm text-neutral-600">{tip.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-8 p-6 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-lg border border-neutral-200">
        <h3 className="text-lg font-semibold text-primary mb-4">Advanced Protection Steps</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {advancedTips.map((tip) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex items-start gap-3 p-3 bg-white rounded-lg border border-neutral-200"
            >
              <div className="p-2 bg-neutral-100 rounded-full mt-0.5">
                <tip.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-primary">{tip.title}</h4>
                <p className="text-sm text-neutral-600 mt-1">{tip.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 p-6 bg-primary rounded-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-0 top-0 opacity-10" width="300" height="300">
            <defs>
              <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" style={{ stroke: 'white', strokeWidth: 1 }} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-secondary/50 flex items-center justify-center backdrop-blur-sm">
              <Mail className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">Continuous Monitoring Is Essential</h3>
            <p className="text-neutral-300">
              New data breaches occur constantly. Make it a habit to check your email addresses regularly.
              Use a dedicated monitoring service for real-time alerts to new breaches affecting your accounts.
            </p>
            
            <div className="mt-4 flex gap-2">
              <a 
                href="#" 
                className="inline-flex items-center gap-1.5 text-secondary hover:text-white transition-colors"
              >
                <span>Enable breach monitoring</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default EmailBreachTips