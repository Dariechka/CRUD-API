import { products } from '../data/products'
import type { Product } from '../types/interfaces'

export const productService = {
  getProducts: () => products,
  getProductById: (id: string) => products.find(product => product.id === id),
  postProduct: (product: Product) => {
    products.push(product)
    return product
  },
  deleteProduct: (id: string) => {
    const index = products.findIndex(product => product.id === id)
    return products.splice(index, 1)
  },
};
