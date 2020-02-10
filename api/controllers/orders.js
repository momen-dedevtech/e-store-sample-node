const db = require('mongoose');

// Models

const Order = require('../models/orders');

exports.newOrder = async (req,res,next) => {

    try {
        const order = new Order({
            _id: new db.Types.ObjectId,
            _customerid: req.body._customerid,
            product: req.body.product

        })
        const savedOrder = await order.save();
        return res.status(201).json(savedOrder)
        
    } catch (error) {
        res.status(500).json({message: 'Unable to create Order !',detail: err})
        
    }

}

exports.getAllOrders = async (req,res,next) => {

    try {
        const listOrder = await Order.find().select('_customerid product timestamp price').exec();
        const mapped = listOrder.map((orders) => {
            return {_customerid: orders._customerid,
                    product: orders.product,
                    price: orders.price,
                    details: 'localhost:3000/orders/' + orders._id,
                    timestamp: orders.timestamp}

            })
            return res.status(200).json({found: listOrder.length,Orders: mapped})

    } catch (error) {
        return res.status(500).json({message: 'Unable to get Order List.',detail: err})
        
    }

}

exports.getOrders = async (req,res,next) => {

    try {
        const listOrder = await Order.find({visible : true}).select('_customerid product timestamp price').exec()
        const mapped = listOrder.map((orders) => {
            return {_customerid: orders._customerid,
                    product: orders.product,
                    price: orders.price,
                    details: 'localhost:3000/orders/' + orders._id,
                    timestamp: orders.timestamp}

            })
            return res.status(200).json({found: listOrder.length,Orders: mapped})

    } catch (error) {
        return res.status(500).json({message: 'Unable to get Order List.',detail: err
    
        })
        
    }

}

exports.filterOrders = async (req,res,next) => {

    try {
        if(req.params.filter === 'Pending') {
            const listOrder = await Order.find({status: 'Pending'}).select('_id _customerid status').exec();
            return res.status(200).json(listOrder);
    
        }
        if (req.params.filter === 'Cancelled') {
            const listOrder = await Order.find({status: 'Cancelled'}).select('_id _customerid status').exec();
            return res.status(200).json(listOrder)
        
        } 
        if (req.params.filter === 'Delivered') {
            const listOrder = await Order.find({status: 'Delivered'}).select('_id _customerid status').exec();
            return res.status(200).json(listOrder)
    
        }
        const listOrder = await Order.find({_id: req.params.filter, visible: true}).select('-__v -visible')
            .populate('product._productid', 'name').populate('_customerid','name').exec();
        const mapped = listOrder.map((orders) => {
            return {_id: orders._id,
                _customerid: orders._customerid,
                product: orders.product,
                address: orders.address,
                price: orders.price,
                timestamp: orders.timestamp,
                status: orders.status}

            })
            return res.status(200).json(mapped)

    } catch (error) {
        return res.status(500).json({error: 'Unable to find/filter products'})

    }

}

exports.delOrderFront = async (req,res,next) => {

    try {
        const updatedOrder = await Order.update({_id: req.params.id},{'visible':'false','status':'Cancelled'}).exec();
        if (updatedOrder.nModified >= 1) 
            return res.status(200).json({message: 'Order Deleted Successfully !'})
        return res.status(500).json({message: 'No Order with this id!'})
        
    } catch (error) {
        return res.status(500).json({message: 'Unable to Delete Order',detail: err})
        
    }

}

exports.delOrderBack = async (req,res,next) => {

    try {
        const delOrder = await Order.remove({_id: req.params.id}).exec();
        if(delOrder.deletedCount === 0)
            return res.status(500).json({message: 'Unable to del desired Order',})
        return res.status(200).json({message: 'Order Deleted from DB Successfully !',})
        
    } catch (error) {
        return res.status(500).json({message: 'Unable to Delete Order from DB',detail: err})
        
    }

}

exports.updateOrder = async (req,res,next) => {
    
    try {
        const updatedValue = {};
        for(const p of req.body){
            updatedValue[p.propName] = p.value;
    
        }
        const updatedOrder = await Order.update({_id: req.params.id},updatedValue).exec()
        if (updatedOrder.nModified >= 1) 
            return res.status(401).json({message: 'Order Updated Successfully.'})
        return res.status(500).json({ message: 'error in updating order' }) 
    
    } catch (error) {
        return res.status(500).json({error: 'Error in Updating order !',detail: err})

    }

}