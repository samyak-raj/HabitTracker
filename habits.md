# Habits Management

This document explains how habits are managed in the HabitHero application.

## Creating a Habit

- **Endpoint**: `POST /api/habits`
- **Controller**: `habitController.js` -> `createHabit`
- **Description**:
  - Users can create a new habit by providing a `name` and `description`.
  - The habit is associated with the logged-in user.
  - A new `Habit` object is created and saved to the database.

## Reading Habits

- **Endpoint**: `GET /api/habits`
- **Controller**: `habitController.js` -> `getHabits`
- **Description**:
  - This endpoint retrieves all habits for the logged-in user.
  - The habits are then displayed on the dashboard and the habits page.

## Updating a Habit

- **Endpoint**: `PUT /api/habits/:id`
- **Controller**: `habitController.js` -> `updateHabit`
- **Description**:
  - Users can update an existing habit's `name` and `description`.
  - The `id` of the habit to be updated is passed as a URL parameter.

## Deleting a Habit

- **Endpoint**: `DELETE /api/habits/:id`
- **Controller**: `habitController.js` -> `deleteHabit`
- **Description**:
  - Users can delete a habit by its `id`.
  - The corresponding habit is removed from the database.

## Tracking Habit Completion

- **Endpoint**: `POST /api/habits/:id/track`
- **Controller**: `habitController.js` -> `trackHabit`
- **Description**:
  - When a user marks a habit as complete for the day, a request is sent to this endpoint.
  - The system updates the habit's `streak` and `lastCompleted` date.
  - If the habit is completed on consecutive days, the streak increases. If a day is missed, the streak resets.
