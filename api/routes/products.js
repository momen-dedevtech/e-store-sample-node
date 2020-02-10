// Libraries

const express = require('express');
const exFile = require('multer');

// Middlewares

const checkAuth = require('../middleware/chechAuth');
const checkUser = require('../middleware/checkUser');

//Controllers

const productControl = require('../controllers/products');

// External Uploads Configurations

const storageOptions = exFile.diskStorage({

    destination: (req, file, cb) => {

        cb(null,'./uploads/products');

    },

    filename: (req,file,cb) => {

        cb(null, Date.now() + '-' + file.originalname);

    }

})

const filter = (req, file, cb) => {

    if(file.mimetype === 'image/jpeg') cb(null,true);
    else cb(new Error('Invalid File Format !'),false);    

}

// Initialization

const router = express.Router();
const upload = exFile({storage: storageOptions, limits:{fileSize: 1024 * 1024 * 1}, fileFilter: filter})

router.post('/',checkAuth, checkUser("MANAGER,ADMIN"), upload.single('productImage'), productControl.newProduct)
router.get('/db',checkAuth, checkUser("ADMIN"), productControl.getAllProducts)
router.get('/',productControl.getProducts)
router.get('/:filter',productControl.filterProducts)
router.put('/:id',checkAuth,checkUser("MANAGER,ADMIN"),productControl.updateProduct)
router.delete('/:id',checkAuth,checkUser("MANAGER,ADMIN"),productControl.delProductFront)
router.delete('/db/:id',checkAuth,checkUser("ADMIN"),productControl.delProductBack)

module.exports = router;