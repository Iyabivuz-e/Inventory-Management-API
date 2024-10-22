# Inventory Management API

## Description
A RESTful API for managing inventory, allowing users to add, update, delete, and view products.

## Setup

1. Clone the repository.
2. Navigate to the project folder.
3. Install dependencies: `npm install`.
4. Create a `.env` file and set the `MONGODB_URI`.
5. Start the server: `npm run dev`.

## API Endpoints

### Products
- **GET /api/products** - Retrieve all products
- **POST /api/products** - Add a new product
- **GET /api/products/[id]** - Retrieve a specific product
- **PUT /api/products/[id]** - Update product quantity
- **DELETE /api/products/[id]** - Delete a product

## Tech stack

1. Next.Js 15
2. TypeScript


