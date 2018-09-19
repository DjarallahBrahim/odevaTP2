const Booking = require('../models/booking');
const Rental = require('../models/rental');
const User = require('../models/user');
const moment = require('moment');
const { normalizeErrors } = require('../helper/mongoosHelper');

exports.createBooking =  function(req, res) {
    const {startAt, endAt, totalPrice, guests, rental} = req.body ;
    const user = res.locals.user;

    const booking = new Booking({startAt, endAt, totalPrice, guests, rental})

    Rental.findById(rental._id)
        .populate('bookings')
        .populate('user')
        .exec(function (err, foundRentel){
            if(err){
                return res.status(422).send({errors : normalizeErrors(err)});
            }

            if(foundRentel.user.id === user.id){
                return res.status(422).send({errors : [{title: "Not autorize", detail: "Can not creat booking on your Rentals "}]});
            }

            if(isValidBooking(booking, foundRentel)){
                booking.user = user;
                booking.rental = foundRentel;
                foundRentel.bookings.push(booking);

                booking.save(function(err){
                    if(err){
                        return res.status(422).send({errors : normalizeErrors(err)});
                    }

                    foundRentel.save();
                    User.update({_id: user.id}, {$push: {bookings: booking}}, function(){});
                    return res.json({startAt: booking.startAt, endAt: booking.endAt});
                });

            }else{
                return res.status(422).send({errors : [{title: "Invalid Booking", detail: "Choosen dates are already take it"}]});
            }


            //return res.json({booking, foundRentel});
        });
}

function isValidBooking(proposedBooking, rental) {
    let isValide = true;

    if(rental.bookings && rental.bookings.length > 0){

        isValide = rental.bookings.every(function (booking){

            const proposedStart = moment(proposedBooking.startAt);
            const proposedEnd = moment(proposedBooking.endAt);


            const actualStart = moment(booking.startAt);
            const actualEnd = moment(booking.endAt);


            return ((actualStart < proposedStart && actualEnd < proposedStart) ||
                (proposedEnd < actualEnd && proposedEnd < actualStart));


        });

    }

    return isValide
}