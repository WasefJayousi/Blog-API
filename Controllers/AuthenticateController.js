const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator"); // validator and sanitizer
const asyncHandler = require("express-async-handler");