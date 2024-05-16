const express = require('express');
const Profile = require('../controllers/UserProfileController');
const passport = require('passport');
const router = express.Router();



/* GET users listing. */
router.get('/',passport.authenticate('jwt', { session: false }), Profile.profile);

//Update user email or username
router.put('/update_profile' , passport.authenticate('jwt', { session: false }) , Profile.updateProfile)
module.exports = router;
