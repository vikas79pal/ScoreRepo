'use strict';

const Joi = require('joi');

// reusable field definitions
const phone = Joi.string().pattern(/^\d{10}$/).required().messages({
  'string.empty':   'Phone number is required.',
  'string.pattern.base': 'Phone number must be exactly 10 digits.',
  'any.required':   'Phone number is required.',
});

const otp = Joi.string().min(4).max(6).required().messages({
  'string.empty':   'OTP is required.',
  'string.min':     'OTP must be 4–6 digits.',
  'string.max':     'OTP must be 4–6 digits.',
  'any.required':   'OTP is required.',
});

const sendOtpSchema = Joi.object({ phone });

const registerSchema = Joi.object({
  phone,
  otp,
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Name is required.',
    'string.min':   'Name must be between 2 and 100 characters.',
    'string.max':   'Name must be between 2 and 100 characters.',
    'any.required': 'Name is required.',
  }),
  dob: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.empty':        'Date of birth is required.',
      'string.pattern.base': 'Date of birth must be in YYYY-MM-DD format.',
      'any.required':        'Date of birth is required.',
    }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
});

const loginSchema = Joi.object({ phone, otp });

module.exports = { sendOtpSchema, registerSchema, loginSchema };
