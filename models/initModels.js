// Models
const { Carts } = require('./carts.models')
const { Categories } = require('./categories.models')
const { Order } = require('./order.model')
const { Product } = require('./product.models')
const { ProductImage } = require('./productImgs.model')
const { ProductsInCart } = require('./productsInCart.model')
const { User } = require('./user.model');

const initModels = () => {
    User.hasMany(Order, { foreignKey: 'userId' })
    Order.belongsTo(User)

    User.hasOne(Carts, { foreignKey: 'userId' })
    Carts.belongsTo(User)

    Carts.hasOne(Order, { foreignKey: 'orderId' })

    Carts.hasMany(ProductsInCart, { foreignKey: 'cartId' })
    ProductsInCart.belongsTo(Carts)

    Product.hasOne(ProductsInCart, { foreignKey: 'productId' })
    ProductsInCart.belongsTo(Product)

    Product.hasMany(ProductImage, { foreignKey: 'productId' })
    ProductImage.belongsTo(Product)

    Categories.hasMany(Product, { foreignKey: 'productId' })
    Product.belongsTo(Categories)
};

module.exports = { initModels };
