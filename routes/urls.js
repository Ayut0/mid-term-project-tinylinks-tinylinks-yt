const express =  require('express');
const router = express.Router();
const { showUrl, createUrl, generateNewUrl, singleUrl, editUrl, redirectToRealUrl } = require('../controllers/urls.js');
const  urls = require('../models/urls.json')
const { showLogin, showRegister } = require('../controllers/auth.js');

router.get('/', showUrl);

//Create
router.get('/new', createUrl)
router.post('/new', generateNewUrl)

//edit
//router.post('/:id', ); add function to receive the id - edit
router.get('/:id/edit', (req, res, next) =>{
    const urlId = req.params.id;
    res.json({message: 'edit url'})
})
//delete
//router.post('/:id', ); add function to receive the id - delete
router.post('/:id/delete', (req, res, next) =>{
    const urlId = req.params.id;

    res.json({message: 'Delete url'})
})

//Single url
// router.get('/:id', ); add function to receive the id
router.get('/:id', singleUrl)
router.post('/:id', editUrl)

//Make sure if the shortened url exists
router.get('/u/:id', redirectToRealUrl)
module.exports = router;