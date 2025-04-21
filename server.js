const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');

// Rutas
const productsRouter = require('./proyect-folder/routes/products.router'); 
const cartsRouter = require('./proyect-folder/routes/carts.router');
const viewsRouter = require('./proyect-folder/routes/views.router');

// Modelo de Producto de MongoDB
const Product = require('./proyect-folder/models/Product'); 

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 8080;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './proyect-folder/views');

// Middlewares
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// WebSocket connection
io.on('connection', async (socket) => {
  console.log('🟢 Cliente conectado via WebSocket');
  const products = await Product.find(); // Obtener productos de MongoDB
  socket.emit('updateProducts', products); // Enviar productos al cliente

  socket.on('newProduct', async (data) => {
    await Product.create(data); // Crear nuevo producto
    const updatedProducts = await Product.find(); // Obtener productos actualizados
    io.emit('updateProducts', updatedProducts); // Emitir lista actualizada
  });

  socket.on('deleteProduct', async (id) => {
    await Product.findByIdAndDelete(id); // Eliminar producto
    const updatedProducts = await Product.find(); // Obtener productos actualizados
    io.emit('updateProducts', updatedProducts); // Emitir lista actualizada
  });
});

// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
