// Libraries

const db = require('mongoose');

// Schema

const userSchema = db.Schema({

    _id: db.Schema.Types.ObjectId,
    fname: {type: String, required: true},
    lname: {type: String},
    email: {type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
    password: {type: String, required: true},
    image: {type: String},
    role:{type:String, default:'CUSTOMER'},
    orders: {type:Number,default:0},
    mobNo: {type:Number,required: true},
    address: {type:String},
    timestamp: {type: Date, default: Date.now}

})

// Exports

module.exports = db.model('User',userSchema);