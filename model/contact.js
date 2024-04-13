// MONGOOSE
const mongoose = require('mongoose');
//MODEL KONTAK
const Contact = mongoose.model('Contact', {
    nama: {
        type: String,
        required: true
    },
    noHP: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
})

module.exports = { Contact }