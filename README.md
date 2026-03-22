# CRUD-API

A simple REST API for managing products built with Fastify and TypeScript.

---

## Features

* CRUD operations for products
* Request validation (UUID + schema validation)
* Structured error handling
* Multiple run modes (dev, prod, cluster)
* Linting, formatting, and testing setup

## Scripts

### Run application

```bash
# Development (hot reload)
npm run start:dev

# Production (single instance)
npm run start:prod

# Production (multi-core / cluster mode)
npm run start:multi
```

### Code quality

```bash
# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

### Tests

```bash
npm run test
```

---

## Application Modes

* **Development (`start:dev`)**

    * Uses `tsx`
    * Enables fast iteration and debugging

* **Production (`start:prod`)**

    * Compiles TypeScript → `dist`
    * Runs a single Node.js instance

* **Cluster (`start:multi`)**

    * Runs multiple Node.js processes
    * Utilizes multi-core CPUs for better performance

---

## Environment Variables

The application uses environment variables for configuration.

Use `.env.example` file: change it to `.env`

---

## API Endpoints

Base URL:

```
http://localhost:<PORT>/api/products
```

---

### Get all products

```bash
curl http://<HOST>:<PORT>/api/products
```

---

### Get product by ID

```bash
curl http://<HOST>:<PORT>/api/products/<uuid>
```

---

### Create product

```bash
curl -X POST http://<HOST>:<PORT>/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "Powerful machine",
    "price": 1500,
    "category": "Electronics",
    "inStock": true
  }'
```

---

### Update product

```bash
curl -X PUT http://<HOST>:<PORT>/api/products/<uuid> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Laptop",
    "description": "Updated description",
    "price": 1600,
    "category": "Electronics",
    "inStock": false
  }'
```

---

### Delete product

```bash
curl -X DELETE http://<HOST>:<PORT>/api/products/<uuid>
```

---

## Testing the API

You can test the API using:

* curl (examples above)
* Postman

---

## Error Handling

The application includes:

### Global error handler

* Logs all errors
* Returns:

```json
{
  "message": "Something went wrong. Please try again later."
}
```

### Route-level validation

* Invalid UUID → `400 Bad Request`
* Missing product → `404 Not Found`
* Invalid body → `400 Bad Request`

### Not Found handler

```json
{
  "message": "Resource not found", 
  "path": "/requested/url"
}
```

## Tech Stack

* Fastify
* TypeScript
* Vitest
* ESLint
* Prettier

## Notes
* Product IDs must be valid UUIDs
* Validation is enforced at both route and schema level
* Cluster mode improves performance under load
