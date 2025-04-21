const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/products/ - Listar todos los productos con filtros, paginación y ordenamiento
router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort = '', query = '' } = req.query;

  const queryObject = {};
  if (query) {
    queryObject.$or = [
      { category: { $regex: query, $options: 'i' } },
      { availability: { $regex: query, $options: 'i' } },
    ];
  }

  const sortOption = sort === 'asc' ? 1 : sort === 'desc' ? -1 : null;
  const sortQuery = sortOption ? { price: sortOption } : {};

  try {
    const products = await Product.find(queryObject)
      .sort(sortQuery)
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    const totalProducts = await Product.countDocuments(queryObject);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error en el servidor' });
  }
});

// GET /api/products/:pid - Ver los detalles de un producto
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'ID inválido' });
  }
});

// POST /api/products - Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'Error al crear el producto', error: err.message });
  }
});

// PUT /api/products/:id - Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'ID inválido o error al actualizar el producto' });
  }
});

// DELETE /api/products/:id - Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', message: 'Producto eliminado' });
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'ID inválido' });
  }
});

module.exports = router;
