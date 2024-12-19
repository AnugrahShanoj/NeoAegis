const jwt=require('jsonwebtoken')

const jwtMiddlewares=(req,res, next)=>{
    console.log("Inside jwtMiddleware")
    try{
        const token=req.headers['authorization'].slice(7)
        console.log('Token: ',token)
        const jwtTokenVerification=jwt.verify(token,process.env.jwtKey)
        console.log('jwtTokenVerification: ',jwtTokenVerification)
        req.payload={
            userId:jwtTokenVerification.userId,
            role:jwtTokenVerification.role
        }
        next()
    }
    catch(err){
        console.log("Error occured during token verification: ",err)
        res.status(401).json("Invalid Token. Please Login")
    }
}

module.exports=jwtMiddlewares