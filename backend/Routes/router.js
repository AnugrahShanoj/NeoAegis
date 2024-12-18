// Import express, passport
const express=require('express')
const passport=require('passport')

// Import Controllers
const userController=require('../Controller/userController')
const paymentController=require('../Controller/paymentController')

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


// 3 Route for handling payment gateway
    // Route to create an order
    router.post('/payment/createOrder', paymentController.createOrder);
    // Route to verify payment
    router.post('/payment/verifyPayment', paymentController.verifyPayment);


// 4 Route for handling Login
    router.post('/login',userController.loginAPI)



// Export the router
module.exports=router