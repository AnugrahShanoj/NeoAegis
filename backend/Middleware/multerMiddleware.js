// 1 import multer
const multer=require('multer')

// 2 Defining the destination folder and the file name format
const storage= multer.diskStorage({
    // Setting the destination folder
    destination: (req,file,callback)=>{
        callback(null,'./Uploads')
    },
    // Setting the file name format
    filename: (req,file,callback)=>{
        callback(null,`Profile-${file.originalname}`)
    }
})


// 3 
const multerMiddleware=multer({
    storage
})

// 4 export 
module.exports=multerMiddleware;