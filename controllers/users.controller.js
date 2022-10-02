const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { ProductsInCart } = require('../models/productsInCart.model')
const { Product } = require('../models/product.models')
const { Order } = require('../models/order.model')
const { Carts } = require('../models/carts.models')

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

// Preguntar
const getAllProducts = catchAsync(async (req, res, next) => {
	const { sessionUser } = req
	const id = sessionUser.id

	const produts = await User.findAll({
		where: { status: 'active', id },
		attributes: ['title', 'description', 'quantity', 'price', 'categoryId', 'userId', 'status']
	})

	res.status(200).json({
		status: 'success',
		data: { produts }
	})
})

// Preguntar
const getAllOrders = catchAsync(async (req, res, next) => {
	const { sessionUser } = req
	const id = sessionUser.id

	const orders = await Order.findAll({
		where: { id },
		attributes: ['userId', 'cartId', 'totalPrice', 'status'],
		include: [
			{
				model: Carts,
				required: false,
				where: { status: 'purchased' },
				attributes: ['userId', 'status'],
				include: [
					{
						model: ProductsInCart,
						required: false,
						where: { status: 'purchased' },
						attributes: ['cartId', 'userId', 'quatity', 'status'],
					}
				]
			}
		]
	})

	res.status(200).json({
		status: 'success',
		data: { orders }
	})
})

const getOrdersId = catchAsync(async (req, res, next) => {
	const { order } = req
	const id = order.id

	const orderId = await Order.findOne({
		where: { status: 'active', id },
		attributes: ['userId', 'cartId', 'totalPrice', 'status'],
		include: [
			{
				model: Carts,
				required: false,
				where: { status: 'purchased' },
				attributes: ['userId', 'status'],
				include: [
					{
						model: ProductsInCart,
						required: false,
						where: { status: 'purchased' },
						attributes: ['cartId', 'userId', 'quatity', 'status'],
					}
				]
			}
		]
	})

	res.status(200).json({
		status: 'success',
		data: { orderId }
	})
})

const createUser = catchAsync(async (req, res, next) => {
	const { username, email, password, role } = req.body;

	// Encrypt the password
	const salt = await bcrypt.genSalt(12);
	const hashedPassword = await bcrypt.hash(password, salt);

	const newUser = await User.create({
		username,
		email,
		password: hashedPassword,
		role,
	});

	// Remove password from response
	newUser.password = undefined;

	// 201 -> Success and a resource has been created
	res.status(201).json({
		status: 'success',
		data: { newUser },
	});
});

const updateUser = catchAsync(async (req, res, next) => {
	const { username, email } = req.body;
	const { user } = req;

	await user.update({ username, email });

	res.status(200).json({
		status: 'success',
		data: { user },
	});
});

const deleteUser = catchAsync(async (req, res, next) => {
	const { user } = req;

	await user.update({ status: 'deleted' });

	res.status(204).json({ status: 'success' });
});

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	const user = await User.findOne({
		where: { email, status: 'active' },
	});

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return next(new AppError('Wrong credentials', 400));
	}

	user.password = undefined;

	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});

	res.status(200).json({
		status: 'success',
		data: { user, token },
	});
});

module.exports = {
	getAllOrders,
	getOrdersId,
	getAllProducts,
	createUser,
	updateUser,
	deleteUser,
	login,
};
