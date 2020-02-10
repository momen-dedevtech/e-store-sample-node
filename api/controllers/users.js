const db = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

const checkAuth = require('../middleware/chechAuth');
const checkUser = require('../middleware/checkUser');

exports.signup = async (req, res, next) => {

    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const matchedUser = await User.find({ email: req.body.email }).exec();
        if (matchedUser.length) {
            return res.status(409).json({message: `Email already exists`})

        }
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.tokenData = decoded;
    if (req.body.role === 'ADMIN' || req.body.role === 'MANAGER'){
        if(req.tokenData.role === 'ADMIN'){
            const user = new User({
                _id: new db.Types.ObjectId(),
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                password: hash,
                mobNo: req.body.mobNo,
                image: req.file.path,
                role: req.body.role,
                address: req.body.address
    
            })
            const newUser = await user.save()
            return res.status(201).json({message: 'Super Account created !'})
        } else return res.status(500).json({message: 'Admin Account needed !'})

    }
        const user = new User({
            _id: new db.Types.ObjectId(),
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: hash,
            mobNo: req.body.mobNo,
            image: req.file.path,
            role: req.body.role,
            address: req.body.address

        })
        const result1 = await user.save()
        return res.status(201).json({message: 'Account created !'})
    
    } catch (error) {
        return res.status(500).json({error : error})

    }            
}

exports.login = async (req, res, next) => {

    try {
        const listUser = await User.find({ email: req.body.email }).exec();
        if(listUser.length >= 1){
            bcrypt.compare(req.body.password, listUser[0].password, (err, same) => {

                if (same) {
                    const token = jwt.sign({ email: listUser[0].email, fname: listUser[0].fname, role: listUser[0].role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                    res.status(200).json({ message: 'Login Successfully !', token: token })

                } else res.status(500).json({ message: 'Invalid password !' })

            });

        }        

    } catch (error) {
        return res.status(500).json({error: 'Invalid email or password !'});
        
    }

}

exports.getAllUsers = async (req, res, next) => {

    try {
        const listUser = await User.find().select('email fname role timestamp').exec();
        const mapped = listUser.map((users) => {

            return {
                fname: users.fname,
                email: users.email,
                role: users.role,
                details: 'localhost:3000/users/' + users._id,
                timestamp: users.timestamp
            }

        })
        res.status(200).json({found: listUser.length,Users: mapped})
        
    } catch (error) {
        res.status(500).json({error: 'Unable to get all users List !',detail: err})
        
    }

}

exports.filterUsers = async (req, res, next) => {

    try {
        if (req.params.filter === 'top') {
            const listUser = await User.find().sort({ orders: -1 }).limit(3).select('fname _id orders').exec();
            return res.status(200).json(listUser)

        }
        const listUser = await User.find({ _id: req.params.filter }).select('-__v').exec();
        const mapped = listUser.map((users) => {

            return {
                _id: users._id,
                fname: users.fname,
                lname: users.lname,
                email: users.email,
                password: users.password,
                mobNo: users.mobNo,
                image: users.image,
                role: users.role,
                orders: users.orders,
                timestamp: users.timestamp
            }

        })
        return res.status(200).json(mapped)

        
    } catch (error) {
        return res.status(500).json({error: 'No Record Found'})

    }


}

exports.updateById = async (req, res, next) => {

    try {
        const updatedValue = {};
        for (const p of req.body) {
            if(p.propName === 'password') {
                const hash = await bcrypt.hash(p.value,10);
                updatedValue[p.propName] = hash;

            } else updatedValue[p.propName] = p.value;
    
        }
        const updatedUser = await User.update({ _id: req.params.id }, updatedValue).exec()
        if (updatedUser.nModified >= 1) 
            return res.status(401).json({message: 'User Information has been Updated Successfully.'})
        return res.status(500).json({ message: 'Invalid String' })
        
    } catch (error) {
        res.status(500).json({error: 'Error in Updating User Information !',detail: err})
    
    }

}

exports.delById = async (req, res, next) => {

    try {
        const delUser = await User.remove({ _id: req.params.id }).exec()
        if(delUser.deletedCount === 0)
            return res.status(500).json({message: 'User not existed'})    
        return res.status(200).json({message: 'User Deleted from DB Successfully !',})

    } catch (error) {
        return res.status(500).json({message: 'Unable to Delete User from DB',detail: err})
        
    }

}
