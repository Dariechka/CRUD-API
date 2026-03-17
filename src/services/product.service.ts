import { products } from '../data/products'
import type { Product } from '../types/interfaces'

export const productService = {
  getProducts: () => products,
  getProductById: (id: string) => products.find(product => product.id === id),
  postProduct: (product: Product) => {
    products.push(product)
    return product
  },
};
