const express = require('express');
const router = express.Router();
const { getMe, getProfile, updateProfile, changePassword } = require('../controllers/users.controller');

router.get('/me', getMe);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/profile/change-password', changePassword);

module.exports = router;
