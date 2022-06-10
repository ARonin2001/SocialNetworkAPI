const mongoose = require('mongoose');

const CountrySchema = mongoose.Schema(
    {
        "country": [String]
    }
);

mongoose.model('Country', CountrySchema);