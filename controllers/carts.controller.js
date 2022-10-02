// Models
const { Carts } = require("../models/carts.models");
const { ProductsInCart } = require('../models/productsInCart.model');
const { AppError } = require("../utils/appError.util");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");

const addProduct = catchAsync(async (req, res, next) => { })

const updateCart = catchAsync(async (req, res, next) => {
    const { quantity } = req.body
    const { cart, sessionUser, productInCart } = req

    if (cart.userId === sessionUser.userId) {
        if (quantity === 0) {
            await productInCart.update({ status: 'removed' })
        } else if (quantity !== 0) {
            await productInCart.update({ status: 'active' })
        }
    }

    res.status(200).json({
        status: 'success',
        data: { cart }
    })

})

const deleteProduct = catchAsync(async (req, res, next) => {
    const { product, productInCart } = req
    const id = product.id

    const productRemove = await ProductsInCart.findOne({ where: { id } })

    if (!productRemove) return next(new AppError('The product to be deleted does not exits', 404))

    await productInCart.update({ quantity: 0, status: 'removed' })

    res.status(200).json({
        status: 'success'
    })

})

const purchase = catchAsync(async (req, res, next) => {

})

module.exports = {
    addProduct,
    updateCart,
    deleteProduct,
    purchase
}