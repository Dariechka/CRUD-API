import { products } from '../data/products'

export const productService = {
  getProducts: () => products,
  getProductById: (id: string) => products.find(product => product.id === id),
};
