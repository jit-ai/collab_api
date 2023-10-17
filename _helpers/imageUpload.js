const multer = require('multer');
const util = require("util");
const path = require('path');
const maxSize = 2 * 1024 * 1024;
// handle storage using multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
       cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
 });
//  var upload = multer({ storage: storage });
let upload = multer({
   storage: storage
 }).single("file");
 
 // create the exported middleware object
 let uploadFileMiddleware = util.promisify(upload);

 module.exports = uploadFileMiddleware;