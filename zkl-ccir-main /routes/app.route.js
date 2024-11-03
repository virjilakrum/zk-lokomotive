const express = require('express');
const router = express.Router();
const authRoute = require('./auth.route.js');
const usersRoute = require('./users.route.js');

router.use('/auth', authRoute);
router.use('/users', usersRoute);

module.exports = router;
