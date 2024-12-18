const jwt=require('jsonwebtoken')

const jwtMiddlewares=(req,res)=>{
    console.log("inside jwtMiddleware")
    try{
        
    }
    catch(err){
        console.log("Error occured: ",err)
        res.status(401).json("Please Login")
    }
}

module.exports=jwtMiddlewares