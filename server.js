// Libraries

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Routes

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

// Initializations

const port = process.env.PORT || 3000;
mongoose.connect(`mongodb+srv://KaKa:${process.env.MONGO_DB_PASS}@test-store-api-db-vb7to.mongodb.net/test?retryWrites=true&w=majority`,{useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex: true}, (err, db) => {
    if (err) {
        console.log(err)
    }
    else console.log(`Database connected successfully `)
});
const server = express();

// Middlewares

server.use(morgan('dev'));
server.use(bodyParser.urlencoded({extended:false}));
server.use(bodyParser.json());

// CODS Error Handling

server.use((req,res,next) => {

    res.header('Access-Control-Access-Origin','*');
    res.header('Access-Control-Access-Headers','*');

    if(req.method === 'OPTIONS'){

        res.header('Access-Control-Access-Methods','PUT GET POST DELETE');
        res.status(200).json({});

    }

    next();

});

// Routes

server.use('/uploads/products',express.static('./uploads/products'))
server.use('/uploads/users',express.static('./uploads/users'))
server.use('/products',productRoutes);
server.use('/orders',orderRoutes);
server.use('/users',userRoutes);

// Erorr Handling

server.use((req,res,next) => {

    const error = new Error('Not Found !');
    error.status = 404;
    next(error);

})

server.use((error, req,res,next) => {

    res.status(500 || error.status).json({Error: error.message});

})

// Starting Server

server.listen(port, () => {

    console.log(`Starting Services on Port ${port} !`);

});
