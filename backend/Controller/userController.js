// Import user model
const users=require('../Models/userSchema')

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
  
      // Respond with a success message and the user details
      res.status(200).json({message: "Google Authentication Successful"});
    } catch (err) {
      console.error("Error during Google authentication: ", err);
      res.status(500).json({ message: "Server Error", error: err });
    }
  };
  
