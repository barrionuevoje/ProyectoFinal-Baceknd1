const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Modelo de MongoDB

// Ruta para la vista principal de productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // Obtener productos de MongoDB
    res.render('home', { products }); // Renderizar la vista con los productos
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al cargar los productos');
  }
});

module.exports = router;
