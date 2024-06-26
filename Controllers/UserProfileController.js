const User = require('../Models/User');
const Posts = require('../Models/Post');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator'); // validator and sanitizer
const fsPromises = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');

exports.profile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).exec();
  const posts = await Posts.find({ User: req.user._id }).exec();

  if (!posts) {
    posts = 'there are no posts for this user';
  }
  if (req.user._id.toString() === user._id.toString()) {
    return res.status(200).json({ user: user, posts: posts });
  }
  return res
    .status(403)
    .json({ message: 'not authorized to access this profile' });
  //accessing a specific profile with specific details is for another route controller // not added
});

exports.updateProfile = [
  body('newUsername', 'New Username must be required')
    .trim()
    .optional()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const user = await User.findById(req.user._id).exec();
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    // If the new username is provided and different, check if it already exists
    if (req.body.newUsername && req.body.newUsername !== user.Username) {
      const usernameExists = await User.findOne({
        Username: req.body.newUsername,
      });
      if (
        usernameExists &&
        usernameExists._id.toString() !== req.user._id.toString()
      ) {
        return res.status(400).json({ message: 'Username Already Exists' });
      }
      user.Username = req.body.newUsername;
    }
    await user.save();
    res.status(200).json({ message: 'Profile Updated Successfully' });
  }),
];
