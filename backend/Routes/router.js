// Import express, passport
const express=require('express')
const passport=require('passport')

// Import Controllers
const userController=require('../Controller/userController')
const paymentController=require('../Controller/paymentController')
const smsController=require('../Controller/smsController')
const emergencyContactController=require('../Controller/emergencyContactController')
const jwtMiddlewares = require('../Middleware/jwtMiddleware')

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


// 5 Route for handling SMS Request
router.post('/sms/request',jwtMiddlewares,smsController.smsAPI)

// 6 Route for handling Add Emergency Contact 
router.post('/addEmergencyContact',jwtMiddlewares,emergencyContactController.addEmergencyContact)

// 7 Route for handling Get Emergency Contact
router.get('/getEmergencyContact',jwtMiddlewares,emergencyContactController.getEmergencyContacts)

// 8 Route for handling deleting an emergency contact
router.delete('/deleteEmergencyContact/:contactId',jwtMiddlewares,emergencyContactController.deleteEmergencyContact)

// 9 Route for handling Edit an emergency contact
router.put('/editEmergencyContact/:contactId',jwtMiddlewares,emergencyContactController.editEmergencyContact)


// Export the router    
module.exports=router