//Import dotenv
require('dotenv').config()
//  Import passport configuration
require('./Controller/passportConfig'); // Adjust the path to your passportConfig.js

// Import express
const express=require('express')
// Import cors
const cors=require('cors')
//Import DB Connection
const DB=require('./DB/connection')
// Import router
const router=require('./Routes/router')
// Import passport
const passport = require('passport');
// Import session
const session = require('express-session');

// Create an application
const serverApp=express()

serverApp.use(
    session({
      secret: 'NeoAegis_2024', // Replace with a strong secret key
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set to true if using HTTPS
    })
  );

// Middlewares
serverApp.use(express.json())
serverApp.use(cors())
serverApp.use(router)
serverApp.use(passport.initialize());
serverApp.use(passport.session());


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
