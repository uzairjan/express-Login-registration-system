var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/login", function(req, res, next) {
  res.render("login");
});
router.get("/register", function(req, res, next) {
  res.render("register");
});


router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //Check required Fields 

    if(!name || !email || !password || !password2 ){
      errors.push({msg: 'Please fill in all fields'});
    }

    //Check Password match 

    if (password !== password2) {
      errors.push({msg: 'Password do not match'});
    }

    //Check Password Length

    if (password.length < 6) {
      errors.push({ msg: "Password should be at least 6 characters"});
    }
    if(errors.length > 0){
     
       res.render('register', {
         errors,
         name,
         email,
         password,
         password2
       });
    }else{
      
      //Validation Passed  now register a person
      User.findOne({email:email})
          .then(user => {
            errors.push({msg: 'Email is already register'});
              if(user){
                //User Exist
                res.render("register", {
                  errors,
                  name,
                  email,
                  password,
                  password2
                });
              }else{
                 const newUser = new User({
                    name,
                    email,
                    password
                 });
                 bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password,salt, (err, hash) => {
                   if(err) throw err;
                   //set password to hashed

                   newUser.password = hash;
                   //save user 
                   newUser.save()
                   .then(user => {
                     req.flash('success_msg', 'You are now registered and con log in');
                     res.redirect('/users/login');
                   })
                   .catch(err => console.log(err));

                 }));
                //  newUser.save();

                //  console.log(newUser);
                //  res.send(newUser);
              }
          });
    }

});  


//Login routes

router.post('/login', (req, res, next) => {
  passport.authenticate('local',{
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//logout Routes

router.get('/logout', (req, res) => {
   req.logout();
   req.flash('success_msg', 'You are logged out');
   res.redirect('/users/login');
});

module.exports = router;
