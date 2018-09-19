//SERVER EXPRESS
const express = require('express');
//import model
const User = require('../models/user');
//import router
const router = express.Router();
//import controler
const UserControler = require('../controllers/userControler');


router.post('/auth',UserControler.auth );

router.post('/register', UserControler.register);

module.exports = router ;
