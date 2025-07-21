# Authentication Flow

This document explains the authentication process in the HabitHero application, which uses Google OAuth2.

## Google OAuth2 Authentication

- **Endpoint**: `POST /api/users/auth/google`
- **Controller**: `userController.js` -> `googleAuth`
- **Description**:
  - The frontend sends a Google ID token to the backend.
  - The backend verifies the token using the `google-auth-library`.
  - The user's `googleId`, `email`, `name`, and `picture` are extracted from the token payload.
  - The system checks if a user with the `googleId` already exists.
  - If the user exists, they are logged in.
  - If the user does not exist, a new user is created with the information from the Google token.
  - A JSON Web Token (JWT) is generated and sent back to the user, which is then stored in the browser's local storage for session management.

## Protected Routes

- **Middleware**: `auth.js`
- **Description**:
  - Certain routes are protected and require a valid JWT.
  - The `auth` middleware, checks for the presence of a token in the request headers.
  - If the token is valid, the user's information is attached to the request object, and the request is allowed to proceed.
  - If the token is missing or invalid, an "unauthorized" error is returned.
