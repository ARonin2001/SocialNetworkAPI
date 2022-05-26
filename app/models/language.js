const mongoose = require('mongoose');

const LanguageSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        native: String
    }
);

mongoose.model('Language', LanguageSchema);