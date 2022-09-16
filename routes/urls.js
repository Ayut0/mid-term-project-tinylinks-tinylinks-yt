const express =  require('express');
const router = express.Router();
const { showUrl } = require('../controllers/urls.js');
const { showLogin, showRegister } = require('../controllers/auth.js');

router.get('/', showUrl);

//router.get('/:id', ); add function to receive the id
//router.post('/:id', ); add function to receive the id - edit
//router.post('/:id', ); add function to receive the id - delete

module.exports = router;