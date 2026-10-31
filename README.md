[README-DEEPSTORE.md](https://github.com/user-attachments/files/34210636/README-DEEPSTORE.md)
# DEEPSTORE — Full-Stack E-Commerce Platform

DEEPSTORE is a full-stack e-commerce web application built with the MERN stack. It provides a shopping experience for customers and dedicated dashboards for sellers and administrators.

## About the Project

DEEPSTORE brings product discovery, cart management, checkout, order tracking, and seller product management together in one application. It includes role-based access for customers, sellers, and administrators.

## Features

### Customer
- Sign up and log in
- Browse the product catalogue
- View individual product details
- Search and filter products
- Add products to the cart and manage quantities
- Checkout with a shipping address
- View personal order history

### Seller
- Become a seller and create a store profile
- Access a seller dashboard
- Add, edit, and delete products
- View orders that contain the seller's products
- Update the status of eligible orders

### Administrator
- Protected admin dashboard
- Manage products
- View all customer orders
- Update order statuses

### Application
- React single-page application with client-side routing
- Context API for authentication and cart state
- REST API built with Express
- MongoDB persistence through Mongoose
- Password hashing with bcryptjs
- JWT-based authentication and role-aware middleware
- Toast notifications for user feedback
- Responsive interface built with Tailwind CSS

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, React Router, Tailwind CSS 4 |
| UI & notifications | Lucide React, React Toastify |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose 9 |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| Language style | JavaScript ES Modules |

## Project Structure

```text
deepstore-ecommerce-project/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── sellerMiddleware.js
│   │   └── userAuthMiddleware.js
│   ├── models/
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── componenets/
    │   ├── context/
    │   ├── data/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js (a current LTS release is recommended)
- npm
- MongoDB database (local MongoDB or MongoDB Atlas)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/deepstore-ecommerce-project.git
cd deepstore-ecommerce-project
```

Replace `YOUR-USERNAME` with your GitHub username and adjust the repository URL if you use a different repository name.

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

Do not commit your real `.env` file or expose your database URI or JWT secret.

Start the backend:

```bash
npm run dev
```

The backend runs at `http://localhost:5000` by default.

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173`.

**API URL configuration:** The current frontend code references the deployed API URL `https://full-stack-ecommerce-xn8q.onrender.com` in `frontend/src/context/CartContext.jsx`. To use your local backend, replace those API base URL references with `http://localhost:5000`, or refactor them to use a Vite environment variable such as `VITE_API_URL`.

For an environment-variable setup, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Then use `import.meta.env.VITE_API_URL` as the API base URL in the frontend. Restart the Vite server after changing environment variables.

## API Overview

Base URL: `http://localhost:5000`

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/` | Backend health message | Public |
| POST | `/api/users/signup` | Register a customer | Public |
| POST | `/api/users/login` | Log in | Public |
| POST | `/api/users/become-seller` | Create a seller profile | Authenticated |
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get one product | Public |
| POST | `/api/products` | Create a product | Seller/Admin |
| PUT | `/api/products/:id` | Update a product | Owner Seller/Admin |
| DELETE | `/api/products/:id` | Delete a product | Owner Seller/Admin |
| POST | `/api/orders` | Place an order | Authenticated |
| GET | `/api/orders/my-orders` | Get current user's orders | Authenticated |
| GET | `/api/orders/all` | Get all orders | Admin |
| GET | `/api/orders/seller` | Get orders containing seller products | Seller |
| PUT | `/api/orders/:id/status` | Update an order status | Admin |
| PUT | `/api/orders/seller/:id/status` | Update an eligible seller order | Seller |

Protected API requests use the JWT returned by the login endpoint:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Available Frontend Routes

| Route | Page |
|---|---|
| `/login` | Login |
| `/signup` | Sign up |
| `/` | Product catalogue (authenticated users) |
| `/product/:id` | Product details |
| `/cart` | Shopping cart |
| `/checkout` | Checkout |
| `/my-orders` | Customer order history |
| `/become-seller` | Seller registration |
| `/seller` | Seller dashboard |
| `/admin` | Admin dashboard |

## Scripts

### Backend

```bash
npm start       # Start the API server
npm run dev     # Start with nodemon
```

### Frontend

```bash
npm run dev     # Start Vite development server
npm run build   # Create a production build
npm run preview # Preview the production build
npm run lint    # Run ESLint
```

## Screenshots

Add screenshots of the application here to showcase the interface.

```text
docs/
├── home.png
├── product-details.png
├── cart.png
├── checkout.png
└── dashboard.png
```

For example, once screenshots are added to the repository, embed them with:

```md
![DEEPSTORE product catalogue](docs/home.png)
```

## Security Notes

- Keep `.env` files out of version control.
- Use a strong, unique `JWT_SECRET`.
- Restrict database access and use a least-privilege MongoDB account.
- Configure CORS for the frontend domains you actually trust before deployment.
- Configure the frontend API base URL for the environment where the app is running.
- Create or promote administrator accounts through a controlled database/admin process; do not expose admin credentials in source code.

## Future Improvements

- Add automated tests for API endpoints and frontend flows.
- Add product image upload and cloud storage integration.
- Improve server-side validation and centralized error handling.
- Add pagination and advanced product filtering.
- Add payment gateway integration.
- Add deployment and CI/CD documentation.

## Contributing

Contributions, suggestions, and bug reports are welcome. For significant changes, open an issue first to discuss what you would like to improve.

## License

No license has been specified yet. Add a `LICENSE` file before allowing others to reuse, modify, or distribute this project.

---

Built as a full-stack e-commerce project with the MERN stack.
