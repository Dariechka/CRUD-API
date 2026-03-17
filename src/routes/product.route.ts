import type { FastifyInstance } from 'fastify'
import { productService } from '../services/product.service'
import { validate } from 'uuid'

export async function productRoutes(fastify: FastifyInstance) {
  fastify.get('/api/products', async (_, reply) => {
    return reply
      .code(200)
      .send(productService.getProducts());
  });
  fastify.get<{ Params: { id: string } }>('/api/products/:id', async (request, reply) => {
    const { id } = request.params;

    if (!validate(id)) {
      return reply
        .code(400)
        .send({ message: 'Invalid productId format (must be UUID)' });
    }

    const product = productService.getProductById(id);

    if (!product) {
      return reply
        .code(404)
        .send({ message: `Product with id ${id} not found` });
    }

    return reply
      .code(200)
      .send(product);
  });
}
