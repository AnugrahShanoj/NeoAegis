// Import mongoose
const mongoose=require('mongoose')
// Import bcrypt for password hashing
const bcrypt=require('bcrypt')
//Create a user schema
const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'Username is required'],
        trim:true
    },
    email:{
        type:String,
        required:[true, 'Email is required'],
        unique:true,
        match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,'Please enter a valid email address'],  
    },
    password: {
        type: String,
        required: function () {
          console.log('Google ID:', this.googleId); // Debug log
          return !this.googleId; // Password is required only if Google ID is absent
        },
        minlength: [8, 'Password must be at least 8 characters long'],
      },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
    profilePic:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows null or undefined values
      },
      
})

//Middleware for password hashing before saving
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    try{
        const salt=await bcrypt.genSalt(10)
        this.password= await bcrypt.hash(this.password,salt)
        next()
    }
    catch(err){
        console.log("Error Occured: "+err)
    }
})


// Method to compare passwords during login
userSchema.methods.comparePassword= async(enteredPassword)=>{
    return await bcrypt.compare(enteredPassword,this.password)
}


// Create Model
const users= mongoose.model('users',userSchema)

// Export the schema
module.exports=users