const express = require('express');
const router = express.Router();
const { createComment, getComment } = require('../controllers/commentController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createComment);
router.get('/:topicId', getComment);

module.exports = router;
