var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var app = express();

router.post('/authenticate', function(req, res) {
    var response = res;
    console.log(req.body);
    // find the user
    User.findOne({
        email: req.body.email
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ Success: 'false', message: 'Authentication failed. User not found.' });
        } else if (user) {

            if (user.user_status == "Banned") {
                res.send({ Success: 'false', message: "You are Banned by Admin" }); // send response to ajax call to view
            } else {

                bcrypt.compare(req.body.password, user.password, function(err, res) {
                    if (res) {
                        // Passwords match

                        // if user is found and password is right
                        // create a token
                        var payload = {
                            admin: user.admin
                        }
                        var token = jwt.sign(payload, "secretmessage", {
                            expiresIn: 86400 // expires in 24 hours
                        });

                        response.json({
                            Success: 'Success!',
                            message: 'Welcome ' + user.username,
                            token: token,
                            username: user.username,
                            _id: user._id,
                            admin: user.admin
                        });
                    } else {
                        // Passwords don't match
                        response.json({ Success: 'false', message: 'Authentication failed. Wrong password.' });
                    }
                });
            }

        }

    });
});
router.post('/signup', function(req, res, next) {
    console.log(req.body);
    var personInfo = req.body;

    // Validate if the user enter email, username, password and confirm password
    if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
        res.send({ "Success": "Fill all the input fields" });
    } else {
        // validate if the password and confirm password is same or not
        if (personInfo.password == personInfo.passwordConf) {

            // find the email if the email in table
            User.findOne({ email: personInfo.email }, function(err, data) {

                // if the email is not already taken
                if (!data) {
                    var c;
                    // find the last user and take unique_id from that to variable c for new user
                    User.findOne({}, function(err, data) {

                        var hashpassword = bcrypt.hashSync(personInfo.password, 10);
                        //Initialize the user Model object with variable or value from the post form
                        var newPerson = new User({
                            email: personInfo.email,
                            username: personInfo.username,
                            image: personInfo.image,
                            password: hashpassword,
                            passwordConf: hashpassword,
                            admin: false
                        });

                        // Save it to table User
                        newPerson.save(function(err, Person) {
                            if (err)
                                console.log(err);
                            else
                                console.log('Success');
                        });

                    }).sort({ _id: -1 }).limit(1);
                    res.send({ "Success": "You are regestered,You can login now." }); // send response to ajax call to view
                } else {
                    res.send({ "Success": "Email is already used." }); // send response to ajax call to view
                }

            });
        } else {
            res.send({ "Success": "password is not matched" }); // send response to ajax call to view
        }
    }
});
// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------


router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, "secretmessage", function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }

});


module.exports = router;