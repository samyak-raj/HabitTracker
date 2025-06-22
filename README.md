# HabitTracker

A full-stack web application for tracking and managing daily habits, built with modern web technologies.

## 🚀 Tech Stack

### Frontend
- HTML/CSS/JS (Vite)
- Google OAuth with JWT for authentication
- Modern UI/UX design

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens) for authentication
- Google OAuth integration
- RESTful API architecture

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Google Cloud Console account (for OAuth setup)

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
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
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
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   PORT=5000
   ```

## 🔐 Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an "OAuth 2.0 Client ID"
5. Set the authorized JavaScript origins to:
   - `http://localhost:5173` (for development)
   - Your production domain (for production)
6. Copy the Client ID and add it to both frontend and backend `.env` files

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
├── frontend/               # Frontend application
│   ├── src/               # Source files
│   │   ├── components/    # UI components
│   │   │   ├── homePage/  # Home page components
│   │   │   └── landingPage/ # Landing page components
│   │   └── main.js        # Entry point
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
│
└── backend/               # Node.js backend application
    ├── controllers/       # Route controllers
    ├── models/           # Database models
    ├── routes/           # API routes
    ├── middleware/       # Custom middleware (JWT auth)
    ├── db/               # Database configuration
    └── server.js         # Entry point
```

## 🔒 Authentication

This project uses JWT (JSON Web Tokens) with Google OAuth for authentication, providing:
- Secure Google OAuth login
- JWT token-based session management
- Protected routes and API endpoints
- Persistent login sessions using localStorage

### Authentication Flow
1. User clicks "Sign in with Google" button
2. Google OAuth popup opens for authentication
3. After successful Google authentication, frontend sends token to backend
4. Backend verifies Google token and creates/updates user in database
5. Backend generates JWT token and returns it to frontend
6. Frontend stores JWT token in localStorage
7. All subsequent API requests include JWT token in Authorization header

## 📝 API Documentation

The backend provides a RESTful API with the following endpoints:

### Authentication
- `POST /api/users/auth/google` - Google OAuth authentication
- `GET /api/users/me` - Get current user profile

### Habits
- `POST /api/habits` - Create a new habit
- `GET /api/habits/user` - Get all habits for current user
- `GET /api/habits/:id` - Get a specific habit
- `PUT /api/habits/:id` - Update a habit
- `DELETE /api/habits/:id` - Delete a habit
- `POST /api/habits/:id/complete` - Complete a habit for today

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



