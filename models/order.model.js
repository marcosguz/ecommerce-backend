const { db, DataTypes } = require('../utils/database.util')

const Order = db.define('orders', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: 'active',
    }
})

module.exports = { Order }