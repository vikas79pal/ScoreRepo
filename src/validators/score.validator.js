'use strict';

const Joi = require('joi');

const saveScoreSchema = Joi.object({
  score: Joi.number().integer().min(50).max(500).required().messages({
    'number.base':    'Score must be a number.',
    'number.integer': 'Score must be an integer.',
    'number.min':     'Score must be between 50 and 500.',
    'number.max':     'Score must be between 50 and 500.',
    'any.required':   'Score is required.',
  }),
});

module.exports = { saveScoreSchema };
