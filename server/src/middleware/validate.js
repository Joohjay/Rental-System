const AppError = require('../utils/AppError');

const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      if (rules.required && (value === undefined || value === null || (typeof value === 'string' && !value.trim()))) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value) {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} must be at most ${rules.maxLength} characters`);
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(rules.message || `${field} is invalid`);
        }
      }
    }

    if (errors.length > 0) {
      return next(new AppError(errors.join('; '), 400));
    }

    next();
  };
};

module.exports = validate;
