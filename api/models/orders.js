// Libraries

const db = require('mongoose');

// Schema

const orderSchema = db.Schema({

    _id: db.Schema.Types.ObjectId,
    _customerid: {type: db.Schema.Types.ObjectId, required: true, ref: 'User'},
    product: [{
                _productid: { type: db.Schema.Types.ObjectId, ref: 'Product'}, 
                quantity: { type: Number, default: 1 },
                _id : false
            }],
    price: {type: Number, default: 0},
    visible: {type: Boolean, default: true},
    timestamp: {type: Date, default: Date.now},
    address: {type:String},
    status: {type: String, default: 'Pending'}

})

// Exports

module.exports = db.model('Order',orderSchema);