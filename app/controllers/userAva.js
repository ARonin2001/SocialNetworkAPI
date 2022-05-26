const mongoose = require('mongoose');
const User = mongoose.model('User');

const uploadImage = (req, res) => {
    if(req.file && req.params.userId) {
        const pathImg = "/profile/ava/" + req.file.filename;
        // const pathImg = req.file.path.slice()

        User.updateOne({_id: req.params.userId}, {img: {ava: pathImg}})
            .exec()
            .then((ava) => res.status(200).json({imgPath: pathImg}))
            .catch(err => res.status(400).json({message: "Ava img is not updated"}))
    } else {
        res.status(404).json({message: "File or user id is empty"});
    }
};

const getAvaByUserId = (req, res) => {
    if(req.params.userId) {
        User.findOne({_id: req.params.userId}, {_id: 0, "img.ava": 1})
            .exec()
            .then(ava => res.status(200).json({ava: ava.img.ava}))
            .catch(err => res.status(400).json({message: "Ava not found"}))
    } else {
        res.status(404).json({message: "User id is empty"});
    }
}

module.exports = {
    uploadImage,
    getAvaByUserId
};