const express = require('express');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
require('./app/models');
const config = require('./config');

const app = express();
config.express(app);
config.routes(app);

const {appPort, mongoUri} = config.app;

mongoose.connect(mongoUri)
    .then(() => app.listen(
        appPort, 
        () => console.log(`Listening on port: ${appPort}...`))   
    )
    .catch(err => console.error(`Error connection to mongo: ${mongoUri}`, err));

const conn = mongoose.createConnection(mongoUri);

let gfs;
let GridFsBucket;


conn.once('open', () => {
    GridFsBucket = new mongodb.GridFSBucket(conn.db, {
        bucketName: 'images'
    });

    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('images');
});

// Create storage engine
const storage = new GridFsStorage({
    url: mongoUri,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'images'
          };
          resolve(fileInfo);
        });
      });
    }
  }); 
const upload = multer({ storage });

app.post('/upload', upload.single('avatar'), (req, res) => {
    res.json({file: req.file});
});

app.get('/image/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if(!file || file.length === 0) {
            return res.status(404).json({message: "No file exists"});
        }

        // Check if image is exist
        if(file.contentType === "image/jpeg" || file.contentType === "img/png") {
            // Read output to browser
            // const readstream = gfs.createReadStream(file.filename);
            const readstream = GridFsBucket.openDownloadStream(file._id);
            readstream.pipe(res);
        } else {
            res.status(404).json({message: 'Not an (jpep/png) image'})
        }
    })
});



