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

### What is a JWT?

A JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. In this application, it is used to securely transmit information between the client (the user's browser) and the server. A JWT consists of three parts: a header, a payload, and a signature.

- **Header**: Contains the type of token (JWT) and the signing algorithm used (e.g., HS256).
- **Payload**: Contains the "claims," which are statements about an entity (typically, the user) and additional data. In our case, the payload contains the user's ID (`userId`).
- **Signature**: Used to verify that the sender of the JWT is who it says it is and to ensure that the message wasn't changed along the way. It is created by taking the encoded header, the encoded payload, a secret, and signing it with the algorithm specified in the header.

### JWT Lifecycle in HabitHero

1.  **Token Generation**:
    -   After a user successfully authenticates with Google, the `generateToken` function in `middleware/auth.js` is called.
    -   This function creates a new JWT with the user's MongoDB `_id` as the payload.
    -   The token is signed with a secret key stored in the environment variable `JWT_SECRET`. This secret is crucial for the security of the token, as it is used to verify the token's authenticity.
    -   The token is configured to expire in 7 days, after which the user will need to log in again.

2.  **Token Storage**:
    -   The generated JWT is sent back to the client in the response to the login request.
    -   The frontend application then stores this token in the browser's `localStorage`. Storing the token here allows the application to remember the user's session across browser refreshes and new tabs.

3.  **Token Usage**:
    -   For any subsequent request to a protected API endpoint (e.g., fetching habits, updating the user profile), the frontend retrieves the JWT from `localStorage`.
    -   It then includes the token in the `Authorization` header of the HTTP request, using the `Bearer` schema. For example: `Authorization: Bearer <your_jwt_token>`.

4.  **Token Verification**:
    -   The `requireAuth` middleware in `middleware/auth.js` is applied to all protected routes on the server.
    -   This middleware inspects the `Authorization` header of incoming requests to find the JWT.
    -   It uses the `jwt.verify()` function to decode and verify the token. This function checks two things:
        1.  **Signature Verification**: It uses the same `JWT_SECRET` to verify that the token's signature is valid. This ensures the token was not tampered with.
        2.  **Expiration Check**: It checks if the token has expired.
    -   If the token is valid and not expired, the middleware extracts the `userId` from the token's payload.
    -   It then queries the database to find the user associated with that `userId`.
    -   The user object is then attached to the `request` object (as `req.user`), making it accessible in the route's controller.
    -   If the token is missing, invalid, or expired, the middleware sends a `401 Unauthorized` response, preventing access to the protected route.
