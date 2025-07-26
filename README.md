
# 👗 Evening Dress Rental – Fullstack Web App

A fullstack web application for managing and mediating evening dress rentals, built with vanilla JavaScript on the client side, Node.js and Express on the backend, and MongoDB as the database.

---

## 🎯 Overview

This platform supports multiple user roles:

- **Guest:** Can browse dresses and filter results by color, price range, size combinations, rating, and location.
- **Registered User:** Can rate dresses (1–5 stars) and leave comments.
- **Business Owner:** Can add, update, delete, and manage their own dresses.

---

## 🧩 Key Features

- Advanced filtering by color, price range, size combinations, rating, and geographic location.
- Detailed dress view: sizes, price, location, rating, and user comments.
- Star-based rating system (1 to 5).
- Add, update, and delete dresses (business owners only).
- Verified user comments and ratings.
- JWT-based authentication and role-based permissions.
- Intuitive and user-friendly interface.

---

## 🛠 Technologies Used

### Client (Frontend)
- HTML5, CSS3
- JavaScript (DOM manipulation, Fetch API)

### Server (Backend)
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication and authorization
- dotenv for environment variables
- Multer for file uploads (e.g., dress images)
- Custom middlewares for error handling and security

---

## 📁 Folder Structure

```
evening-dress-rental/
├── client/
│   ├── css/            # CSS stylesheets
│   ├── html/           # HTML pages
│   └── js/             # Client-side JavaScript scripts
│
├── server/
│   ├── Controller/     # Business logic and actions (dresses, users, etc.)
│   ├── DB/             # Database connection setup
│   ├── MiddleWare/     # Middlewares (authentication, error handling)
│   ├── Model/          # MongoDB schemas and models (dress, user, rating, etc.)
│   ├── Routes/         # API route definitions
│   ├── Services/       # Helper services (email, file management, etc.)
│   ├── uploads/        # Uploaded files storage (dress images)
│   ├── express.js      # Server setup and Express configuration
│   └── .env            # Environment variables (not committed to Git)
│
├── .gitignore
├── README.md
```

---

## 🔐 Authentication and Authorization

- JWT-based authentication.
- Users register and login to receive a token.
- Token must be included in protected API request headers (`Authorization: Bearer <token>`).
- Role-based permissions: guest, registered user, business owner.

---

## 🚀 Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/Miri-Altman/evening-dress-rental.git
cd evening-dress-rental
```

2. **Install backend dependencies:**

```bash
cd server
npm install
```

3. **Create a `.env` file in the server directory with the following:**

```
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
```

4. **Run the server (development mode):**

```bash
npm run dev
```

5. **Open the client side in your browser:**

Open `client/html/index.html` or serve it using Live Server.

---

## 📄 License

This project is open-source under the MIT License.

---

If you need example code snippets or help expanding the project, I’m here to assist!  
Good luck with your amazing project! 👗✨
