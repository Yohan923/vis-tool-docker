var express = require('express');
var router = express.Router();
var multer  = require('multer');
var path = require('path');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './tmp/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
  })
  
var upload = multer({ storage: storage })


/* POST a file. */
router.post('/', upload.single('file'), function(req, res, next) {
    console.log(req.file, req.body)

    var exec = require('child_process').exec, child;

    var result_path = './tmp/results/' + req.file.filename + '.dot'

    console.log('pifra -o ' + result_path + ' ' + req.file.path)
    child = exec('pifra -o ' + result_path + ' ' + req.file.path,
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            res.sendFile(path.join(process.cwd(), result_path))
        });
});


module.exports = router;
