const mongoose = require('mongoose')
const { Schema } = mongoose;


const stockSchema = new Schema({
    stockName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },

});
module.exports = mongoose.model('stock',stockSchema)