# STOCKLINE — Inventory Management System

A full-stack inventory management system built for retailers, warehouses, and small businesses to manage products, suppliers, purchases, sales, and stock levels in real time.

Built as a complete portfolio project demonstrating end-to-end full-stack development: authentication, role-based access control, relational database design, automated business logic, and a polished React frontend.

## Features

- **Authentication & Roles** — JWT-based login/register with three access levels: Admin, Manager, Staff
- **Product Management** — Full CRUD with SKU, category, brand, barcode, pricing, and stock tracking
- **Supplier Management** — Track supplier contact details and purchase history
- **Purchases** — Record incoming stock; inventory levels update automatically
- **Sales** — Record outgoing stock with built-in protection against overselling (stock can never go negative)
- **Dashboard** — Live metrics: total products, categories, low stock alerts, inventory value, today's sales, monthly revenue
- **Notifications** — Automatic alerts for low stock, out-of-stock, and new purchase orders
- **Reports** — Export inventory data as PDF or Excel

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Axios

**Backend**
- Node.js / Express
- PostgreSQL
- Sequelize (ORM)
- JWT + bcrypt for authentication

**Reports**
- ExcelJS (Excel export)
- PDFKit (PDF export)

## Project Structure

stockline/
├── client/ # React frontend
│ └── src/
│ ├── pages/ # Login, Dashboard, Products, Suppliers, Purchases, Sales, Notifications, Reports
│ ├── components/ # Shared Layout (sidebar navigation)
│ └── api.js # Axios instance with JWT interceptor
│
├── server/ # Express backend
│ ├── models/ # Sequelize models: User, Product, Supplier, Purchase, Sale, Notification
│ ├── routes/ # API endpoints
│ ├── middleware/ # JWT auth + role-based access control
│ ├── utils/ # Stock/notification helpers
│ └── config/db.js # PostgreSQL connection

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### Backend setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

PORT=5000
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=127.0.0.1
DB_PORT=5432
JWT_SECRET=your_secret_key

Run the server:

```bash
npm run dev
```

### Frontend setup

```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173`.

## API Overview

| Method | Endpoint | Description | Access |
|--------|----------|--------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Log in, receive JWT | Public |
| GET/POST/PUT/DELETE | `/api/products` | Manage products | Authenticated (write: Admin/Manager) |
| GET/POST/PUT/DELETE | `/api/suppliers` | Manage suppliers | Authenticated (write: Admin/Manager) |
| GET/POST | `/api/purchases` | Record/view purchases | Authenticated (create: Admin/Manager) |
| GET/POST | `/api/sales` | Record/view sales | Authenticated |
| GET | `/api/dashboard` | Dashboard analytics | Authenticated |
| GET | `/api/notifications` | Fetch notifications | Authenticated |
| GET | `/api/reports/inventory/excel` | Download Excel report | Authenticated |
| GET | `/api/reports/inventory/pdf` | Download PDF report | Authenticated |

## License

This project is licensed under the MIT License.

