const express = require('express');
const router = express.Router();
const {
  getProfile,
  saveOnboarding,
  updateProfile,
  getInterests,
  updateInterests,
  getSkills,
  updateSkills,
} = require('../controllers/profileController');
const authenticateToken = require('../middleware/authMiddleware');
const { validateProfile, handleValidationErrors } = require('../validators/profileValidators');

// All profile routes require authentication
router.use(authenticateToken);

router.get('/', getProfile);
router.post('/', validateProfile, handleValidationErrors, saveOnboarding);
router.put('/', validateProfile, handleValidationErrors, updateProfile);

router.get('/interests', getInterests);
router.put('/interests', updateInterests);

router.get('/skills', getSkills);
router.put('/skills', updateSkills);

module.exports = router;
