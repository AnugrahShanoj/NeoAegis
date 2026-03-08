const express  = require('express');
const passport = require('passport');
const { googleAuthCallback } = require('../Controller/userController');

const authRouter = express.Router();

// Initiate Google OAuth
authRouter.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
authRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/sign-in' }),
  googleAuthCallback
);

module.exports = authRouter;