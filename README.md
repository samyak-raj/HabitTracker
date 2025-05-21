# HabitTracker

A full-stack web application for tracking and managing daily habits, built with modern web technologies.

## 🚀 Tech Stack

### Frontend
- HTML/CSS/JS (Vite)
- Clerk for authentication
- Modern UI/UX design

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Clerk for authentication
- Svix for webhook (for syncing clerk auth with mongoDB)
- RESTful API architecture

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## 🔧 Environment Setup

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   PORT=5000
   ```

## 🚀 Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

### Production Build

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

## 📁 Project Structure

```
HabitTracker/
├── frontend/               # React frontend application
│   ├── src/               # Source files
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
│
└── backend/               # Node.js backend application
    ├── controllers/       # Route controllers
    ├── models/           # Database models
    ├── routes/           # API routes
    ├── middleware/       # Custom middleware
    ├── db/               # Database configuration
    └── server.js         # Entry point
```

## 🔒 Authentication

This project uses Clerk for authentication, providing:
- User registration and login
- Secure session management
- Protected routes and API endpoints

## 📝 API Documentation

The backend provides a RESTful API with the following endpoints:

- `POST /api/habits` - Create a new habit
- `GET /api/habits` - Get all habits
- `GET /api/habits/:id` - Get a specific habit
- `PUT /api/habits/:id` - Update a habit
- `DELETE /api/habits/:id` - Delete a habit

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

