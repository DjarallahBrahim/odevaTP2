const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
        userName: {
          type: String,
          max: [33, 'Too long, max is 128 characters'],
          min:[4, 'Too short, min is 4 characters']
        },
        email: {
          type: String,
          required: "email is required",
          max: [33, 'Too long, max is 128 characters'],
          min:[4, 'Too short, min is 4 characters'],
          unique: true,
          lowercase: true,
          match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
        },
        password: {
          type: String,
          required: "password is required",
          max: [33, 'Too long, max is 128 characters'],
          min:[4, 'Too short, min is 4 characters'],
        },
        rentals: [{type: Schema.Types.ObjectId, ref: 'Rental'}],
        bookings: [{type:Schema.Types.ObjectId, ref: "Booking"}]


});

userSchema.methods.isSamePassword = function(requestedPassword) {
  return bcrypt.comparSync(requestedPassword,this.password);
}

userSchema.pre('save', function(next) {
  const user = this;
  bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            // Store hash in your password DB.
            console.log(user.password);
            user.password = hash;
            next();
        });
  });
});

module.exports = mongoose.model('User', userSchema);
