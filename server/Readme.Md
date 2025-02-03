# **Bike Store Application**

## **Overview**
The Bike Store application is a comprehensive solution for managing bike products, processing orders, and handling inventory. This application allows users to view available bikes, place orders, and tracks the total revenue generated from orders. It integrates product inventory management and order processing with a focus on real-time data.

## Live Link: https://bike-store-node.vercel.app

## Video Presentation: https://drive.google.com/file/d/1mlw2qSAOud0xY2Fwm2DBtaQ1gYH4GQqx/view?usp=drive_link

---

## **Features**

- **Bike Product Management**: 
  - View all bike products.
  - Search for bikes by name, brand, or category.
  - Add new bike products.
  - Update existing bike products.
  - Delete bike products.

- **Order Management**:
  - Place orders for bikes.
  - Automatically update bike quantities based on orders.
  - Handle out-of-stock bikes and prevent orders beyond available stock.

- **Revenue Calculation**:
  - Calculate total revenue from all orders using MongoDB aggregation.

- **Inventory Management**:
  - Decrease the available quantity of bikes when an order is placed.
  - Automatically mark bikes as out of stock when quantity reaches zero.

---

## **Tech Stack**

- **Backend**:
  - **Node.js** with **Express.js** for API management.
  - **MongoDB** for data storage.
  - **Mongoose** for MongoDB object modeling.

- **Utilities**:
  - **Zod** for data validation and schema definition.
  - **Winston** for logging.
  - **Insomnia/Postman** for API testing.

---

## **API Endpoints**

### **Product Endpoints**

- **GET** `/api/products`: 
  - Retrieve a list of all bike products.
  
- **GET** `/api/products?searchTerm=<term>`: 
  - Retrieve bikes by searching with a specific term (name, brand, category).

- **POST** `/api/products`:
  - Create a new bike product.

- **PUT** `/api/products/:productId`:
  - Update an existing bike product.

- **DELETE** `/api/products/:productId`:
  - Delete a bike product.

### **Order Endpoints**

- **POST** `/api/orders`:
  - Place an order for a bike.

- **GET** `/api/orders/revenue`:
  - Calculate the total revenue from all orders.

---

## **Setup Instructions**

### **Prerequisites**

Before setting up the project locally, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download Node.js](https://nodejs.org/)
- **MongoDB** - Either set up MongoDB locally or use a cloud solution like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### **Step 1: Clone the repository**

Clone the repository to your local machine.
Using SSH:

```bash
git clone git@github.com:shahadathhs/bike-store-server.git
cd bike-store-server
```
Normal:
```bash
git clone https://github.com/shahadathhs/bike-store-server.git
cd bike-store-server
```

### **Step 2: Install Dependencies**

Run the following command to install all necessary dependencies:

```bash
npm install
```

### **Step 3: Set up Environment Variables**

Create a `.env` file in the root of the project to configure the environment variables.

Example `.env` file:

```
PORT=3000
DATABASE_URL=mongodb://localhost:27017/bike-store
NODE_ENV = development
```

Make sure to replace the `DATABASE_URL` with your MongoDB URI if you're using MongoDB Atlas or a different database.

### **Step 4: Run the Application Locally**

Once the dependencies are installed and the environment variables are set up, you can run the project:

```bash
npm run start:dev
```

The server will start, and you can access the application at `http://localhost:3000`.

### **Step 5: Testing the Endpoints**

To test the endpoints, you can use a tool like **Insomnia** or **Postman**. Here are some sample requests:

- **Get all products**:  
  `GET` `/api/products`

- **Add a new product**:  
  `POST` `/api/products`  
  Body:
  ```json
  {
    "name": "Xtreme Mountain Bike",
    "brand": "Giant",
    "price": 1200,
    "category": "Mountain",
    "description": "A high-performance bike built for tough terrains.",
    "quantity": 50,
    "inStock": true
  }
  ```

- **Place an order**:  
  `POST` `/api/orders`  
  Body:
  ```json
  {
    "email": "customer@example.com",
    "product": "648a45e5f0123c45678d9012",
    "quantity": 2,
    "totalPrice": 2400
  }
  ```

---