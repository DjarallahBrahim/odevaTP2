//SERVER EXPRESS
const express = require('express');
const router = express.Router();

//import userCtrl
const UserCtrl = require('../controllers/userControler');
const bookingController = require('../controllers/bookingController')

router.post('',UserCtrl.authMiddleware, bookingController.createBooking);


module.exports = router ;
