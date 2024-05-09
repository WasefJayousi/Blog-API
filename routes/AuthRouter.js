const express = require('express');
const User = require('../Models/User');
const passport = require('passport');
const router = express.Router();

// Register route/middleware
router.post('/register', auth.register);
//login route/middleware
router.post('/login' ,auth.login )
//log out route/middleware
router.post('/logout' , auth.logout)
//forgot-password
router.post('/forgot-password' , auth.forgot_password)
//post reset
router.post('/post_reset-password/:id/:token' , auth.post_reset_password)

module.exports = router;