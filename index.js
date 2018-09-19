//import config
const config = require('./config');
//SERVER EXPRESS
const express = require('express');
//Body parser
const bodyParse = require('body-parser');
//Path of SERVER
const path = require('path');
//MONGOOS DATABASE
const mongoose = require('mongoose');
//Mongoos Model rentalSchema
const Rental = require('./models/rental');
//Fake data rentals
const FakeDb = require('./fake-db');
//rentals routes
const rentalsRoutes = require('./routes/rentals');
const usersRoutes = require('./routes/users');
const bookinfRoutes = require('./routes/bookings');

mongoose.connect(config.DB_url,{ useNewUrlParser: true }).then( () =>{
  if(process.env.NODE_ENV !== 'production'){
    const fakeDb = new FakeDb();
    fakeDb.seeDb();
  }
});

const app = express();

const PORT = process.env.PORT || 3001;
//Body parser
app.use(bodyParse.json());
//ROUTES
app.use('/api/v1/rentals', rentalsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/bookings', bookinfRoutes);

if(process.env.NODE_ENV === 'production'){
  const appPath = path.join(__dirname, '..', 'dist');
    app.use(express.static(appPath));

    app.get('*', function(req, res) {
      res.sendFile(path.resolve(appPath, 'index.html'));
  });
}


app.listen(PORT,()=>{
  console.log("Server ON ...");
})
