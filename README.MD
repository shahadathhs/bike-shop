# 🚲 Bike Shop

A full-stack Bike Shop application that enables users to browse and purchase bicycles while providing administrators with a robust dashboard for managing products, orders, and users. This project features secure authentication, role-based access, and integration with Stripe for payment processing.

---

## 📑 Table of Contents

- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [📦 Packages Used](#-packages-used)
- [🏃‍♂️ Running Locally](#-running-locally)
- [🌐 Live Deployment](#-live-deployment)
- [🛣️ API Endpoints](#️-api-endpoints)
- [🗄️ Models & Schemas](#️-models--schemas)
- [📝 Additional Notes](#-additional-notes)

---

## 🔑 Key Features

- **Responsive Frontend**

  - Built with React, TypeScript, and Tailwind CSS.
  - Carousel banner, featured products, and detailed product pages.

- **User Authentication & Role-Based Access**

  - Secure user registration and login with JWT.
  - Role-based dashboards for customers and administrators.
  - Protected routes for sensitive pages.

- **Product Management**

  - Full CRUD operations for bikes.
  - Image uploads (with Cloudinary).
  - Filtering, searching, and pagination for product listings.

- **Order Management & Payment Integration**

  - Customers can place orders with real-time stock checks.
  - Stripe integration for secure payment processing.
  - Order tracking and dashboard analytics.

- **Admin Dashboard**
  - Manage products, orders, and users.
  - Comprehensive analytics including revenue summary and order status.

---

## 🛠️ Technology Stack

- **Frontend:** React · TypeScript · React Router (v7) · Tailwind CSS · daisyUI · react-icons · react-hot-toast
- **Backend:** Node.js · Express · MongoDB · Mongoose · Zod · JSON Web Tokens (JWT) · Stripe
- **Testing & Quality:** Jest · Vitest · MSW · Supertest · (explored K6 for load testing)

---

## 📦 Packages Used

### Frontend (`/client`)

#### Dependencies

| Package               | Version  |
| --------------------- | -------- |
| react                 | ^19.0.0  |
| react-dom             | ^19.0.0  |
| react-hot-toast       | ^2.5.2   |
| react-icons           | ^5.4.0   |
| lucide-react          | ^0.475.0 |
| js-cookie             | ^3.0.5   |
| cloudinary            | ^2.5.1   |
| cross-env             | ^7.0.3   |
| express               | ^4.21.2  |
| @stripe/stripe-js     | ^5.6.0   |
| @vercel/node          | ^5.1.8   |
| @vercel/react-router  | ^1.0.2   |
| @react-router/express | ^7.2.0   |
| @react-router/node    | ^7.1.3   |
| @react-router/serve   | ^7.1.3   |

#### Dev Dependencies

| Package               | Version       |
| --------------------- | ------------- |
| vite                  | ^5.4.11       |
| typescript            | ^5.7.2        |
| tailwindcss           | ^4.0.0        |
| @tailwindcss/vite     | ^4.0.0        |
| daisyui               | ^5.0.0-beta.8 |
| vite-tsconfig-paths   | ^5.1.4        |
| @types/react          | ^19.0.1       |
| @types/react-dom      | ^19.0.1       |
| @types/node           | ^20           |
| @types/js-cookie      | ^3.0.6        |
| @react-router/dev     | ^7.1.5        |
| react-router-devtools | ^1.1.0        |

---

### Backend (`/server`)

#### Dependencies

| Package      | Version |
| ------------ | ------- |
| express      | ^4.21.1 |
| mongoose     | ^8.8.2  |
| bcryptjs     | ^3.0.0  |
| cors         | ^2.8.5  |
| dotenv       | ^16.4.5 |
| jsonwebtoken | ^9.0.2  |
| stripe       | ^17.6.0 |
| winston      | ^3.17.0 |
| zod          | ^3.23.8 |
| ms           | ^2.1.3  |
| nodemon      | ^3.1.7  |

#### Dev Dependencies

| Package                          | Version |
| -------------------------------- | ------- |
| typescript                       | ^5.6.3  |
| ts-node-dev                      | ^2.0.0  |
| @typescript-eslint/eslint-plugin | ^8.15.0 |
| @typescript-eslint/parser        | ^8.15.0 |
| @eslint/js                       | ^9.15.0 |
| eslint                           | ^9.15.0 |
| eslint-plugin-import             | ^2.31.0 |
| eslint-define-config             | ^2.1.0  |
| prettier                         | ^3.3.3  |
| @types/express                   | ^5.0.0  |
| @types/cors                      | ^2.8.17 |
| @types/jsonwebtoken              | ^9.0.8  |
| @types/node                      | ^22.9.1 |

---

## 🏃‍♂️ Running Locally

### Prerequisites

- Node.js (v20 or later)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/shahadathhs/bike-shop.git
   cd bike-shop
   ```

2. **Setup Backend:**

   - Navigate to the server directory:

     ```bash
     cd server
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Create a `.env` file in the `server` directory using the provided `.env.example` as a template:

   - Start the backend server:

     ```bash
     npm run start:dev
     ```

3. **Setup Frontend:**

   - Navigate to the client directory:

     ```bash
     cd client
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Create a `.env` file in the `client` directory using the provided `.env.example` as a template:

   - Start the frontend development server:

---

## 🌐 Live Deployment

- **Server (API):** [https://bike-shop-server-seven.vercel.app/api](https://bike-shop-server-seven.vercel.app/api)
- **Client:** [https://bike-shop-client-kappa.vercel.app](https://bike-shop-client-kappa.vercel.app)

---

## 🛣️ API Endpoints

| Method       | Endpoint                                | Description                    | Auth            |
| ------------ | --------------------------------------- | ------------------------------ | --------------- |
| GET          | `/`                                     | Welcome message                | Public          |
| GET          | `/api`                                  | Root API route                 | Public          |
| **Auth**     |
| POST         | `/api/auth/register`                    | Register new user              | Public          |
| POST         | `/api/auth/login`                       | Login user                     | Public          |
| POST         | `/api/auth/deactivate/:id`              | Deactivate user                | Admin           |
| PATCH        | `/api/auth/update-profile`              | Update own profile             | Customer        |
| PATCH        | `/api/auth/update-password`             | Change own password            | Customer        |
| GET          | `/api/auth/getAll`                      | List all users                 | Admin           |
| PATCH        | `/api/auth/:id/role`                    | Change a user’s role           | Admin           |
| PATCH        | `/api/auth/:id/active`                  | Toggle user active/inactive    | Admin           |
| **Bikes**    |
| GET          | `/api/bikes`                            | List all bikes                 | Public          |
| GET          | `/api/bikes/:id`                        | Get bike by ID                 | Public          |
| POST         | `/api/bikes`                            | Create a new bike              | Admin           |
| PUT          | `/api/bikes/:id`                        | Update bike                    | Admin           |
| DELETE       | `/api/bikes/:id`                        | Delete bike                    | Admin           |
| PATCH        | `/api/bikes/:id/restock`                | Restock bike quantity          | Admin           |
| **Orders**   |
| POST         | `/api/orders`                           | Create new order               | Customer        |
| GET          | `/api/orders/:id`                       | Get order by ID                | Admin, Customer |
| GET          | `/api/orders/myOrders/:email`           | Get orders for a user          | Admin, Customer |
| PUT          | `/api/orders/:id`                       | Update order details           | Admin           |
| PATCH        | `/api/orders/:id/status`                | Update order status            | Admin           |
| DELETE       | `/api/orders/:id`                       | Delete an order                | Admin           |
| PATCH        | `/api/orders/:id/cancel`                | Cancel your order              | Admin, Customer |
| GET          | `/api/orders/admin/getAll`              | List all orders                | Admin           |
| GET          | `/api/orders/admin/revenue`             | Calculate total revenue        | Admin           |
| GET          | `/api/orders/admin/analytics`           | Order analytics & stats        | Admin           |
| **Payments** |
| POST         | `/api/payments/create-checkout-session` | Create Stripe checkout session | Customer        |

---

## 🗄️ Models & Schemas

All request payloads are validated with **Zod**.  
Schemas live in:

- `server/src/modules/auth/auth.validation.ts`
- `server/src/modules/bike/bike.schema.ts`
- `server/src/modules/order/order.schema.ts`

Each defines the shape and types for create/update operations.

---

## 📝 Additional Notes

- ⚙️ Make sure both `/server/.env` and `/client/.env` match their `.env.example`.
- 🚧 Use feature branches and clear commit messages.
- 🔍 Check logs (Winston middleware) and API info logger for debugging.
- 🔒 Protect your secrets: do not commit real keys to GitHub.
- ☁️ Deploy with Vercel for both client and server.
