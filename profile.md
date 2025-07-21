# User Profile

This document explains the user profile page in the HabitHero application.

## Viewing Profile Information

- **Endpoint**: `GET /api/users/me`
- **Controller**: `userController.js` -> `getMe`
- **Description**:
  - The user's profile information, such as `username`, `email`, and `profilePicture`, is fetched from this endpoint.
  - The data is then displayed on the profile page.

## Updating Profile Information

- **Endpoint**: `PUT /api/users/update`
- **Controller**: `userController.js` -> `updateUser`
- **Description**:
  - Users can update their `username` and `email`.
  - The updated information is sent to the server and saved in the database.

## Uploading a Profile Picture

- **Endpoint**: `POST /api/users/upload-pic`
- **Controller**: `userController.js` -> `uploadProfilePic`
- **Middleware**: `upload.js` (using `multer`)
- **Description**:
  - Users can upload a new profile picture.
  - The `upload` middleware handles the file upload and saves the image to the `public/profile-pics` directory.
  - The path to the new profile picture is then saved in the user's document in the database.
