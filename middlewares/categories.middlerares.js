// Model
const { Categories } = require('../models/categories.models')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

const categoriesExists = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const categories = await Categories.findOne({ where: { id } })

    if (!categories) {
        return next(new AppError('Categorie not exists', 404))
    }

    req.categories = categories
    next()
})

module.exports = { categoriesExists }