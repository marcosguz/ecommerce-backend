// Model
const { Order } = require('../models/order.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

const orderExists = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const order = await Order.findOne({ where: { id } })

    if (!order) {
        return next(new AppError('Order not exist', 404))
    }

    req.order = order
    next()
})

module.exports = { orderExists }