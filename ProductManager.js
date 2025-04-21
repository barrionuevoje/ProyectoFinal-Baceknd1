const fs = require('fs');
const path = './proyect-folder/data/products.json';

class ProductManager {
  constructor() {
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify([]));
    }
  }

  async getAll(query = {}, options = {}) {
    const data = await fs.promises.readFile(path, 'utf-8');
    let products = JSON.parse(data);

    // Filtrado por query (por ejemplo, por categoría o disponibilidad)
    if (query.$or && query.$or.length > 0) {
      products = products.filter(product =>
        query.$or.some(condition =>
          Object.keys(condition).some(key =>
            product[key] && product[key].toLowerCase().includes(condition[key].toLowerCase())
          )
        )
      );
    }

    // Ordenamiento por precio si se indica
    if (options.sort) {
      products = products.sort((a, b) => {
        if (options.sort.price === 1) {
          return a.price - b.price; // Ascendente
        } else {
          return b.price - a.price; // Descendente
        }
      });
    }

    // Paginación
    if (options.limit) {
      products = products.slice(options.skip, options.skip + options.limit);
    }

    return products;
  }

  async getById(id) {
    const products = await this.getAll();
    return products.find((p) => p.id === id);
}


  async add(product) {
    const products = await this.getAll();
    const newProduct = {
      id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
      ...product,
    };
    products.push(newProduct);
    await fs.promises.writeFile(path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async update(id, updates) {
    const products = await this.getAll();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    await fs.promises.writeFile(path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async delete(id) {
    const products = await this.getAll();
    console.log("Productos antes de eliminar:", products); // Depuración
    const filteredProducts = products.filter((p) => p.id !== id);
    console.log("Productos después de eliminar:", filteredProducts); // Depuración
    
    // Si no se eliminó ningún producto, retorna null
    if (products.length === filteredProducts.length) {
      return null;
    }

    // Actualizamos el archivo con los productos filtrados
    await fs.promises.writeFile(path, JSON.stringify(filteredProducts, null, 2));
    return true;
  }

  // Agrega este método a tu ProductManager.js

async getCount(query = {}) {
  const data = await fs.promises.readFile(path, 'utf-8');
  let products = JSON.parse(data);

  // Filtrado por query (por ejemplo, por categoría o disponibilidad)
  if (query.$or && query.$or.length > 0) {
    products = products.filter(product =>
      query.$or.some(condition =>
        Object.keys(condition).some(key =>
          product[key] && product[key].toLowerCase().includes(condition[key].toLowerCase())
        )
      )
    );
  }

  // Devuelve el conteo de productos que cumplen con los criterios
  return products.length;
}


}



module.exports = ProductManager;
