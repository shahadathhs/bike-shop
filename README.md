# Bike Shop

A full-stack Bike Shop application that enables users to browse and purchase bicycles while providing administrators with a robust dashboard for managing products, orders, and users. This project features secure authentication, role-based access, and integration with Stripe for payment processing.

## Key Features

- **Responsive Frontend**  
  - Built with React, TypeScript, and Tailwind CSS.
  - User-friendly interface with a modern design.
  - Carousel banner, featured products, and detailed product pages.

- **User Authentication & Role-Based Access**  
  - Secure user registration and login with JWT.
  - Role-based dashboards for customers and administrators.
  - Protected routes for sensitive pages.

- **Product Management**  
  - Full CRUD operations for bikes.
  - Image uploads (with cloudinary cloud storage).
  - Filtering, searching, and pagination for product listings.

- **Order Management & Payment Integration**  
  - Customers can place orders with real-time stock checks.
  - Stripe integration for secure payment processing.
  - Order tracking and dashboard analytics.

- **Admin Dashboard**  
  - Manage products, orders, and users.
  - Comprehensive analytics including revenue summary and order status.

## Technology Stack

- **Frontend:**
  - React
  - TypeScript
  - React Router (v7)
  - Tailwind CSS
  - daisyUI
  - react-icons
  - react-hot-toast (for notifications)

- **Backend:**
  - Node.js & Express
  - MongoDB & Mongoose
  - JSON Web Tokens (JWT) for authentication
  - Stripe (for payment integration)
  - Custom error handling and middleware

## Getting Started

### Prerequisites

- Node.js (v14 or later)
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

     ```bash
     npm run dev
     ```

## Running Locally

- **Backend:** Ensure MongoDB is running and the `.env` file is configured correctly. Run the backend server with `npm run start:dev`.
- **Frontend:** Run the frontend with `npm run dev` and open the URL provided in your terminal (usually `http://localhost:3000`).

## Live Deployment

- **Server (API):** [https://bike-shop-server-seven.vercel.app/api](https://bike-shop-server-seven.vercel.app/api)
- **Client:** [https://bike-shop-client-kappa.vercel.app](https://bike-shop-client-kappa.vercel.app)

## Instructions & Guidelines

1. **Follow the .env.example Files:**  
   - Make sure to configure your environment variables correctly. Do not commit your actual secrets.

2. **Development Workflow:**  
   - Use separate branches for new features.
   - Write clear commit messages and maintain a clean codebase.
   - Document any changes in your README or relevant documentation files.

3. **Testing:**  
   - Ensure you test critical flows such as user authentication, product management, and checkout processes.

4. **Deployment:**  
   - The project is deployed on Vercel. Use Vercel’s CLI or dashboard to manage deployments.

## Additional Notes

- **Error Handling:**  
  Custom error classes and middleware are used in the backend for consistent error responses.
- **Security:**  
  All sensitive routes are protected using JWT and role-based authentication.
- **Stripe Integration:**  
  Payment flows are integrated with Stripe. For production, ensure that all Stripe keys and secrets are securely stored.

