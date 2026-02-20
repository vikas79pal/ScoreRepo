'use strict';

// factory — returns an Express middleware that validates req.body against a Joi schema
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors:  error.details.map((d) => ({
        field:   d.path.join('.'),
        message: d.message,
      })),
    });
  }

  next();
};

module.exports = { validate };
