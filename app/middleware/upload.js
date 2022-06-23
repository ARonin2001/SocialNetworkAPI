const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

class Storage {
    constructor(pathImgUpload) {
        this.pathImg = pathImgUpload;
    }

    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, this.pathImg));
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

    imgFilter = (req, file, cb) => {
        if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(null, false)
        }
    };

    getUpload = () => {
        return multer({
            storage: this.storage, 
            fileFilter: this.imgFilter
        });
    };

    // upload = multer({
    //     storage: storage, 
    //     fileFilter: imgFilter
    // });

}


module.exports = {Storage};