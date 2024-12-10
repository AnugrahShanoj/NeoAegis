import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
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
  const handlePayment = async (plan) => {
    const res = await loadRazorpay();
    if (!res) {
      toast.error('Razorpay SDK failed to load');
      return;
    }
    // This would typically come from your backend
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: plan.price * 100, // amount in paisa
      currency: "INR",
      name: "Safety App",
      description: `${plan.name} Plan Subscription`,
      handler: function (response) {
        toast.success('Payment successful!');
        navigate('/dashboard');
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
      },
      theme: {
        color: "#0284c7",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  const plans = [
    {
      name: "Basic",
      price: 499,
      features: [
        "Basic SOS alerts",
        "Emergency contacts",
        "24/7 support",
      ],
    },
    {
      name: "Premium",
      price: 999,
      features: [
        "All Basic features",
        "Location tracking",
        "Safety check-ins",
        "Priority support",
      ],
    },
    {
      name: "Enterprise",
      price: 1999,
      features: [
        "All Premium features",
        "Custom alerts",
        "Team management",
        "API access",
        "Dedicated support",
      ],
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">Select the perfect plan for your safety needs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className="relative hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">{plan.name}</CardTitle>
                <CardDescription className="text-center text-3xl font-bold text-secondary">
                  ₹{plan.price}
                  <span className="text-sm text-gray-500 font-normal">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-secondary hover:bg-red-700"
                  onClick={() => handlePayment(plan)}
                >
                  Subscribe Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Payment;