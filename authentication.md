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

## JWT for Authorization

- **Generation**:
  - After a user successfully authenticates via Google, a JWT is generated using the `generateToken` function in `middleware/auth.js`.
  - The token is signed with a secret key (`process.env.JWT_SECRET`) and contains the user's ID in the payload.
  - The token is set to expire in 7 days.

- **Usage**:
  - The JWT is sent to the client and stored in local storage.
  - For subsequent requests to protected routes, the token is included in the `Authorization` header as a `Bearer` token.

- **Verification**:
  - The `requireAuth` middleware in `middleware/auth.js` is used to protect routes.
  - It extracts the token from the `Authorization` header.
  - It verifies the token using `jwt.verify`.
  - If the token is valid, it decodes the payload to get the user's ID.
  - It then fetches the user from the database and attaches the user object to the request (`req.user`), making it available to the controller.
  - If the token is invalid or expired, it returns a 401 Unauthorized error.
