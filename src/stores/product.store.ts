import { products } from '../data/products.js'
import type { Product } from '../types/interfaces.js'

export const productStore = {
  getProducts: (): Array<Product> => products,
  getProductById: (id: string): Product | undefined => products.find(product => product.id === id),
  postProduct: (product: Product): Product => {
    products.push(product)
    return product
  },
  deleteProduct: (id: string): Array<Product> => {
    const index = products.findIndex(product => product.id === id)
    return products.splice(index, 1)
  },
  putProduct: (product: Product): Product => {
    products.forEach(item => {
      if (item.id === product.id) {
        Object.assign(item, product)
      }
      return item
    })
    return product
  }
}
