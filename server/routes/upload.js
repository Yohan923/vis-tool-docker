const { execFile } = require('child_process');
var express = require('express');
var router = express.Router();
var uploadFile = require('./uploadFile');
var uploadText = require('./uploadText');

//router.use('/file', uploadFile)
router.use('/text', uploadText)

router.use(function (err, req, res, next) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('404')
    }
  });

module.exports = router;
