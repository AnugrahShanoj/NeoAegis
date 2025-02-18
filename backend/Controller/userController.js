// Import user model
const users=require('../Models/userSchema')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

// Implement logic for user register
exports.registerAPI=async(req,res)=>{
    console.log("Inside registerAPI")
    const {username,email,password}=req.body
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
      const user = req.user;
  
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      
      // Redirect based on payment status
      if (!user.paymentStatus) {
        const redirectUrl = `http://localhost:8080/payment?userId=${user._id}&authSuccess=true`;
        return res.redirect(redirectUrl);
      }
  
      // Token Generation
      const token=jwt.sign({userId:user._id,role:user.role},process.env.jwtKey)
      console.log("Token Generated: ",token)
      // Payment completed, redirect to dashboard
      const redirectUrl = `http://localhost:8080/dashboard?userId=${user._id}&authSuccess=true&token=${token}`;
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error("Error in Google Authentication Callback: ", err);
      return res.status(500).json({ message: "Server Error", error: err });
    }
  };
  


  // Implement logic for user login
  exports.loginAPI=async(req,res)=>{
    console.log("Inside Login API")
    const {email,password}=req.body
    try{
        const existingUser=await users.findOne({email})
        console.log(existingUser)
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
  

  // Logic for updating the user profile
  
  exports.updateUserProfile = async (req, res) => {
      console.log("Inside Update User Profile");
      const { username, password, gender, dateOfBirth } = req.body;
      const { userId } = req.payload;
      const profilePic = req.file && req.file.filename;
  
      try {
          let updateFields = { username, gender, profilePic };
  
          // Convert dateOfBirth to proper Date format if provided
          if (dateOfBirth) {
              updateFields.dateOfBirth = new Date(dateOfBirth);
          }
  
          // If password is provided, hash it before updating
          if (password) {
              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(password, salt);
              updateFields.password = hashedPassword;
          }
  
          // Update user profile in the database
          const User = await users.findByIdAndUpdate(
              { _id: userId },
              updateFields,
              { new: true }
          );
  
          await User.save(); // Ensure changes are saved properly
  
          res.status(200).json({
              message: "User Profile Updated Successfully",
              User
          });
  
      } catch (error) {
          console.log("Server Error: ", error);
          res.status(500).json(error);
      }
  };
  



// Logic for getting user details
exports.getUserDetails = async (req, res) => {
    console.log("Inside Get User Details");
    const { userId } = req.payload;
    try {
        const User= await users.findById(userId)
        res.status(200).json({User:User})

    } catch (error) {
        console.log("Server Error: ",error)
        res.status(500).json("Server Error while getting user details")
    }
}
