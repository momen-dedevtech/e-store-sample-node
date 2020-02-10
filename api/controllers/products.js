const db = require('mongoose');

// Models

const Product = require('../models/products');

exports.newProduct = async (req,res,next) => {

    try {
        const product = new Product({

            _id: new db.Types.ObjectId(),
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.file.path,
            catagory: req.body.catagory,
            stock: req.body.stock 
    
        });
        const newProduct = await product.save();
        return res.status(201).json({message: 'New Product Added !'})
    
    } catch (error) {
        return res.status(500).json({error: error})   

    }
   
}

exports.getAllProducts = async (req,res,next) => {

    try {
        const listProducts = await Product.find().select('catagory name price stock timestamp').exec();
        const mapped = listProducts.map((products) => {

            return {name: products.name,
                    catagory: products.catagory,
                    price: products.price,
                    stock: products.stock,
                    details: 'localhost:3000/products/' + products._id,
                    timestamp: products.timestamp}

            })
        return res.status(200).json({found: listProducts.length,Products: mapped});
        
    } catch (error) {
        return res.status(500).json({error: 'Unable to get all Products List !',detail: err});

        
    }

}

exports.getProducts = async (req,res,next) => {

    try {
        const listProducts = await Product.find({visible: true}).select('catagory stock name price timestamp').exec();
        const mapped = listProducts.map((products) => {

            return {name: products.name,
                    catagory: products.catagory,
                    price: products.price,
                    stock: products.stock,
                    details: 'localhost:3000/products/' + products._id,
                    timestamp: products.timestamp}

            });
            res.status(200).json({found: listProducts.length, Products: mapped});        

    } catch (error) {
        return res.status(500).json({error: 'Unable to get all Products List !',detail: err});

    }

}

exports.filterProducts = async (req,res,next) => {

    try {
        if(req.params.filter === 'top') {
            const listProduct = await Product.find().sort({sales : -1}).limit(3).select('name _id sales stock').exec();
            return res.status(200).json(listProduct);
    
        }
        if (req.params.filter === 'outOfStock') {
            const listProduct = await Product.find({stock: { $lte : 3 }}).select('name _id sales stock').exec()
            return res.status(200).json(listProduct)
    
        }
        const listProduct = await Product.find({_id: req.params.filter, visible: true}).select('-__v -visible').exec();
        const mapped = listProduct.map((products) => {
            return {
                _id: products._id,
                name: products.name,
                description: products.description,
                catagory: products.catagory,
                image: products.image,
                price: products.price,
                stock: products.stock,
                sales: products.sales,
                timestamp: products.timestamp}
    
            })
        return res.status(200).json(mapped)
        
    } catch (error) {
        return res.status(404).json({error: 'No record Found !'})

    }

}

exports.updateProduct = async (req,res,next) => {
    
    try {
        const updatedValue = {};
        for(const p of req.body){
            updatedValue[p.propName] = p.value;
    
        }
        const updatedProduct = await Product.update({_id: req.params.id},updatedValue).exec()
        if (updatedProduct.nModified >= 1) 
            return res.status(401).json({message: 'Product Updated Successfully.'})
        return res.status(500).json({ message: 'error in updating product' }) 
    
    } catch (error) {
        return res.status(500).json({error: 'Error in Updating Product !',detail: err})

    }

}

exports.delProductFront = async (req,res,next) => {
    
    try {
        const updatedProduct = await Product.update({_id: req.params.id},{'visible':'false'}).exec()
        if (updatedProduct.nModified >= 1) 
            return res.status(401).json({message: 'Product Deleted Successfully.'})
        return res.status(500).json({ message: 'Not found' }) 

        
    } catch (error) {
        return res.status(500).json({message: 'Unable to Delete Product',detail: err})
        
    }

}

exports.delProductBack = async (req,res,next) => {

    try {
        const delProduct = await Product.remove({_id: req.params.id}).exec()
        if(delProduct.deletedCount === 0)
            return res.status(500).json({message: 'Product not existed'})    
        return res.status(200).json({message: 'Product Deleted from DB Successfully !',})

    } catch (error) {
        return res.status(500).json({message: 'Unable to Delete Product from DB',detail: err})

    }

}