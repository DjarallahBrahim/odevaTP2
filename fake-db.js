const Rental = require('./models/rental');
const User = require('./models/user');
const booking = require('./models/booking');

const data = require('./data.json')

class FakeDb{

  constructor(){
    this.rentals =data.rentals ;
    this.user = data.users;
  }

  async cleanDB(){
    await User.remove({});
    await Rental.remove({});
    await booking.remove({});
  }

  //cleanDB with promes
  cleanDb_promes(){
    return new Promise( (resolve,reject) => {
      Rental.remove({}, () => resolve());

    });
  }

  pushDataRToDb(){
    const user = new User(this.user[0]);
    const user1 = new User(this.user[1]);

    this.rentals.forEach((rental)=>{
      const newRental = new Rental(rental);
      //Relation with rentals and user
      newRental.user = user;
      user.rentals.push(newRental);

      newRental.save();
    });
    user.save();
    user1.save();
  }

  async seeDb(){
    await this.cleanDB();
    this.pushDataRToDb();
  }


  seeDbPromes(){
    this.cleanDb_promes().then( () => {
      this.pushRantelsToDb();
    }, (err) => {
        console.log(err);
      });
  }
}

module.exports =  FakeDb ;
