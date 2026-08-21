# E-Commerce & Logistics Backend API

A REST API built with **Express**, **TypeScript**, and **PostgreSQL** (via `node-postgres`) for managing customers, orders, products, order items, vendors, and supplies.

---

## Tech Stack

- **Language:** TypeScript
- **Server Framework:** Express
- **Database Driver:** node-postgres (`pg`)
- **Database:** PostgreSQL
- **No ORMs / query builders** — all queries use raw, parameterized SQL

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/hystrawr/WD_Lab_3.git
cd WD_Lab_3
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

- Create a PostgreSQL database (any name you like ex. ecommmerce_logistics).
- Run the setup script provided in the lab spec — it creates and populates the tables:
  `customer`, `orders`, `product`, `order_item`, `vendor`, `supplies`.

You can run it with `psql`, `dBeaver`, or `pgadmin`:

```bash
psql -U your_pg_user -d your_database_name -f setup.sql
```

### 4. Configure environment variables

Create a `.env` file in the project root (**no spaces around the `=` sign**):

```env
PORT=3000
PGUSER=your_pg_username
PGHOST=localhost
PGPASSWORD=your_pg_password
PGPORT=5432
PGDATABASE=your_database_name
```

### 5. Run the server

```bash
npm run dev
```

You should see:

```
API Server running on http://localhost:3000
```

---

## API Reference

All endpoints are prefixed with `/api/v1`. Request/response bodies use `application/json`.

### Customers (`/api/v1/customers`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | Get all customers |
| GET | `/customers/:id` | Get a single customer |
| POST | `/customers` | Create a new customer |
| PUT | `/customers/:id` | Update `city` and/or `membership_level` |
| DELETE | `/customers/:id` | Delete a customer |

### Products (`/api/v1/products`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products (optional `?category=` filter) |
| GET | `/products/:id` | Get a single product |
| POST | `/products` | Create a new product |
| PATCH | `/products/:id/price` | Update a product's `unit_price` |

### Orders (`/api/v1/orders`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | Get all orders |
| GET | `/orders/customer/:customerId` | Get all orders for a specific customer |
| POST | `/orders` | Create a new order |
| DELETE | `/orders/:id` | Delete an order |

### Order Items (`/api/v1/order-items`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/order-items/:orderId` | Get all line items for an order |
| POST | `/order-items` | Add a line item to an order |

### Vendors (`/api/v1/vendors`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vendors` | Get all vendors |

### Supplies (`/api/v1/supplies`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/supplies/vendor/:vendorId` | Get all supply records for a vendor |
| PUT | `/supplies/:vendorId/:productId` | Update `stock_quantity` for a vendor's product |

---

## Example Requests

**Create a customer**
```
POST /api/v1/customers
Content-Type: application/json

{
  "customer_id": "C106",
  "customer_name": "Frank Miller",
  "city": "Austin",
  "membership_level": "Silver"
}
```

**Update a product's price**
```
PATCH /api/v1/products/P001/price
Content-Type: application/json

{
  "unit_price": 549.99
}
```

**Update supply stock**
```
PUT /api/v1/supplies/V101/P001
Content-Type: application/json

{
  "stock_quantity": 450
}
```

---

## Error Handling

All routes use `try/catch` and return standard HTTP status codes:

- `400 Bad Request` — missing/invalid fields, duplicate primary key
- `404 Not Found` — resource doesn't exist
- `500 Internal Server Error` — unexpected server/database error

---

## Project Structure

```
src/
├── db.ts              # PostgreSQL connection pool
├── index.ts            # Express app entry point
├── types.ts             # Shared TypeScript interfaces
└── routes/
    ├── customers.ts
    ├── products.ts
    ├── orders.ts
    ├── orderItems.ts
    ├── vendors.ts
    └── supplies.ts
```
