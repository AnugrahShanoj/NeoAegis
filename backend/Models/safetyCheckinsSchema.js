const mongoose= require('mongoose')
const safetyCheckinsSchema= new mongoose.Schema({
    checkInTime:{
        type:Date,
        required:true
    },
    checkInNote:{
        type:String,
        required:true
    },
    checkInStatus:{
        type:String,
        enum:["Pending","Completed","Missed"],
        default:"Pending"
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