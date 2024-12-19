require('dotenv').config()
const accountSid=process.env.TWILLIO_ACCOUNT_SID
const authToken=process.env.TWILLIO_AUTH_TOKEN

const client=require('twilio')(accountSid,authToken)

exports.smsAPI=async(req,res)=>{
    console.log('Inside SMS API')
    const msgOption={
        from:process.env.TWILLIO_FROM_NUMBER,
        to:process.env.TWILLIO_TO_NUMBER,
        body:req.body.msg
    }
    try {
        const message=await client.messages.create(msgOption)
        console.log(message)
        res.status(200).json({message:"SMS send successfully"})
    } 
    catch (error) {
        console.log("Error Occured Sending SMS: ",error)
        res.status(500).json({message:"Error in sending SMS"})
    }
}
