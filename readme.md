# ShopMan

ShopMan is a full-featured backend for an e-commerce platform, built with Node.js, Express, and Sequelize (PostgreSQL/MySQL). It supports multi-shop management, inventory, discounts, order processing, user authentication, role-based access control, and more.

## Features

- **Shop & Product Management:** CRUD for shops, products, categories, SKU, attributes, images.
- **Inventory Management:** Real-time inventory tracking, stock decrement/restore, bulk update.
- **Discount System:** Support for campaign/shop discounts, per-product discount, usage limits, time limits.
- **Order & Checkout:** Shopping cart, order creation, payment integration (COD, online), discount application, inventory lock.
- **User Management:** Role-based access (admin, manager, seller, member), shop invitation, member management.
- **Authentication & Security:** JWT-based authentication, permission middleware, password hash, shop activation status.
- **API Documentation:** OpenAPI/Swagger documentation for all endpoints.
- **Data Caching & Lock:** Redis for caching trending products, lock during checkout, cache inventory.
- **Validation:** Input validation using Joi for all core APIs.
- **Testing:** Unit test example with Jest (sample provided).
- **Clean Architecture:** Clear separation of Repository, Service, Controller layers.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL / MySQL (via Sequelize ORM)
- **Cache/Lock:** Redis
- **Documentation:** Swagger (OpenAPI)
- **Validation:** Joi
- **Authentication:** JWT
- **Testing:** Jest (unit/integration test demo)
- **Other:** Pug (for admin view), Docker support (optional)

## Folder Structure

```
src/
  ├── controllers/      # API controllers (admin, client)
  ├── db/               # Database models, associations, aggregations
  ├── helpers/          # Helper functions (email, async handler, ...)
  ├── middleware/       # Middlewares (auth, error handler, validate)
  ├── models/           # Repositories (data access layer)
  ├── routes/           # API routes (admin, client)
  ├── services/         # Business logic (admin, client)
  ├── utils/            # Utility functions (data filter, ...)
  ├── validations/      # Joi validation schemas
  ├── app.js            # Express app setup
  └── ...
```

## Getting Started

### Prerequisites

- Node.js >= 16.x
- PostgreSQL or MySQL server
- Redis server

### Installation

```bash
git clone https://github.com/Zayn-Hargreaves/ShopMan.git
cd ShopMan
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

| Variable           | Description                |
|--------------------|---------------------------|
| DB_HOST            | Database host             |
| DB_USER            | Database username         |
| DB_PASS            | Database password         |
| DB_NAME            | Database name             |
| REDIS_URL          | Redis connection string   |
| JWT_SECRET         | JWT signing secret        |
| ...                | ...                       |

### Database Setup

- Run migrations and (optionally) seed data.
- Example with Sequelize CLI:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### Start Server

```bash
npm start
```
API will be available at `http://localhost:3000`

### API Documentation

- Visit `/api-docs` for Swagger UI (if enabled).

## Example API Endpoints

- `POST /api/v1/auth/register` – User registration
- `POST /api/v1/shop` – Create a shop
- `POST /api/v1/admin/product` – Add product (admin)
- `GET /api/v1/products` – List products (with filter, sort, pagination)
- `POST /api/v1/checkout` – Checkout order
- `POST /api/v1/admin/discount/add` – Add new discount

> See Swagger or Postman collection for full API reference.

## Testing

- Example unit test with Jest:
```bash
npm test
```

## Highlighted Code Practices

- Clean code, modular design.
- Repository pattern for database abstraction.
- Robust error handling with custom error classes and centralized middleware.
- Input validation with Joi.
- Secure authentication and RBAC authorization.
- Use of Redis for real-time lock and caching.

## Contribution

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT

---

**Author:** [Zayn-Hargreaves](https://github.com/Zayn-Hargreaves)
