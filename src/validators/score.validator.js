'use strict';

const { body } = require('express-validator');

const saveScoreValidator = [
  body('score')
    .notEmpty().withMessage('Score is required.')
    .isInt({ min: 50, max: 500 })
    .withMessage('Score must be an integer between 50 and 500.'),
];

module.exports = { saveScoreValidator };
