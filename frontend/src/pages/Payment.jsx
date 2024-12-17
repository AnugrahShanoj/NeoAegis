import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Shield, GraduationCap, Users, Heart, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import PremiumFeatureCard from "@/components/payment/PremiumFeatureCard";
import PremiumPriceTag from "@/components/payment/PremiumPriceTag";
import PremiumHeader from "@/components/payment/PremiumHeader";
import { createPaymentAPI, verifyPaymentAPI } from '../../Services/allAPI';

const Payment = () => {
  const navigate = useNavigate();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const userId=sessionStorage.getItem("userId")
    const res = await loadRazorpay();
    if (!res) {
      toast.error('Razorpay SDK failed to load');
      return;
    }

    try{
          //1 API call for Razorpay Order
    const response= await createPaymentAPI({amount:599})
    console.log(response)
    const {data}=response
    if(!data.success){
      alert("Failed To Initiate Payment. Try Again!")
      return
    }
    // 2 open Razorpay Checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: data.order.currency,
      order_id:data.order.id,
      name: "NeoAegis Safety",
      description: "Lifetime Safety Subscription",
      handler: async function (response) {
      await  verifyPayment(response)
        // navigate('/dashboard');
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
      },
      theme: {
        color: "#D82B21",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    }
    catch(err){
      console.log('Error during payment process: ',err)
      alert("Something went wrong. Please try again later.")
    }

    // Function to verify payment
    const verifyPayment=async(response)=>{
      try{
        const paymentResponse= await verifyPaymentAPI({
          razorpay_payment_id:response.razorpay_payment_id,
          razorpay_order_id:response.razorpay_order_id,
          razorpay_signature:response.razorpay_signature,
          userId
        })
        console.log(paymentResponse)
        if(paymentResponse.data.success){
          alert("Payment Successful.")
          navigate('/login')
        }
        else{
          alert("Payment Verification Failed.")
        }
      }
      catch(err){
        console.log('Error during payment verification: ',err)
        alert("Error verifying payment.")
      }
    }
  };

  const features = [
    {
      icon: Shield,
      title: "24/7 Emergency Response",
      description: "Instant help when you need it most"
    },
    {
      icon: Users,
      title: "Trusted Emergency Contacts",
      description: "Your safety network, always connected"
    },
    {
      icon: GraduationCap,
      title: "Support Children's Education",
      description: "Help build a brighter future"
    },
    {
      icon: Heart,
      title: "Help Elderly Care Programs",
      description: "Support dignified aging"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Premium animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: "linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)",
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: "linear-gradient(to right, #ee9ca7, #ffdde1)",
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <PremiumHeader />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel rounded-2xl p-8 relative overflow-hidden"
        >
          <div className="relative">
            <PremiumPriceTag />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <PremiumFeatureCard key={index} {...feature} />
              ))}
            </div>

            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handlePayment}
                  className="button-secondary w-full md:w-auto md:px-12 py-6 text-lg relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Subscribe Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </motion.div>
              <p className="mt-4 text-sm text-neutral-600 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Secure payment powered by Razorpay
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center text-sm text-neutral-600"
        >
          <p>
            By subscribing, you agree to our Terms of Service and Privacy Policy.
            Your contribution directly supports our charitable initiatives.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;