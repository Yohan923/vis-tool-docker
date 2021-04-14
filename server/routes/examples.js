var express = require('express');
var router = express.Router();
var path = require('path');


router.get('/tool/:toolName/file/:fileName', function(req, res, next) {
    console.log(req.params)
    res.sendFile(path.join(process.cwd(), './tools', req.params.toolName, 'examples', req.params.fileName))
});

module.exports = router;