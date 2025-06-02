const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');
const roleCheck = require('../middlewares/roleCheck');

router.patch('/:id/role', verifyToken, roleCheck(['admin']), userController.updateRole);

module.exports = router;
