const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try{

        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.tokenData = decoded;
        next();

    }

    catch{

        return res.status(500).json({message: 'Auth Token is Invalid !'})

    }

}