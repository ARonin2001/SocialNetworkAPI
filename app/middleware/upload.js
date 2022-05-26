const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads/profile/ava/"));
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(10, (err, buf) => {
            if(err) {
                return err;
            }
            
            const hashName = buf.toString('hex') + path.extname(file.originalname);
            cb(null, `${Date.now()}-${hashName}`);
        })

    }
});

const imgFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, 
    fileFilter: imgFilter
});

module.exports = {upload};