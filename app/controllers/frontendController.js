var express = require('express');
var router = express.Router();
var async = require("async");
var User = require('../models/user');
const path = require('path')
const multer = require('multer')



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



module.exports = router;