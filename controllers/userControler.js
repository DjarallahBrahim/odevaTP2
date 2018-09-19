const config = require('../config');
const User = require('../models/user');
const { normalizeErrors } = require('../helper/mongoosHelper');
const jwt = require('jsonwebtoken');


exports.auth = (req, res)=>{
  const {email, password} = req.body ;

  if(!email || !password){
    return res.status(422).send({errors : [{title: "Data messing !!", detail: "Provide email and password"}]});
  }
  User.findOne({email}, function(err, user){
    if(err){
      return res.status(422).send({errors : normalizeErrors(err)});
    }
    if(!user){
      return res.status(422).send({errors : [{title: "Email Error", detail: "Email not found"}]});
    }

    if(user.isSamePassword){
      const jwtResult = jwt.sign(   {userId: user.id,
                                    userName: user.userName},
                                    config.SECRET,
                                     { expiresIn: '1h' }
                                  );
      return res.json(jwtResult);
    }else{
      return res.status(422).send({errors : [{title: "Problem with Password !!", detail: "Re-entre your code"}]});
    }
  });
}

exports.register = (req, res)=>{
  const {userName, email, password ,passwordConfirmation} = req.body ;

  if(!email || !password){
    return res.status(422).send({errors : [{title: "Data messing !!", detail: "Provide email and password"}]});

  }
  if(password !== passwordConfirmation){
    return res.status(422).send({errors : [{title: "Data messing !!", detail: "Password error"}]});
  }

  User.findOne({email},(err, existingUser)=>{
    if(err){
      return res.status(422).send({errors : normalizeErrors(err)});
    }
    if(existingUser){
      return res.status(422).send({errors : [{title: "Email invalide", detail: "Email used before"}]});
    }

    const user = new User({
      userName,
      email,
      password
    });

    user.save((err)=>{
      if(err){
        return res.status(422).send({errors : normalizeErrors(err)});
      }
      return res.json({'registered':true});
    });
  });
}

//check autorization of user
exports.authMiddleware = function(req, res, next){
  const token = req.headers.authorization;

  if(!token){
    return res.status(422).send({errors : [{title: "Not autorize", detail: "You need to login"}]});
  }else {
    const user = paresToken(token);
    User.findById(user.userId, function(err, user){
      if(err){
        return res.status(422).send({errors : normalizeErrors(err)});
      }
      if(!user){
        return res.status(422).send({errors : [{title: "Not autorize !", detail: "You need to login"}]});
      }else{
        res.locals.user = user;
        next();
      }
    })
  }
}

function paresToken(token){
  return  jwt.verify(token.split(' ')[1], config.SECRET);
}
