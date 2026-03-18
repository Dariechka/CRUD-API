import type { FastifyInstance } from 'fastify'
import { productService } from '../services/product.service'
import { validate } from 'uuid'
import type { ErrorResponse, Product } from '../types/interfaces'
import { randomUUID } from 'node:crypto'

export async function productRoutes(fastify: FastifyInstance) {
  fastify.get('/api/products', async (_, reply) => {
    return reply
      .code(200)
      .send(productService.getProducts())
  })
  fastify.get<{ Params: { id: string } }>('/api/products/:id', async (request, reply) => {
    const {id} = request.params

    if (!validate(id)) {
      return reply
        .code(400)
        .send({message: 'Invalid productId format (must be UUID)'})
    }

    const product = productService.getProductById(id)

    if (!product) {
      return reply
        .code(404)
        .send({message: `Product with id ${id} not found`})
    }

    return reply
      .code(200)
      .send(product)
  })

  fastify.delete<{ Params: { id: string } }>('/api/products/:id', async (request, reply) => {
    const {id} = request.params

    if (!validate(id)) {
      return reply
        .code(400)
        .send({message: 'Invalid productId format (must be UUID)'})
    }

    const product = productService.getProductById(id)

    if (!product) {
      return reply
        .code(404)
        .send({message: `Product with id ${id} not found`})
    }

    return reply
      .code(204)
      .send(productService.deleteProduct(id))
  })

  fastify.register(async function (instance: FastifyInstance) {
    instance.put<{
      Params: { id: string }
      Body: Omit<Product, 'id'>
      Reply: Product | ErrorResponse
    }>('/api/products/:id', {
        schema: {
          body: {
            type: 'object',
            required: ['name', 'description', 'price', 'category', 'inStock'],
            properties: {
              name: {type: 'string', minLength: 1},
              description: {type: 'string', minLength: 1},
              price: {type: 'number', exclusiveMinimum: 0},
              category: {type: 'string', minLength: 1},
              inStock: {type: 'boolean'},
            },
          },
          response: {
            400: {
              type: 'object',
              properties: {
                message: {type: 'string'},
              },
            },
          },
        }
      },
      async (request, reply) => {
      const {id} = request.params
        if (!validate(id)) {
          return reply
            .code(400)
            .send({message: 'Invalid productId format (must be UUID)'})
        }

        if (!productService.getProductById(id)) {
          return reply
            .code(404)
            .send({message: `Product with id ${id} not found`})
        }

        const newProduct = {
          ...request.body,
          id
        }

        return reply
          .code(200)
          .send(productService.putProduct(newProduct))
      })
      instance.setErrorHandler((error, request, reply) => {
        if (error.validation) {
          return reply.status(400).send({
            message: 'Invalid product data',
          })
        }

        request.log.error(error)

        return reply.status(500).send({
          message: 'Product route error',
        })
      })
  })

  fastify.register(async function (instance: FastifyInstance) {
    instance.post<{
      Body: Omit<Product, 'id'>
      Reply: Product;
    }>('/api/products', {
        schema: {
          body: {
            type: 'object',
            required: ['name', 'description', 'price', 'category', 'inStock'],
            properties: {
              name: {type: 'string', minLength: 1},
              description: {type: 'string', minLength: 1},
              price: {type: 'number', exclusiveMinimum: 0},
              category: {type: 'string', minLength: 1},
              inStock: {type: 'boolean'},
            },
          },
          response: {
            400: {
              type: 'object',
              properties: {
                message: {type: 'string'},
              },
            },
          },
        },
      },
      async (request, reply) => {
        const newProduct = {
          ...request.body,
          id: randomUUID(),
        }

        const created = productService.postProduct(newProduct)
        return reply
          .code(201)
          .send(created)
      })
    instance.setErrorHandler((error, request, reply) => {
      if (error.validation) {
        return reply.status(400).send({
          message: 'Invalid product data',
        })
      }

      request.log.error(error)

      return reply.status(500).send({
        message: 'Product route error',
      })
    })
  })
}
