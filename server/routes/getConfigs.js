var express = require('express');
var router = express.Router();
var parseConfigs = require('../utils/parseConfigs')


router.get('/', function(req, res, next) {
    var c = parseConfigs.getUIConfigs()
    console.log(c)
    res.json(c)
});

router.use(function (err, req, res, next) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('404')
    }
  });


module.exports = router;