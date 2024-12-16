import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { UserRound, Mail, Lock } from "lucide-react";
import { registerAPI } from "../../../Services/allAPI";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
        
const SignUp = () => {
  // To hold username,email,password
  const [userDetails,setUserDetails]=useState({
    username:"",
    email:"",
    password:""
  })

  // Navigate
  const navigate=useNavigate()

  // registerAPI calling
  const handleRegister= async()=>{
    console.log(userDetails)
    const {username,email,password}=userDetails
    if(!username || !email || !password){
      toast.warn('Please fill all the fields', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
    else{
      try{
        const response=await registerAPI(userDetails)
        console.log(response)
        const {user}= response.data
        if(response.status==200){
          sessionStorage.setItem("userId",user.id)
          toast.success(response.data.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
            setTimeout(()=>{
              navigate('/payment')
            },4000)
        }
        else{
          toast.error(response.response.data.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        }
      }
      catch(err){
        console.log(err)
      }
    }
  }
  // console.log(userDetails);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A4848]/5 to-secondary/5 flex items-center justify-center px-4 relative overflow-hidden">
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
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-secondary/5 rounded-full animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-[#4A4848]/5 rounded-full animate-pulse" />
      </div>

      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-8 relative overflow-hidden border border-white/20"
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
                <UserRound className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-center text-[#4A4848] mb-2">
                Create Account
              </h2>
              <p className="text-neutral-600 text-center mb-8">
                Join us today and start your journey
              </p>
            </motion.div>

            <form  className="space-y-6">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                 <div className="relative group">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral-400 group-hover:text-secondary transition-colors" />
                  <Input
                    type="text"
                    placeholder="Username"
                    className="pl-10 bg-white/50 border-neutral-200/50 focus:border-secondary transition-colors"
                    required
                    onChange={(e)=>setUserDetails({...userDetails,username:e.target.value})}
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral-400 group-hover:text-secondary transition-colors" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="pl-10 bg-white/50 border-neutral-200/50 focus:border-secondary transition-colors"
                    required
                    onChange={(e)=>setUserDetails({...userDetails,email:e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral-400 group-hover:text-secondary transition-colors" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-10 bg-white/50 border-neutral-200/50 focus:border-secondary transition-colors"
                    required
                    onChange={(e)=>setUserDetails({...userDetails,password:e.target.value})}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button onClick={handleRegister} type="button" className="w-full bg-gradient-to-r from-[#4A4848] to-secondary hover:opacity-90 text-white">
                  Create Account
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
                // onClick={handleGoogleSignUp}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-sm text-neutral-600 mt-8"
              >
                Already have an account?{" "}
                <Link to="/sign-in" className="text-secondary hover:text-secondary/90 font-medium transition-colors">
                  Sign in
                </Link>
              </motion.p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;