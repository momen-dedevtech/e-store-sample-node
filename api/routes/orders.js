// Libraries

const express = require('express');

// Middlewares

const checkAuth = require('../middleware/chechAuth');
const checkUser = require('../middleware/checkUser');

// Controllersd

const orderControl = require('../controllers/orders');

// Initialization

const router = express.Router();

router.post('/',checkAuth,checkUser("CUSTOMER"),orderControl.newOrder)
router.get('/db',checkAuth,checkUser("ADMIN"),orderControl.getAllOrders)
router.get('/',checkAuth,checkUser("MANAGER,ADMIN"),orderControl.getOrders)
router.get('/:filter',checkAuth,checkUser("MANAGER,ADMIN"),orderControl.filterOrders)
router.put('/:id',checkAuth,checkUser("MANAGER,ADMIN"),orderControl.updateOrder)
router.delete('/:id',checkAuth,checkUser("CUSTOMER,ADMIN"),orderControl.delOrderFront)
router.delete('/db/:id',checkAuth,checkUser("ADMIN"),orderControl.delOrderBack)

module.exports = router;