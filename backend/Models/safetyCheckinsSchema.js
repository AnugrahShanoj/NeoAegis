const mongoose= require('mongoose')
const safetyCheckinsSchema= new mongoose.Schema({
    checkInTime:{
        type:Date,
        required:true,
        index:true // Indexing for faster queries
    },
    checkInNote:{
        type:String,
    },
    checkInStatus:{
        type:String,
        enum:["Pending","Completed","Missed"],
        default:"Pending",
        index:true // Indexing for faster lookups
    },
    userId:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now,
      }
})

const SafetyCheckin= mongoose.model("safetyCheckins",safetyCheckinsSchema)

module.exports=SafetyCheckin