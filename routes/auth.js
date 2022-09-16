const express =  require('express');
const router = express.Router();
const { showLogin, showRegister } = require('../controllers/auth.js');

router.get('/login', showLogin);

router.get('/register', showRegister);

module.exports = router;