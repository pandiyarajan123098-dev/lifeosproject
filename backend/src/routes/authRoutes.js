const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, getMe, updatePassword, logout } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} = require('../validators/authValidators');

// Rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 25 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

router.post('/register', authLimiter, validateRegister, handleValidationErrors, register);
router.post('/login', authLimiter, validateLogin, handleValidationErrors, login);
router.get('/me', authenticateToken, getMe);
router.put('/password', authenticateToken, updatePassword);
router.post('/logout', logout);

module.exports = router;
