// Import express, passport
const express=require('express')
const passport=require('passport')

// Import Controllers
const userController=require('../Controller/userController')

// Create a router using express router
const router=express.Router()

// Define the routes
// 1. Route for register
router.post('/register',userController.registerAPI)

// 2 Route for google authentication 
    // Route to initiate Google Authentication
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    // Callback route after successful Google login
    router.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/login' }),userController.googleAuthCallback);



// Export the router
module.exports=router