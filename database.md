# Database Schema

This document provides an overview of the database schema for the HabitHero application, focusing on the `User` and `Habit` models.

## User Model (`models/User.js`)

- **`username`**: (String, required, unique) - The user's chosen username.
- **`email`**: (String, required, unique) - The user's email address, used for login.
- **`password`**: (String, required) - The user's hashed password.
- **`profilePicture`**: (String) - The path to the user's profile picture.

## Habit Model (`models/Habit.js`)

- **`user`**: (ObjectId, ref: 'User', required) - A reference to the `User` who owns the habit.
- **`name`**: (String, required) - The name of the habit (e.g., "Exercise for 30 minutes").
- **`description`**: (String) - A more detailed description of the habit.
- **`streak`**: (Number, default: 0) - The number of consecutive days the habit has been completed.
- **`lastCompleted`**: (Date) - The date the habit was last marked as complete.

## Relationships

- **One-to-Many**: A `User` can have multiple `Habits`. This is represented by the `user` field in the `Habit` model, which creates a relationship between a habit and its owner.
