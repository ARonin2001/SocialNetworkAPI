const mongoose = require('mongoose');
const Country = mongoose.model('Country');

// get countryies
const getCountries = (req, res) => {
	Country.find()
		.then(countryies => res.status(200).json(countryies))
		.catch(err => res.status(400).json(err.message));
}

module.exports = {
    getCountries
}
