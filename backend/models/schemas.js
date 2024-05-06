const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contactSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    entryDate: { type: Date, default: Date.now },
    code: { type: String }
});



const Contact = mongoose.model('Contact', contactSchema, 'contact_form')
const mySchemas = {'Contact':Contact}

module.exports = mySchemas

