//SERVER EXPRESS
const express = require('express');
//import model
const Rental = require('../models/rental');
//import User
const User = require('../models/user');

//import userCtrl
const UserCtrl = require('../controllers/userControler');

const { normalizeErrors } = require('../helper/mongoosHelper');

const router = express.Router();

router.post('', UserCtrl.authMiddleware, function(req, res){
    const {title, city, street,  category, image, bedrooms, shared, description, dailyRate} = req.body;
    const user = res.locals.user;

    const rental = new Rental({title, city, street,  category, image, bedrooms, shared, description, dailyRate});
    rental.user = user;

    Rental.create(rental, function(err, newRental){
        if(err){
            return res.status(422).send({errors : normalizeErrors(err)});
        }
        User.update({_id: user.id}, { $push: {rentals: newRental}},{});

        return res.json(newRental);
    });
});
router.get('/secret',UserCtrl.authMiddleware, (req, res)=>{
    res.json({"Secret":true});
  
});

router.get('/:id', (req, res) => {
  const rentalId = req.params.id;
  Rental.findById(rentalId)
      .populate('user','userName -_id')
      .populate('bookings', 'startAt endAt -_id')
      .exec(function (err, rentalFound){
              if(err){
                  res.status(422).send({errors : [{title: "Rental Error", detail: "Could not find Rental"}]});
              }
              else
                  res.json(rentalFound);
    });
});

router.get('', (req, res)=>{
    const city = req.query.city;
    const query = city ? {city: city.toLowerCase()} : {}
        Rental.find(query)
        .select('-bookings')
        .exec(function(err, rentalsFound){
            if(err){
                return res.status(422).send({errors : normalizeErrors(err)});
            }
            if(city && rentalsFound.length === 0){
                return res.status(422).send({errors : [{title: "Rental Searche not found", detail: "This rentals does not existe"}]});
            }
            return res.json(rentalsFound);
        });
    }
    
);

module.exports = router ;
