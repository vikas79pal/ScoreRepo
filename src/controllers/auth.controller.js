'use strict';

const moment        = require('moment');
const { User, Otp } = require('../models');
const { signToken } = require('../utils/jwt.util');

const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    const otp       = process.env.HARDCODED_OTP || '1234';
    const expiryMin = parseInt(process.env.OTP_EXPIRY_MINUTES || '1', 10);
    const expiresAt = moment.utc().add(expiryMin, 'minutes').toDate();

    // invalidate any pending OTP for this number before issuing a new one
    await Otp.update({ isUsed: true }, { where: { phone, isUsed: false } });

    await Otp.create({ phone, otp, expiresAt });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully. It is valid for 1 minute.',
    });
  } catch (err) {
    console.error('[sendOtp]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const register = async (req, res) => {
  try {
    const { phone, name, dob, email, otp } = req.body;

    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Phone number is already registered.',
      });
    }

    const otpRecord = await Otp.findOne({
      where:  { phone, otp, isUsed: false },
      order:  [['createdAt', 'DESC']],
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please request a new OTP.',
      });
    }

    if (moment.utc().isAfter(moment.utc(otpRecord.expiresAt))) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.',
      });
    }

    await otpRecord.update({ isUsed: true });

    const user  = await User.create({ phone, name, dob, email });
    const token = signToken({ id: user.id, phone, name, email });

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Email address is already registered.',
      });
    }
    console.error('[register]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { sendOtp, register };
