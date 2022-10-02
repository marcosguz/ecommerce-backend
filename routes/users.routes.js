const express = require('express');

// Controllers
const {
	createUser,
	updateUser,
	deleteUser,
	login,
	getAllProducts,
	getAllOrders,
	getOrdersId,
} = require('../controllers/users.controller');

// Middlewares
const { userExists } = require('../middlewares/users.middlewares');
const { orderExists } = require('../middlewares/orders.middlewares');
const {
	protectSession,
	protectUsersAccount,
	protectAdmin,
} = require('../middlewares/auth.middlewares');
const {
	createUserValidators,
} = require('../middlewares/validators.middlewares');

const usersRouter = express.Router();

usersRouter.post('/', createUserValidators, createUser);

usersRouter.post('/login', login);

// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.get('/me', getAllProducts)

usersRouter.get('/orders', getAllOrders)

usersRouter.get('/orders/:id', orderExists, getOrdersId)

usersRouter.patch('/:id', userExists, protectUsersAccount, updateUser);

usersRouter.delete('/:id', userExists, protectUsersAccount, deleteUser);

module.exports = { usersRouter };
