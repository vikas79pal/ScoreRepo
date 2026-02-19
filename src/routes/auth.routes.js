'use strict';

const router = require('express').Router();
const { sendOtp, register }                  = require('../controllers/auth.controller');
const { sendOtpValidator, registerValidator } = require('../validators/auth.validator');
const { validate }                           = require('../middleware/validate.middleware');

router.post('/send-otp', sendOtpValidator, validate, sendOtp);
router.post('/register', registerValidator, validate, register);

module.exports = router;
