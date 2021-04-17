var processDot = require('../utils/processDot')
var express = require('express');
var router = express.Router();
var multer  = require('multer');
var path = require('path');
var fs = require('fs');
var execFile = require('child_process').execFile;
var upload = multer();

const config = require('../config');
const parseOptions = require('../utils/parseOptions');


router.post('/tool/:toolName', upload.none(), function(req, res, next) {

    var toolName = req.params.toolName
    var toolOptions = JSON.parse(req.body.options)
    console.log(toolOptions)

    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9)
    var filePath = path.join(process.cwd(), './tools/', toolName, 'temp', 'uploads', uniqueName);
    fs.writeFile(filePath, req.body.text, console.log);

    var resultPath = path.join(process.cwd(), './tools/', toolName, 'temp', 'results', uniqueName)

    console.log(parseOptions(toolName, filePath, resultPath, toolOptions))
    child = execFile('pifra', parseOptions(toolName, filePath, resultPath, toolOptions),
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            fs.readFile(resultPath, 'utf8', function(err, data){ 
                if (!data) return
                var d = data.replace(/⊢[\r\n ]*/g, '⊢\\n')
                console.log(d)
                res.send(processDot(d))
            }); 
            
        });
});


module.exports = router;