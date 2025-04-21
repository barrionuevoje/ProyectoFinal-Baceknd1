const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Agregar un producto al carrito (sumando cantidad si ya existe)
router.post('/:cartId/products/:productId', async (req, res) => {
  const { cartId, productId } = req.params;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const existing = cart.products.find(p => p.product.toString() === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.status(201).json({ message: 'Producto agregado al carrito', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
});

// Eliminar un producto del carrito
router.delete('/:cartId/products/:productId', async (req, res) => {
  const { cartId, productId } = req.params;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();

    res.json({ message: 'Producto eliminado del carrito', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar producto del carrito' });
  }
});

// Actualizar cantidad de un producto en el carrito
router.put('/:cartId/products/:productId', async (req, res) => {
  const { cartId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const productInCart = cart.products.find(p => p.product.toString() === productId);
    if (!productInCart) return res.status(404).json({ error: 'Producto no está en el carrito' });

    productInCart.quantity = quantity;
    await cart.save();

    res.json({ message: 'Cantidad actualizada', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});



// Vaciar carrito
router.delete('/:cartId/products', async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();

    res.json({ message: 'Carrito vaciado', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error al vaciar el carrito' });
  }
});

// Eliminar carrito completo
router.delete('/:cartId', async (req, res) => {
  const { cartId } = req.params;

  try {
    const deletedCart = await Cart.findByIdAndDelete(cartId);
    if (!deletedCart) return res.status(404).json({ message: 'Carrito no encontrado' });

    res.json({ message: 'Carrito eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el carrito' });
  }
});

module.exports = router;
