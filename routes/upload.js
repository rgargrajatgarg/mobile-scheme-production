var express = require('express');
var router = express.Router();
var multer = require('multer');
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
    upload(req, res, (err) => {
      if (err) {
        res.sendStatus(500);
      }
      res.send(req.file);
    });
  });
module.exports = router;
