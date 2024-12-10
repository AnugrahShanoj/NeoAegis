// Import mongoose
const mongoose=require('mongoose')

// Load connectionString
const connectionString=process.env.connectionString

// Connect with DB
mongoose.connect(connectionString).then(res=>{
    console.log("NeoAegis Server connected with DB")
})
.catch(err=>{
    console.log("Error Occured: "+err)
})