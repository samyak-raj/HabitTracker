# Dashboard

This document explains the functionality of the dashboard in the HabitHero application.

## Fetching User Data

- **Endpoint**: `GET /api/users/me`
- **Controller**: `userController.js` -> `getUserById`
- **Description**:
  - This route is protected and requires a valid JWT.
  - When the dashboard page loads, a request is sent to this endpoint to fetch the logged-in user's data.
  - The `auth` middleware verifies the token and attaches the user's information to the request object.
  - The `getUserById` controller then retrieves the user's `username`, `email`, and `profilePicture` from the database and sends it back to the client.

## Displaying Habits

- **Endpoint**: `GET /api/habits`
- **Controller**: `habitController.js` -> `getHabits`
- **Description**:
  - This route is also protected.
  - A request is sent to this endpoint to get all the habits associated with the logged-in user.
  - The habits are then displayed on the dashboard, showing their names, streaks, and completion status.

## Progress Tracking

- **Description**:
  - The dashboard provides a visual representation of the user's progress.
  - It shows the current streak for each habit and how many days the user has consecutively completed it.
  - This helps users stay motivated and track their progress over time.
