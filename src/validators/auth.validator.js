'use strict';

const { body } = require('express-validator');

const sendOtpValidator = [
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^\d{10}$/).withMessage('Phone number must be exactly 10 digits.'),
];

const registerValidator = [
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^\d{10}$/).withMessage('Phone number must be exactly 10 digits.'),

  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),

  body('dob')
    .trim()
    .notEmpty().withMessage('Date of birth is required.')
    .isDate({ format: 'YYYY-MM-DD', strictMode: true })
    .withMessage('Date of birth must be in YYYY-MM-DD format.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('otp')
    .trim()
    .notEmpty().withMessage('OTP is required.')
    .isLength({ min: 4, max: 6 }).withMessage('OTP must be 4–6 digits.'),
];

module.exports = { sendOtpValidator, registerValidator };
