var express = require('express');
var router = express.Router();
var Feedback = require('../models/feedback');
var async = require("async");
var User = require('../models/user');
var Appointment = require('../models/appointment');
var Forum = require('../models/forum');
const path = require('path')
const multer = require('multer')


router.post('/appointment', (req, res) => {
    var appointment = new Appointment();
    appointment.name = req.body.name;
    appointment.petname = req.body.petname;
    appointment.phone = req.body.phone;
    appointment.email = req.body.email;
    appointment.date = req.body.date;
    appointment.time = req.body.time;
    appointment.message = req.body.message;


    console.log(appointment);
    appointment.save((err, doc) => {
        if (err) {
            res.send({ 'Success': 'Something is wrong' });
        } else {
            res.send({ "Success": 'We will call you soon' });
        }
    });
});
router.post('/contact', (req, res) => {
    res.header("allow-file-access-from-files", "*");
    var feedback = new Feedback();

    feedback.name = req.body.name;
    feedback.phone = req.body.phone;
    feedback.email = req.body.email;
    feedback.message = req.body.message;


    console.log(feedback);
    feedback.save((err, doc) => {
        if (err) {
            res.send({ 'Success': 'Something is wrong' });
        } else {
            res.send({ "Success": 'Your feedback successfully send. We will call you soon' });
        }
    });
});

//insert image
var TotalImage;
var storage = multer.diskStorage({
    destination: 'images',
    filename: function(req, file, callback) {
        const ext = path.extname(file.originalname);
        TotalImage = file.fieldname + Date.now() + ext;
        callback(null, TotalImage);
    }
});

var imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|PNG)$/)) {
        return cb(newError("You can upload only image files!!!"), false);
    } else {
        cb(null, true)
    }
}

var upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 99999999 }
});
router.post('/upload', upload.single('image'), (req, res) => {
    console.log("from----");
    console.log(TotalImage)
    console.log("to----");

    res.end(JSON.stringify({
        image: TotalImage
    }))
});

router.get('/forum', function(req, res) {
    Forum.find({}, function(err, forum) {
        res.json(forum);
    }).sort({ '_id': -1 });
});



module.exports = router;