import { describe, expect, it, beforeEach, vi } from 'vitest'
import { buildApp } from '../app'
import { HttpStatus } from '../types/statuses'
import { routes } from './product.route'
import { productService } from '../services/product.service'
import type { Product } from '../types/interfaces'
import { randomUUID } from 'node:crypto'


describe('GET /api/products', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  it('should return empty array when no products exist', async () => {
    const fastify = await buildApp();

    const mockData: Product[] = [];
    vi.spyOn(productService, 'getProducts').mockReturnValue(mockData);

    await fastify.register(routes);
    await fastify.ready();

    const response = await fastify.inject({
      method: 'GET',
      url: '/api/products',
    });

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.json()).toEqual([]);
  });
})

describe('POST /api/products', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  it('should create a new product and return it with 201', async () => {
    const fastify = await buildApp();
    const newProduct = {
      id: randomUUID(),
      name: 'Test Product',
      description: 'A product for testing',
      price: 100,
      category: 'Test',
      inStock: true,
    };

    vi.spyOn(productService, 'postProduct').mockReturnValue(newProduct);

    await fastify.register(routes);
    await fastify.ready();

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/products',
      payload: {
        name: 'Test Product',
        description: 'A product for testing',
        price: 100,
        category: 'Test',
        inStock: true,
      },
    });

    expect(response.statusCode).toBe(HttpStatus.CREATED);
    expect(response.json()).toEqual(newProduct);
  });
  it('should return 400 if there is no required field', async () => {
    const fastify = await buildApp();

    await fastify.register(routes);
    await fastify.ready();

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/products',
      payload: {
        description: 'A product for testing',
        price: 100,
        category: 'Test',
        inStock: true,
      },
    });

    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });
});

describe('PUT /api/products/:id', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  it('should update existing product and return updated object with same id', async () => {
    const fastify = await buildApp();
    await fastify.register(routes);
    await fastify.ready();

    const productID = randomUUID();
    const createdProduct = productService.postProduct({
      id: productID,
      name: 'Old Name',
      description: 'Old desc',
      price: 100,
      category: 'Old',
      inStock: true,
    });
    const updatePayload = {
      name: 'New Name',
      description: 'New desc',
      price: 200,
      category: 'New',
      inStock: false,
    };

    const response = await fastify.inject({
      method: 'PUT',
      url: `/api/products/${productID}`,
      payload: updatePayload,
    });

    expect(response.statusCode).toBe(HttpStatus.OK);
    const body = response.json();

    expect(body.id).toBe(productID);
    expect(body).toMatchObject(updatePayload);
  })
  it('should return 404 if there is no such product', async () => {
    const fastify = await buildApp();
    await fastify.register(routes);
    await fastify.ready();

    const unknownId = randomUUID();

    const response = await fastify.inject({
      method: 'PUT',
      url: `/api/products/${unknownId}`,
      payload: {
        name: 'Unknown',
        description: 'Unknown product',
        price: 60,
        category: 'some',
        inStock: false,
      }
    });

    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
  })
  it('should return 400 if id is not UUID', async () => {
    const fastify = await buildApp();
    await fastify.register(routes);
    await fastify.ready();

    const unknownId = '1';

    const response = await fastify.inject({
      method: 'PUT',
      url: `/api/products/${unknownId}`,
      payload: {
        name: 'Unknown',
        description: 'Unknown product',
        price: 60,
        category: 'some',
        inStock: false,
      }
    });

    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
  })
})

describe('DELETE and GET Product /api/products/:id', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  it('should return a product and return it with 200', async () => {
    const fastify = await buildApp();
    await fastify.register(routes);
    await fastify.ready();

    const testedProduct = productService.getProducts()[0]

    const response = await fastify.inject({
      method: 'GET',
      url: `/api/products/${testedProduct.id}`
    });

    expect(response.statusCode).toBe(HttpStatus.OK);
    const body = response.json();

    expect(body).toMatchObject(testedProduct);
  })
  it('should return 400 if id is not UUID', async () => {
    const fastify = await buildApp();
    await fastify.register(routes);
    await fastify.ready();

    const response = await fastify.inject({
      method: 'GET',
      url: `/api/products/${3}`,
    });

    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
  })
  it('should not delete a product if there is no such one', async () => {
    const fastify = await buildApp();
    await fastify.register(routes);
    await fastify.ready();

    const unknownId = randomUUID();

    const response = await fastify.inject({
      method: 'DELETE',
      url: `/api/products/${unknownId}`,
      payload: {
        name: 'Unknown',
        description: 'Unknown product',
        price: 60,
        category: 'some',
        inStock: false,
      }
    });

    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
  })
  it('should delete a product and return 404 for getting this product after deletion', async () => {
    const fastify = await buildApp();
    await fastify.register(routes);
    await fastify.ready();

    const testedProduct = productService.getProducts()[0]
    const deleteResponse = await fastify.inject({
      method: 'DELETE',
      url: `/api/products/${testedProduct.id}`,
      payload: testedProduct
    });

    expect(deleteResponse.statusCode).toBe(HttpStatus.NO_CONTENT);

    const getResponse = await fastify.inject({
      method: 'GET',
      url: `/api/products/${testedProduct.id}`
    });

    expect(getResponse.statusCode).toBe(HttpStatus.NOT_FOUND);
  })
})
