//Import dotenv
require('dotenv').config()
// Import express
const express=require('express')
// Import cors
const cors=require('cors')
//Import DB Connection
const DB=require('./DB/connection')
//Import router
// const router=require('./Routes/router')

// Create an application
const serverApp=express()

// Middlewares
serverApp.use(express.json())
serverApp.use(cors())
// serverApp.use(router)

// Define PORT
const PORT= 3000 || process.env.PORT

// Start the application
serverApp.listen(PORT,()=>{
    console.log("NeoAegis Server running on PORT "+PORT)
})


// Sending a welcome message 
serverApp.get('/',(req,res)=>{
    res.send("Welcome to NeoAegis Backend Server")
})
