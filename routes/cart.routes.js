const express = require('express')

// COntrollers
const {
    addProduct,
    updateCart,
    deleteProduct,
    purchase
} = require('../controllers/carts.controller')

const cartsRouters = express.Router()

module.exports = { cartsRouters }