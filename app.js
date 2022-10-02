const express = require('express');

// Routers
const { usersRouter } = require('./routes/users.routes');

// Controllers
const { globalErrorHandler } = require('./controllers/error.controller');
const { productRouter } = require('./routes/products.routes');
const { cartsRouters } = require('./routes/cart.routes');

// Init our Express app
const app = express();

// Enable Express app to receive JSON data
app.use(express.json());

// Define endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/cart', cartsRouters);

// Global error handler
app.use(globalErrorHandler);

// Catch non-existing endpoints
app.all('*', (req, res) => {
	res.status(404).json({
		status: 'error',
		message: `${req.method} ${req.url} does not exists in our server`,
	});
});

module.exports = { app };
