// Libraries

const express = require('express');
const exFile = require('multer');

// Middlewares

const checkAuth = require('../middleware/chechAuth');
const checkUser = require('../middleware/checkUser');

// Controllers

const userControl = require('../controllers/users');

// Multer Configurations

const storageOptions = exFile.diskStorage({

    destination: (req, file, cb) => {

        cb(null,'./uploads/users');

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

router.post('/signup', upload.single('userImage'), userControl.signup)
router.post('/login', userControl.login)
router.get('/',checkAuth, checkUser("MANAGER,ADMIN"), userControl.getAllUsers)
router.get('/:filter',checkAuth, checkUser("MANAGER,ADMIN,CUSTOMER"), userControl.filterUsers)
router.put('/:id',checkAuth, checkUser("ADMIN"), userControl.updateById)
router.delete('/:id',checkAuth, checkUser("ADMIN"), userControl.delById)

module.exports = router;