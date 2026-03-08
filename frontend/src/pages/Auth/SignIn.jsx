import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Shield, Mail, Lock } from "lucide-react";
import { loginAPI } from "../../../Services/allAPI";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const SignIn = () => {
  const navigate = useNavigate()
  const [loginUser, setLoginUser] = useState({ email: "", password: "" })

  const handleLogin = async () => {
    const { email, password } = loginUser
    if (!email || !password) {
      toast.warn("Please fill all the fields", {
        position: "top-center", autoClose: 3000, hideProgressBar: false,
        closeOnClick: true, pauseOnHover: true, draggable: true, theme: "light",
      });
      return;
    }

    try {
      const response = await loginAPI(loginUser)
      console.log(response)

      if (response.status === 200) {
        // ✅ Store all session data including username and role
        sessionStorage.setItem("username", response.data.currentUser.username)
        sessionStorage.setItem("token", response.data.token)
        sessionStorage.setItem("userId", response.data.currentUser._id)
        sessionStorage.setItem("role", response.data.currentUser.role)

        toast.success("Login Successful", {
          position: "top-center", autoClose: 3000, hideProgressBar: false,
          closeOnClick: true, pauseOnHover: true, draggable: true, theme: "light",
        });
        setTimeout(() => { navigate('/dashboard') }, 3000)

      } else if (response.status === 406) {
        // Payment incomplete — store userId for payment page
        sessionStorage.setItem('userId', response.response.data.userId)
        toast.error(response.response.data.message, {
          position: "top-center", autoClose: 3000, hideProgressBar: false,
          closeOnClick: true, pauseOnHover: true, draggable: true, theme: "light",
        });
        setTimeout(() => { navigate('/payment') }, 3000)

      } else if (response.status === 404) {
        toast.error(response.response.data.message, {
          position: "top-center", autoClose: 3000, hideProgressBar: false,
          closeOnClick: true, pauseOnHover: true, draggable: true, theme: "light",
        });

      } else if (response.status === 401) {
        toast.error(response.response.data.message, {
          position: "top-center", autoClose: 3000, hideProgressBar: false,
          closeOnClick: true, pauseOnHover: true, draggable: true, theme: "light",
        });

      } else {
        toast.error(response.response.data.message, {
          position: "top-center", autoClose: 3000, hideProgressBar: false,
          closeOnClick: true, pauseOnHover: true, draggable: true, theme: "light",
        });
      }
    } catch (err) {
      console.log("Error During Login: ", err)
    }
  }

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId    = params.get("userId");
    const authSuccess = params.get("authSuccess");
    const token     = params.get("token");
    const username  = params.get("username");
    const role      = params.get("role");

    if (authSuccess === "true" && userId && token) {
      // ✅ Store ALL session data — same as manual login
      sessionStorage.setItem("userId",   userId);
      sessionStorage.setItem("token",    token);
      sessionStorage.setItem("username", username || "");
      sessionStorage.setItem("role",     role     || "user");

      toast.success("Google Login Successful!", {
        position: "top-center", autoClose: 3000, hideProgressBar: false,
        closeOnClick: true, pauseOnHover: true, draggable: true, theme: "light",
      });

      // Clear URL params
      window.history.replaceState({}, document.title, "/sign-in");

      setTimeout(() => { navigate("/dashboard"); }, 3000);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A4848]/5 to-secondary/5 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-secondary/5 rounded-full animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-[#4A4848]/5 rounded-full animate-pulse" />
      </div>

      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-xl shadow-4xl rounded-2xl p-8 relative overflow-hidden border border-white/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#4A4848]/5 via-transparent to-secondary/5" />

          <div className="relative">
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-gradient-to-br from-[#4A4848] to-secondary rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-center text-[#4A4848] mb-2">
                Welcome Back
              </h2>
              <p className="text-neutral-600 text-center mb-8">
                Sign in to your account to continue
              </p>
            </motion.div>

            <form className="space-y-6">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral-400 group-hover:text-secondary transition-colors" />
                  <Input
                    onChange={(e) => setLoginUser({ ...loginUser, email: e.target.value })}
                    type="email"
                    placeholder="Email address"
                    className="pl-10 bg-white/50 border-neutral-200/50 focus:border-secondary transition-colors"
                    required
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral-400 group-hover:text-secondary transition-colors" />
                  <Input
                    onChange={(e) => setLoginUser({ ...loginUser, password: e.target.value })}
                    type="password"
                    placeholder="Password"
                    className="pl-10 bg-white/50 border-neutral-200/50 focus:border-secondary transition-colors"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-secondary hover:text-secondary/90 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleLogin}
                  type="button"
                  className="w-full bg-gradient-to-r from-[#4A4848] to-secondary hover:opacity-90 text-white"
                >
                  Sign In
                </Button>
              </motion.div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-white hover:bg-neutral-50"
                onClick={handleGoogleSignIn}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-sm text-neutral-600 mt-8"
              >
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-secondary hover:text-secondary/90 font-medium transition-colors">
                  Create account
                </Link>
              </motion.p>
            </form>
          </div>
        </motion.div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default SignIn;