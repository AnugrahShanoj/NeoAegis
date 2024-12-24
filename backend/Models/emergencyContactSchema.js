const mongoose=require('mongoose')

const emergencyContactSchema= new mongoose.Schema({
    fullname:{
        type:String,
        required:[true, 'Full name is required'],
        trim:true
    },
    phoneNumber:{
        type:String,
        required:[true, 'Phone number is required'],
        match: [/^\+?\d{1,4}[-.\s]?\d{10}$/, 'Please enter a valid phone number'] 
    },
    email:{
        type:String,
        required:[true, 'Email is required'],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    userId:{
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      }
})

// Create a collection with this schema
const EmergencyContact= mongoose.model("EmergencyContact",emergencyContactSchema)

// Export the collection
module.exports= EmergencyContact