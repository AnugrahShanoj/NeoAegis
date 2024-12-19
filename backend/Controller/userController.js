// Import user model
const users=require('../Models/userSchema')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

// Implement logic for user register
exports.registerAPI=async(req,res)=>{
    console.log("Inside registerAPI")
    const {username,email,password}=req.body
    if(password.length<8){
        return res.status(400).json({message:"Password must be at least 8 characters long"})
    }
    try{
        const existingUser= await users.findOne({email})
        if(existingUser){
            res.status(406).json({message:"Already Registered User"})
        }
        else{
            const newUser= new users({
                username:username,
                email:email,
                password:password,
                role:"user",
                paymentStatus:false,
                paymentId:"",
                isActive:true,
                profilePic:"",
            })
            await newUser.save()
            res.status(200).json({message:"User Registered Successfully",
            user:{
                id:newUser._id,
                username:newUser.username,
                email:newUser.email,
            }
            }
            )
        }
    }
    catch(err){
        console.log("Error: ",err)
        res.status(500).json({message:err})
    }
}

// Implement logic for google authentication for register
exports.googleAuthCallback = async (req, res) => {
    try {
      // The user object will be attached to req.user by Passport
      const user = req.user;
  
      // Redirect to payment page on frontend with userId in query string
      const redirectUrl=`http://localhost:8080/payment?userId=${user._id}&authSuccess=true`
      res.status(200).redirect(redirectUrl)
    } catch (err) {
      console.error("Error during Google authentication: ", err);
      res.status(500).json({ message: "Server Error", error: err });
    }
  };


  // Implement logic for user login
  exports.loginAPI=async(req,res)=>{
    console.log("Inside Login API")
    const {email,password}=req.body
    try{
        const existingUser=await users.findOne({email})
        if(!existingUser){
           return res.status(404).json({message:'User Not Found'})
        }
        const isMatch= await bcrypt.compare(password,existingUser.password)
        if(!isMatch){
            return res.status(401).json({message:'Invalid Credentials'})
        }
        if(existingUser.paymentStatus!==true){
            return res.status(406).json({
                message:'Payment Not Complete. Please Complete The Payment',
                redirectTo:'/payment',
                userId:existingUser._id
            })
        }
        // Login Successful
        const token= jwt.sign({userId:existingUser._id, role:existingUser.role},process.env.jwtKey)
        console.log("TOKEN: ",token)
        res.status(200).json({
            message:'Login Successful',
            currentUser:existingUser,
            token
        })
    }
    catch(err){
        console.log("Server Error: ",err)
        res.status(500).josn({message:`Server Error :${err}`})
    }
  }
  
