const { body, validationResult } = require('express-validator');

const validateProfile = [
  body('first_name')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('First name cannot exceed 100 characters.'),
  body('last_name')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Last name cannot exceed 100 characters.'),
  body('age')
    .optional({ nullable: true })
    .isInt({ min: 10, max: 120 })
    .withMessage('Age must be a valid number between 10 and 120.'),
  body('daily_available_minutes')
    .optional()
    .isIn([15, 30, 60, 90, 120])
    .withMessage('Daily available minutes must be one of: 15, 30, 60, 90, 120.'),
  body('skill_level')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Skill level must be Beginner, Intermediate, or Advanced.'),
  body('learning_style')
    .optional()
    .isIn(['Reading', 'Video', 'Hands-on Projects', 'Mixed'])
    .withMessage('Learning style must be Reading, Video, Hands-on Projects, or Mixed.'),
  body('preferred_task_count')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Preferred daily task count must be between 1 and 10.'),
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
}

module.exports = {
  validateProfile,
  handleValidationErrors,
};
