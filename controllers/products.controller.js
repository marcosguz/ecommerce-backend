const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");


// Models
const { Product } = require('../models/product.models')
const { ProductImage } = require('../models/productImgs.model')
const { Categories } = require('../models/categories.models')
const { User } = require('../models/user.model')
const { Carts } = require("../models/carts.models");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require('../utils/appError.util')
const { uploadProductImgs, getProductsImgsUrls } = require('../utils/firebase.util');

dotenv.config({ path: './config.env' })

const getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.findAll({
        where: { status: 'active' },
        attributes: [
            'id',
            'title',
            'description',
            'quantity',
            'price',
            'categoryId',
            'userId',
            'status'
        ],
        include: [
            {
                model: Carts,
                attributes: ['id', 'status'],
                include: {
                    model: Product
                }
            },
            {
                model: ProductImage
            }
        ]
    })

    const productWithImgs = await getProductsImgsUrls(products)

    res.status(200).json({
        status: 'success',
        data: { products: productWithImgs }
    })
})

const getProductById = catchAsync(async (req, res, next) => {
    const { product } = req
    const id = product.id

    const productId = await Product.findOne({
        where: { status: 'active', id },
        include: [
            {
                model: Product,
                required: false,
                where: { status: 'active' }
            }
        ]
    })

    res.status(201).json({
        status: 'success',
        productId
    })
})

const createProduct = catchAsync(async (req, res, next) => {
    const { title, description, price, categoryId, quantity } = req.body
    const { sessionUser } = req

    const newProduct = await Product.create({
        title,
        description,
        price,
        categoryId,
        quantity,
        userId: sessionUser.id
    })

    await uploadProductImgs(req.files, newProduct.id)

    res.status(201).json({
        status: 'success',
        data: { newProduct }
    })

})

const updateProduct = catchAsync(async (req, res, next) => {
    const { title, description, price, quantity } = req.body
    const { product } = req

    await product.update({ title, description, price, quantity })

    res.status(200).json({
        status: 'success',
        data: { product }
    })

})

const deleteProduct = catchAsync(async (req, res, next) => {
    const { product } = req

    await product.update({ status: 'deleted' })

    res.status(200).json({
        status: 'success'
    })
})

const getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await Categories.findAll({
        where: { status: 'active' },
        attributes: ['id', 'name', 'status']
    })

    res.status(200).json({
        status: 'success',
        data: { categories }
    })
})

const createCategorie = catchAsync(async (req, res, next) => {
    const { name } = req.body

    const newCategory = await Categories.create({ name })

    res.status(201).json({
        status: 'success',
        data: { newCategory }
    })
})

const updateCategorie = catchAsync(async (req, res, next) => {
    const { name } = req.body
    const { categorie } = req

    await categorie.update({ name })

    res.status(200).json({
        status: 'success',
        data: { categorie }
    })
})

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllCategories,
    createCategorie,
    updateCategorie,
}