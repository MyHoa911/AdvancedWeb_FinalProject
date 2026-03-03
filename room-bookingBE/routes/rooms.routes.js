const express = require('express');
const router = express.Router();
const { getRooms, bookRoom } = require('../controllers/rooms.controller');

router.get('/', getRooms);
router.post('/book', bookRoom);

module.exports = router;
