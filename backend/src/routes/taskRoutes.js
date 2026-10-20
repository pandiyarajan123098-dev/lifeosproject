const express = require('express');
const router = express.Router();
const {
  getTodayTasks,
  generateTasks,
  toggleTask,
  submitDailyProgress,
  getTaskHistory,
} = require('../controllers/taskController');
const authenticateToken = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(authenticateToken);

router.get('/today', getTodayTasks);
router.post('/generate', generateTasks);
router.patch('/:id', toggleTask);
router.post('/submit', submitDailyProgress);
router.get('/history', getTaskHistory);

module.exports = router;
