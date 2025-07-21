# Authentication Flow

This document explains the authentication process in the HabitHero application.

## User Registration

- **Endpoint**: `POST /api/users/register`
- **Controller**: `userController.js` -> `registerUser`
- **Description**:
  - The user provides a `username`, `email`, and `password`.
  - The password is encrypted using `bcrypt`.
  - A new `User` object is created and saved to the database.
  - A JSON Web Token (JWT) is generated and sent back to the user, which is then stored in the browser's local storage.

## User Login

- **Endpoint**: `POST /api/users/login`
- **Controller**: `userController.js` -> `loginUser`
- **Description**:
  - The user provides their `email` and `password`.
  - The system checks if a user with the given email exists.
  - If the user exists, the provided password is
- **Endpoint**: `POST /api/users/login`
- **Controller**: `userController.js` -> `loginUser`
- **Description**:
  - The user provides their `email` and `password`.
  - The system checks if a user with the given email exists.
  - If the user exists, the provided password is compared with the hashed password in the database.
  - If the credentials are correct, a new JWT is generated and sent to the user.

## Protected Routes

- **Middleware**: `auth.js`
- **Description**:
  - Certain routes (e.g., fetching user-specific data) are protected and require a valid JWT.
  - The `auth` middleware checks for the presence of a token in the request headers.
  - If the token is valid, the user's information is attached to the request object, and the request is allowed to proceed.
  - If the token is missing or invalid, an "unauthorized" error is returned.
  compared with the hashed password in the database.
  - If the credentials are correct, a new JWT is generated and sent to the user.

## Protected Routes

- **Middleware**: `auth.js`
- **Description**:
  - Certain routes (e.g., fetching user-specific data) are protected and require a valid JWT.
  - The `auth` middleware checks for the presence of a token in the request headers.
  - If the token is valid, the user's information is attached to the request object, and the request is allowed to proceed.
  - If the token is missing or invalid, an "unauthorized" error is returned.
