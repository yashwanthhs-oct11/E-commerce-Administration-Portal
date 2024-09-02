# E-Commerce API

Welcome to the E-Commerce API documentation! This API provides endpoints for managing users, products, and orders in an e-commerce application. It includes functionality for authentication, CRUD operations on products, and order management.

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Products](#products)
- [Orders](#orders)
- [Error Handling](#error-handling)
- [Setup](#setup)
- [License](#license)

## Authentication

### Login
- **Endpoint**: `POST /users/login`
- **Description**: Authenticates a user and returns a JWT token.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Responses**:
  - **200 OK**: Returns JWT token and user email.
  - **400 Bad Request**: Invalid credentials.

### Register
- **Endpoint**: `POST /users/register`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "password": "password123",
    "phone": "1234567890",
    "isAdmin": false,
    "street": "123 Main St",
    "apartment": "4B",
    "zip": "12345",
    "city": "Anytown",
    "country": "Country"
  }

- **Responses**:
  - **200 OK**: Returns the created user object.
  - **400 Bad Request**: User cannot be created.

## Users

### Get All Users
- **Endpoint**: `GET /users`
- **Description**: Retrieves a list of all users without password hashes.
- **Responses**:
  - **200 OK**: Returns a list of users.
  - **500 Internal Server Error**: Server error.

### Get User By ID
- **Endpoint**: `GET /users/:id`
- **Description**: Retrieves a specific user by ID.
- **Responses**:
  - **200 OK**: Returns the user object.
  - **500 Internal Server Error**: User not found.

### Update User
- **Endpoint**: `PUT /users/:id`
- **Description**: Updates user information.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "password": "newpassword123",
    "phone": "1234567890",
    "isAdmin": false,
    "street": "123 Main St",
    "apartment": "4B",
    "zip": "12345",
    "city": "Anytown",
    "country": "Country"
  }
  ```
- **Responses**:
  - **200 OK**: Returns the updated user object.
  - **400 Bad Request**: User cannot be updated.

### Delete User
- **Endpoint**: `DELETE /users/:id`
- **Description**: Deletes a user by ID.
- **Responses**:
  - **200 OK**: Success message.
  - **404 Not Found**: User not found.
  - **500 Internal Server Error**: Server error.

### Get User Count
- **Endpoint**: `GET /users/get/count`
- **Description**: Retrieves the total number of users.
- **Responses**:
  - **200 OK**: Returns the user count.
  - **500 Internal Server Error**: Server error.

## Products

### Get All Products
- **Endpoint**: `GET /products`
- **Description**: Retrieves a list of all products.
- **Responses**:
  - **200 OK**: Returns a list of products.
  - **500 Internal Server Error**: Server error.

### Get Product By ID
- **Endpoint**: `GET /products/:id`
- **Description**: Retrieves a specific product by ID.
- **Responses**:
  - **200 OK**: Returns the product object.
  - **500 Internal Server Error**: Product not found.

### Create Product
- **Endpoint**: `POST /products`
- **Description**: Creates a new product.
- **Request Body**:
  ```json
  {
    "name": "Product Name",
    "description": "Product Description",
    "richDescription": "Detailed description of the product.",
    "image": "http://localhost:3000/public/uploads/product-image.jpg",
    "brand": "Brand Name",
    "price": 100,
    "category": "category_id",
    "countInStock": 10,
    "rating": 4.5,
    "numReviews": 100,
    "isFeatured": true
  }
  ```
- **Responses**:
  - **200 OK**: Returns the created product object.
  - **500 Internal Server Error**: Product cannot be created.

### Update Product
- **Endpoint**: `PUT /products/:id`
- **Description**: Updates a product's information.
- **Request Body**:
  ```json
  {
    "name": "Updated Product Name",
    "description": "Updated Product Description",
    "richDescription": "Updated detailed description.",
    "image": "http://localhost:3000/public/uploads/updated-product-image.jpg",
    "brand": "Updated Brand Name",
    "price": 120,
    "category": "category_id",
    "countInStock": 20,
    "rating": 4.8,
    "numReviews": 150,
    "isFeatured": false
  }
  ```
- **Responses**:
  - **200 OK**: Returns the updated product object.
  - **500 Internal Server Error**: Product cannot be updated.

### Delete Product
- **Endpoint**: `DELETE /products/:id`
- **Description**: Deletes a product by ID.
- **Responses**:
  - **200 OK**: Success message.
  - **404 Not Found**: Product not found.
  - **500 Internal Server Error**: Server error.

### Get Featured Products
- **Endpoint**: `GET /products/get/featured/:count`
- **Description**: Retrieves a list of featured products.
- **Responses**:
  - **200 OK**: Returns a list of featured products.
  - **500 Internal Server Error**: Server error.

### Update Product Gallery
- **Endpoint**: `PUT /products/gallery-images/:id`
- **Description**: Updates the gallery images for a product.
- **Request Body**: Form-data with multiple files.
- **Responses**:
  - **200 OK**: Returns the updated product object.
  - **500 Internal Server Error**: Gallery cannot be updated.

## Orders

### Get All Orders
- **Endpoint**: `GET /orders`
- **Description**: Retrieves a list of all orders.
- **Responses**:
  - **200 OK**: Returns a list of orders.
  - **500 Internal Server Error**: Server error.

### Get Order By ID
- **Endpoint**: `GET /orders/:id`
- **Description**: Retrieves a specific order by ID.
- **Responses**:
  - **200 OK**: Returns the order object.
  - **500 Internal Server Error**: Order not found.

### Create Order
- **Endpoint**: `POST /orders`
- **Description**: Creates a new order.
- **Request Body**:
  ```json
  {
    "orderItems": [
      {
        "quantity": 2,
        "product": "product_id"
      }
    ],
    "shippingAddress1": "123 Main St",
    "shippingAddress2": "Apt 4B",
    "city": "Anytown",
    "zip": "12345",
    "country": "Country",
    "phone": "1234567890",
    "status": "Pending",
    "totalPrice": 200,
    "user": "user_id"
  }
  ```
- **Responses**:
  - **200 OK**: Returns the created order object.
  - **400 Bad Request**: Order cannot be created.

### Update Order Status
- **Endpoint**: `PUT /orders/:id`
- **Description**: Updates the status of an order.
- **Request Body**:
  ```json
  {
    "status": "Shipped"
  }
  ```
- **Responses**:
  - **200 OK**: Returns the updated order object.
  - **400 Bad Request**: Order cannot be updated.

### Delete Order
- **Endpoint**: `DELETE /orders/:id`
- **Description**: Deletes an order by ID.
- **Responses**:
  - **200 OK**: Success message.
  - **404 Not Found**: Order not found.
  - **500 Internal Server Error**: Server error.

### Get Total Sales
- **Endpoint**: `GET /orders/get/totalsales`
- **Description**: Retrieves the total sales amount.
- **Responses**:
  - **200 OK**: Returns the total sales amount.
  - **400 Bad Request**: Sales cannot be generated.

### Get User Orders
- **Endpoint**: `GET /orders/get/userorders/:userid`
- **Description**: Retrieves a list of orders for a specific user.
- **Responses**:
  - **200 OK**: Returns a list of user orders.
  - **500 Internal Server Error**: Server error.

## Error Handling

The API uses a centralized error handler to handle different types of errors:

- **

UnauthorizedError**: Responds with `401 Unauthorized` if the user is not authorized.
- **ValidationError**: Responds with `400 Bad Request` with validation error messages.
- **Other Errors**: Responds with `500 Internal Server Error` for any other unexpected errors.

## Setup

To set up and run the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/ecommerce-api.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd ecommerce-api
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**: Create a `.env` file and add your environment variables (e.g., `secret`, `API_URL`).

5. **Run the application**:
   ```bash
   npm start
   ```

6. **Access the API**: The API will be available at `http://localhost:3000/api/v1`.

## UI Frontend

The UI frontend for this application is still in development. The API endpoints are functional, but the user interface components are not yet complete. Please refer to the API documentation for details on how to interact with the API.


