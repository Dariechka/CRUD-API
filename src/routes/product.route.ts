import type { FastifyInstance } from 'fastify'
import { productService } from '../services/product.service'

export async function productRoutes(fastify: FastifyInstance) {
  fastify.get('/api/products', async (_, reply) => {
    return reply
      .code(200)
      .send(productService.getProducts());
  });
}
