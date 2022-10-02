const express = require('express')

// Controllers
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllCategories,
    createCategorie,
    updateCategorie
} = require('../controllers/products.controller')

// Middlewares
const { protectSession, protectProductOwners } = require('../middlewares/auth.middlewares')
const { createProductsValidators } = require('../middlewares/validators.middlewares')
const { productExists } = require('../middlewares/products.middlewares')

// Utils
const { upload } = require('../utils/multer.util')

const productRouter = express.Router()

productRouter.get('/', getAllProducts)

productRouter.get('/:id', productExists, getProductById)

productRouter.get('/categories', getAllCategories)

productRouter.use(protectSession)

productRouter.post('/', upload.array('productImg', 5), createProductsValidators, productExists, createProduct)

productRouter.patch('/:id', productExists, protectProductOwners, updateProduct)

productRouter.delete('/:id', productExists, protectProductOwners, deleteProduct)

productRouter.post('/categories', createCategorie)

productRouter.patch('/categories/:id', updateCategorie)

module.exports = { productRouter }