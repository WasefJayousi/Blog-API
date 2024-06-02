require('dotenv').config();
const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator'); // validator and sanitizer
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const VerificationEmail = require('../Configs/VerificationEmail');
exports.sendVerificationEmail = [
  body('Email', 'Email Required.').trim().isLength({ min: 5 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { Email } = req.body;
    const EmailnameExists = await User.findOne({ Email: Email }).exec();
    if (EmailnameExists) {
      return res.status(409).json({ message: 'Email already Exists' });
    }

    const payload = {
      email: Email,
    };
    const VerificationToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    await VerificationEmail(Email, VerificationToken);
    res
      .status(200)
      .json({
        message: `Verification Email Sent to : ${Email}`,
        VerificationToken: VerificationToken,
      });
  }),
];
//
exports.completeRegistration = [
  body('Username', 'Username is required and must be at least 3 characters.')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .custom(async Username => {
      const userExists = await User.findOne({ Username: Username }).exec();
      if (userExists) {
        console.log(userExists);
        throw new Error('Username Already Exists!');
      }
      console.log(userExists);
    }),
  body('Password', 'Password must be at least 8 characters long.')
    .trim()
    .isLength({ min: 8 })
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { Username, Password } = req.body;

    // Extract the VerificationToken from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ error: 'Authorization header missing or invalid' });
    }
    const Verificationtoken = authHeader.split(' ')[1]; // Extract the token part

    // Verify the VerificationToken to retrieve the associated email
    const decodedToken = jwt.verify(Verificationtoken, process.env.JWT_SECRET);
    const Email = decodedToken.email; // Extract the email from the token

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create new user
    const newUser = new User({
      Username,
      Email,
      Password: hashedPassword,
      isVerified: true, // Mark account as verified
    });

    // Save user to database
    await newUser.save();

    // Return JWT token in response
    res.status(201).json({ message: 'User registered successfully' });
  }),
];

exports.login = [
  body('UsernameOrEmail', 'Required to input Username.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('Password', 'Required to input password.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        username: req.body.username,
        errors: errors.array(),
      });
    }
    const user = await User.findOne({
      $or: [
        { Username: req.body.UsernameOrEmail },
        { Email: req.body.UsernameOrEmail },
      ],
    }).exec();

    if (!user) {
      return res.status(400).json({ message: 'Invalid Username Or Password!' });
    }
    const passwordMatch = bcrypt.compare(req.body.Password, user.Password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const body = {
      _id: user._id,
      Username: user.Username,
      Email: user.Email,
    };
    const accesstoken = jwt.sign({ user: body }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return res
      .status(200)
      .json({
        message: 'Logged in Successfully',
        token: accesstoken,
        user: user,
      });
  }),
];

exports.forgot_password = [
  body('email', 'Email must be required').trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({
        username: req.body.username,
        errors: errors.array(),
      });
    }
    const EmailExists = User.findOne({ Email: email }).exec();
    if (!EmailExists) {
      return res.status(404).json({ message: 'Email does not exists' });
    }
    const secret = process.env.JWT_SECRET + EmailExists._id;

    const payload = {
      email: EmailExists.Email,
      id: EmailExists._id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: '20m' });
    const link = `http://localhost:3000/rest-password/${EmailExists._id}/${token}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'FDRS1697@gmail.com',
        pass: process.env.pass,
      },
    });

    const mailOptions = {
      from: 'FDRS1697@gmail.com',
      to: EmailExists.Email, // emailExists
      subject: 'Reset password link',
      html: `
          <style>
          body {
              font-family: 'Arial', sans-serif;
              margin: 20px;
              text-align: center;
          }
      
          h1 {
              color: #333;
          }
      
          p {
              color: #555;
              line-height: 1.5;
              margin-bottom: 10px;
          }
      
          a {
              display: inline-block;
              padding: 10px 20px;
              margin: 10px 0;
              background-color: darkred;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
          }
      
          a:hover {
              background-color: rgb(185, 4, 4);
          }
      
          .logo-container {
              text-align: center;
              margin-top: 30px;
          }
      
          .logo-container img {
              max-width: 200px;
      
          .Do8Zj{
            align-item: center !importent;
          }
      </style>
              
              <h1>Password Reset</h1>
              <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
              <p>Please click on the following link, or paste this into your browser to complete the process:</p>
              <a href="${link}" target="_blank">Reset Password</a>
              <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res
          .status(500)
          .json({ message: 'Email sending failed. Please try again later.' });
      } else {
        // Email was sent successfully
        console.log('Email sent: ' + info.response);
        return res
          .status(200)
          .json({
            message: 'Password reset link has been sent to your email.',
          });
      }
    });
  }),
];
exports.post_reset_password = [
  body('password', 'password must be 8 characters long')
    .trim()
    .isLength({ min: 8 }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({
        username: req.body.username,
        errors: errors.array(),
      });
    }
    const { id, token } = req.params;
    const { password } = req.body;

    const userExists = User.findById(id);
    if (!userExists) {
      return res.status(404).json({ message: 'User does not exists' });
    }

    const secret = process.env.JWT_SECRET + userExists._id;
    jwt.verify(token, secret);

    const hashedPassword = await bcrypt.hash(password, 10); // hashing it 10 rounds with a random salt added to the password

    const updateduser = await User.findByIdAndUpdate(
      id,
      { $set: { Password: hashedPassword } },
      { new: true }
    ).exec();
    await updateduser.save();

    if (updateduser) {
      return res.status(201).json({ message: 'Password updated successfully' });
    } else {
      return res.status(400).json({ message: 'password could not be updated' });
    }
  }),
];
