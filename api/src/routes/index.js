const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');

// Importa los routers aquí
const usersRouter = require('./usersRouter');
const productsRouter = require('./productsRouter');
const buysRouter = require('./buysRouter');


// Configura los routers aquí
router.use('/users', usersRouter);
router.use('/products', productsRouter)
router.use('/buys', buysRouter)


// Exporta el router
module.exports = router;