const mongoose = require('mongoose');
const Language = mongoose.model('Language');

// get all the languages in original name
const getAllLanguagesInOriginalName = (req, res) => {
    Language.find({}, {name: 1})
        .exec()
        .then(language => res.status(200).json({languages: language}))
        .catch(err => res.status(404).json({message: err}))
};

module.exports = {
    getAllLanguagesInOriginalName,
}
