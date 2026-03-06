const logActivity = require("../Utils/activityLogger");
const axios= require('axios')

// Logic to make api call for LeakCheck API
exports.emailBreachCheck= async(req,res)=>{
    console.log("Inside emailBreachController")
    const {email}= req.query
    // console.log(email)
    try {
        const response= await axios.get(`https://leakcheck.io/api/public?check=${email}`)
        // console.log(response.data)

await logActivity({
  userId,
  type: "breach_scan",
  title: "Email Breach Scan",
  description: `Scanned ${email} — ${found} breach${found !== 1 ? "es" : ""} found`,
});
        res.json(response.data)
    } catch (error) {
      console.log("Error: ", error) 
      res.status(500).json("Server Error") 
    }
}