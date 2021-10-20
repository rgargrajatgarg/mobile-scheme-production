var express = require('express');
var router = express.Router();
var multer = require('multer');
const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' +file.originalname)
    }
  })
  
  const upload = multer({ storage: storage }).single('file');
router.post('/', (req, res) => {
  console.log('uploadingfile');
  console.log(req.file);
  const fileContent = fs.readFileSync(req.files.file);
  const params = {
    Bucket: 'mobile-scheme',
    Key: 'test.jpg',
    Body: fileContent
   };
   s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
   });
    // upload(req, res, (err) => {
    //   if (err) {
    //     res.sendStatus(500);
    //   }
    //   res.send(req.file);
    // });
  });
module.exports = router;
