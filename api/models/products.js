// Libraries

const db = require('mongoose');

// Schema

const productSchema = db.Schema({

    _id: db.Schema.Types.ObjectId,
    name: {type: String, required: true},
    description: {type: String},
    price: {type: Number, required: true},
    image: {type: String},
    visible: {type: Boolean, default: true},
    catagory: {type: String, default: 'uncatagorized'},
    timestamp: {type: Date, default: Date.now},
    stock: {type: Number, default: 0},
    sales: {type: Number, default: 0}

})

// Exports

module.exports = db.model('Product',productSchema);