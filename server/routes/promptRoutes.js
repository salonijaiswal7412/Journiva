const express = require('express');
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getTodayPrompt, respondToPrompt } = require('../controllers/promptController');

router.get('/today', getTodayPrompt);
router.post('/response', protect, respondToPrompt); 

module.exports = router;