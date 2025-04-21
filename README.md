# E-commerce API

Este proyecto es una API de comercio electrónico que permite gestionar carritos de compra y productos. Implementa operaciones CRUD para los productos y carritos, y proporciona endpoints para la gestión de carritos, como agregar, eliminar productos y obtener detalles de los mismos.

## Tecnologías

- **Node.js**: Entorno de ejecución de JavaScript.
- **Express.js**: Framework web para Node.js.
- **File System (fs)**: Módulo de Node.js para manejar la lectura y escritura de archivos.

## Instalación

### Clonar el repositorio

Primero, clona el repositorio en tu máquina local:

bash
```git clone https://github.com/tu-usuario/ecommerce-api.git```
```cd ecommerce-api```

Instalar dependencias
Ejecuta el siguiente comando para instalar las dependencias del proyecto:

```npm install```

Configuración
Variables de entorno
Este proyecto no requiere de variables de entorno específicas. Sin embargo, asegúrate de tener un archivo products.json en la carpeta data con la estructura adecuada para almacenar los productos.
```
Uso de la API
Endpoints disponibles
1. GET /api/carts
Obtiene todos los carritos.

Respuesta: Un array con todos los carritos.

2. POST /api/carts
Crea un nuevo carrito.

Respuesta: El carrito recién creado.

3. POST /api/carts/:cid/products
Agrega un producto a un carrito existente.

Parámetros: cid - ID del carrito, productId - ID del producto, quantity - Cantidad del producto.

Respuesta: El carrito actualizado.

4. DELETE /api/carts/:cid/products/:pid
Elimina un producto de un carrito.

Parámetros: cid - ID del carrito, pid - ID del producto.

Respuesta: El carrito actualizado.

5. PUT /api/carts/:cid/products/:pid
Actualiza la cantidad de un producto en el carrito.

Parámetros: cid - ID del carrito, pid - ID del producto, quantity - Nueva cantidad.

Respuesta: El carrito actualizado.

6. DELETE /api/carts/:cid
Elimina todos los productos de un carrito.

Parámetros: cid - ID del carrito.

Respuesta: El carrito vacío.

7. GET /api/carts/:cid/products
Obtiene los productos de un carrito específico, incluyendo detalles completos de cada producto.

Parámetros: cid - ID del carrito.

Respuesta: Un array de productos con los detalles del producto.

Cómo probar la API
Para probar la API, puedes usar herramientas como Postman o Insomnia. Solo asegúrate de tener la aplicación corriendo en tu máquina local.

Iniciar el servidor
Ejecuta el siguiente comando para iniciar el servidor de desarrollo:

bash
Copiar
Editar
npm start
El servidor estará corriendo en http://localhost:8080.
``````
Contribuir
Haz un fork de este repositorio.

Crea una rama para tu nueva característica (git checkout -b feature/nueva-caracteristica).

Haz commit de tus cambios (git commit -am 'Añadir nueva característica').

Haz push a la rama (git push origin feature/nueva-caracteristica).

Crea un pull request.
```

markdown
Copiar
Editar
```
Este archivo `README.md` incluye:

- Descripción general del proyecto.
- Requisitos y tecnologías.
- Instrucciones de instalación.
- Documentación sobre los endpoints de la API con ejemplos.
- Cómo probar la API.
- Contribución y licencia.


