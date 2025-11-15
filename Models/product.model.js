const mongoose = require('mongoose');

//Variant 
const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: String,
    storage: String,
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    Images: [String],
});

// Product
const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    brand:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    specs:{
        type: Object,
    },
    variants:[variantSchema],
}, {
    timestamps: true 

});

module.exports = mongoose.model('Product', productSchema);
