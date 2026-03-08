import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, GraduationCap, Users, Heart,
  CheckCircle2, Lock, Star, Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import PremiumFeatureCard from "@/components/payment/PremiumFeatureCard";
import PremiumPriceTag from "@/components/payment/PremiumPriceTag";
import PremiumHeader from "@/components/payment/PremiumHeader";
import { createPaymentAPI, verifyPaymentAPI } from "../../Services/allAPI";

const reviews = [
  { name: "Priya M.",  text: "Best ₹599 I've ever spent. Feels truly safe now.",       stars: 5 },
  { name: "Rahul S.", text: "My family insisted I get this. Worth every rupee.",        stars: 5 },
  { name: "Sarah K.", text: "The check-in feature alone is worth the price!",           stars: 5 },
];

const Payment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params     = new URLSearchParams(window.location.search);
    const userId     = params.get("userId");
    const authSuccess = params.get("authSuccess");

    if (userId) {
      // ✅ ALWAYS overwrite — Google SSO userId must always take priority
      // Never use the old guard: if(!sessionStorage.getItem('userId'))
      // That guard was causing SSO users' payment to update the wrong account
      sessionStorage.setItem("userId", userId);

      if (authSuccess === "true") {
        toast.success("Google Authentication Successful!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }

      // Clean the URL
      window.history.replaceState({}, document.title, "/payment");

    } else if (!sessionStorage.getItem("userId")) {
      // No userId anywhere — redirect to sign up
      navigate("/sign-up");
    }
  }, [navigate]);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload  = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    // ✅ Always read userId fresh from sessionStorage at payment time
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      toast.error("Session expired. Please sign in again.");
      navigate("/sign-up");
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    try {
      const response = await createPaymentAPI({ amount: 599 });
      const { data }  = response;

      if (!data.success) {
        toast.error("Failed to initiate payment. Try again.");
        return;
      }

      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      data.order.amount,
        currency:    data.order.currency,
        order_id:    data.order.id,
        name:        "NeoAegis Safety",
        description: "Lifetime Safety Subscription",
        // ✅ userId is captured here in closure — correct user always gets updated
        handler: async (razorpayResponse) => {
          await verifyPayment(razorpayResponse, userId);
        },
        prefill: {
          name:    "",
          email:   "",
          contact: "",
        },
        theme: { color: "#EA2B1F" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const verifyPayment = async (razorpayResponse, userId) => {
    try {
      console.log("Verifying payment for userId:", userId); // Debug log

      const paymentResponse = await verifyPaymentAPI({
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_order_id:   razorpayResponse.razorpay_order_id,
        razorpay_signature:  razorpayResponse.razorpay_signature,
        userId,
      });

      console.log("Verify response:", paymentResponse.data); // Debug log

      if (paymentResponse.data.success) {
        toast.success("Payment Successful! Redirecting to login...", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        // Clear userId from sessionStorage after successful payment
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("authToastShown");
        setTimeout(() => { navigate("/sign-in"); }, 3000);
      } else {
        toast.error("Payment verification failed. Please contact support.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      toast.error("Error verifying payment. Please try again.");
    }
  };

  const features = [
    { icon: Shield,        title: "24/7 Emergency Response",      description: "Instant SOS alerts sent to your emergency contacts in seconds."   },
    { icon: Users,         title: "Trusted Contact Network",      description: "Build and manage your personal safety network effortlessly."       },
    { icon: GraduationCap, title: "Support Children's Education", description: "Part of your payment funds education for underprivileged children." },
    { icon: Heart,         title: "Help Elderly Care Programs",   description: "Contribute to dignified aging and elder care across India."         },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: "#f0eeee" }}>

      {/* LEFT PANEL — Dark immersive */}
      <div
        className="relative w-full lg:w-[45%] flex flex-col justify-between px-8 py-8 sm:px-12 sm:py-10 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0d0b0b 0%, #1a0a0a 40%, #2d0f0f 70%, #3d1515 100%)",
          minHeight: "50vh",
        }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Radial glow top-right */}
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(234,43,31,0.25) 0%, transparent 65%)" }}
        />
        {/* Radial glow bottom-left */}
        <div
          className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(90,21,21,0.35) 0%, transparent 65%)" }}
        />

        {/* Animated rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border pointer-events-none"
          style={{ borderColor: "rgba(234,43,31,0.08)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border pointer-events-none"
          style={{ borderColor: "rgba(234,43,31,0.12)" }}
          animate={{ scale: [1.08, 1, 1.08], opacity: [1, 0.5, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Header */}
        <div className="relative z-10">
          <PremiumHeader />
        </div>

        {/* Price content */}
        <div className="relative z-10 py-8 lg:py-0">
          <PremiumPriceTag />
        </div>

        {/* Mini reviews */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>
                4.9 · 50,000+ users
              </span>
            </div>
            <div className="space-y-2">
              {reviews.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(234,43,31,0.4)" }}
                  >
                    {r.name[0]}
                  </div>
                  <div>
                    <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {r.name}
                    </span>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {r.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL — Light checkout */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 py-10 sm:px-12 sm:py-12 lg:px-16">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#EA2B1F" }}
          >
            Step 1 of 1
          </p>
          <h2
            className="font-black text-neutral-900 mb-2"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            Complete your purchase
          </h2>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Join 50,000+ users who trust NeoAegis for their personal safety.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
        >
          {features.map((feature, index) => (
            <PremiumFeatureCard key={index} index={index} {...feature} />
          ))}
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center gap-4 mb-8 p-4 rounded-2xl"
          style={{
            background: "rgba(234,43,31,0.04)",
            border: "1px solid rgba(234,43,31,0.1)",
          }}
        >
          {[
            { icon: Lock,         label: "256-bit SSL"        },
            { icon: Shield,       label: "Secure Checkout"    },
            { icon: CheckCircle2, label: "Instant Activation" },
            { icon: Sparkles,     label: "Lifetime Access"    },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5" style={{ color: "#EA2B1F" }} />
              <span className="text-xs font-semibold text-neutral-500">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <motion.button
            onClick={handlePayment}
            className="relative w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-white font-black text-lg overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1a0808, #5a1515 40%, #EA2B1F)",
              boxShadow: "0 8px 40px rgba(234,43,31,0.4), 0 2px 8px rgba(0,0,0,0.2)",
              letterSpacing: "-0.01em",
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 16px 56px rgba(234,43,31,0.55), 0 4px 16px rgba(0,0,0,0.25)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Shimmer animation */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
            />
            <CheckCircle2 className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Subscribe Now — ₹599</span>
          </motion.button>

          <div className="flex items-center justify-center gap-2 mt-3">
            <Lock className="w-3 h-3 text-neutral-400" />
            <p className="text-xs text-neutral-400 font-medium">
              Secure payment powered by Razorpay · No hidden charges
            </p>
          </div>
        </motion.div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-xs text-neutral-400 text-center leading-relaxed"
        >
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          Your contribution directly supports our charitable initiatives.
        </motion.p>
      </div>
    </div>
  );
};

export default Payment;