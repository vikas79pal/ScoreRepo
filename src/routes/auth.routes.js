'use strict';

const router = require('express').Router();
const { sendOtp, register, login }                        = require('../controllers/auth.controller');
const { sendOtpSchema, registerSchema, loginSchema }      = require('../validators/auth.validator');
const { validate }                                        = require('../middleware/validate.middleware');

router.post('/send-otp', validate(sendOtpSchema),  sendOtp);
router.post('/register', validate(registerSchema), register);
router.post('/login',    validate(loginSchema),    login);

module.exports = router;
