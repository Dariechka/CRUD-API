import type { FastifyInstance } from 'fastify'
import { productService } from '../services/product.service.js'
import { validate } from 'uuid'
import type { ErrorResponse, Product } from '../types/interfaces.js'
import { randomUUID } from 'node:crypto'
import { HttpStatus } from '../types/statuses.js'

export async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/products', async (_, reply) => {
    return reply.code(HttpStatus.OK).send(productService.getProducts())
  })
  fastify.get<{ Params: { id: string } }>('/api/products/:id', async (request, reply) => {
    const { id } = request.params

    if (!validate(id)) {
      return reply.code(HttpStatus.BAD_REQUEST).send({ message: 'Invalid productId format (must be UUID)' })
    }

    const product = productService.getProductById(id)

    if (!product) {
      return reply.code(HttpStatus.NOT_FOUND).send({ message: `Product with id ${id} not found` })
    }

    return reply.code(HttpStatus.OK).send(product)
  })
  fastify.delete<{ Params: { id: string } }>('/api/products/:id', async (request, reply) => {
    const { id } = request.params

    if (!validate(id)) {
      return reply.code(HttpStatus.BAD_REQUEST).send({ message: 'Invalid productId format (must be UUID)' })
    }

    const product = productService.getProductById(id)

    if (!product) {
      return reply.code(HttpStatus.NOT_FOUND).send({ message: `Product with id ${id} not found` })
    }

    return reply.code(HttpStatus.NO_CONTENT).send(productService.deleteProduct(id))
  })
  fastify.register(async function (instance: FastifyInstance) {
    instance.put<{
      Params: { id: string }
      Body: Omit<Product, 'id'>
      Reply: Product | ErrorResponse
    }>(
      '/api/products/:id',
      {
        schema: {
          body: {
            type: 'object',
            required: ['name', 'description', 'price', 'category', 'inStock'],
            properties: {
              name: { type: 'string', minLength: 1 },
              description: { type: 'string', minLength: 1 },
              price: { type: 'number', exclusiveMinimum: 0 },
              category: { type: 'string', minLength: 1 },
              inStock: { type: 'boolean' },
            },
          },
          response: {
            400: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        if (!validate(id)) {
          return reply.code(HttpStatus.BAD_REQUEST).send({ message: 'Invalid productId format (must be UUID)' })
        }

        if (!productService.getProductById(id)) {
          return reply.code(HttpStatus.NOT_FOUND).send({ message: `Product with id ${id} not found` })
        }

        const newProduct = {
          ...request.body,
          id,
        }

        return reply.code(HttpStatus.OK).send(productService.putProduct(newProduct))
      }
    )
    instance.setErrorHandler((error, request, reply) => {
      if (error.validation) {
        return reply.status(HttpStatus.BAD_REQUEST).send({
          message: 'Invalid product data',
        })
      }

      request.log.error(error)

      return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Product route error',
      })
    })
  })
  fastify.register(async function (instance: FastifyInstance) {
    instance.post<{
      Body: Omit<Product, 'id'>
      Reply: Product
    }>(
      '/api/products',
      {
        schema: {
          body: {
            type: 'object',
            required: ['name', 'description', 'price', 'category', 'inStock'],
            properties: {
              name: { type: 'string', minLength: 1 },
              description: { type: 'string', minLength: 1 },
              price: { type: 'number', exclusiveMinimum: 0 },
              category: { type: 'string', minLength: 1 },
              inStock: { type: 'boolean' },
            },
          },
          response: {
            400: {
              type: 'object',
              properties: {
                message: { type: 'string' },
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
        return reply.code(HttpStatus.CREATED).send(created)
      }
    )
    instance.setErrorHandler((error, request, reply) => {
      if (error.validation) {
        return reply.status(HttpStatus.BAD_REQUEST).send({
          message: 'Invalid product data',
        })
      }

      request.log.error(error)

      return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Product route error',
      })
    })
  })

  fastify.setNotFoundHandler((request, reply) => {
    reply.status(HttpStatus.NOT_FOUND).send({
      message: 'Resource not found',
      path: request.url,
    })
  })
}
