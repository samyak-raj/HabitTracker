# Database Schema

This document provides an overview of the database schema for the HabitHero application, focusing on the `User` and `Habit` models.

## User Model (`models/User.js`)

- **`googleId`**: (String, required, unique) - The user's unique Google ID.
- **`email`**: (String, required, unique) - The user's email address.
- **`username`**: (String, required) - The user's display name.
- **`profilePicture`**: (String) - The URL to the user's profile picture.
- **`level`**: (Number, default: 1) - The user's current level.
- **`experience`**: (Number, default: 0) - The user's current experience points.
- **`currentStreak`**: (Number, default: 0) - The user's current daily login streak.
- **`longestStreak`**: (Number, default: 0) - The user's longest daily login streak.
- **`lastCompletedDate`**: (Date) - The date the user last completed a daily goal.

## Habit Model (`models/Habit.js`)

- **`user`**: (ObjectId, ref: 'User', required) - A reference to the `User` who owns the habit.
- **`name`**: (String, required) - The name of the habit (e.g., "Exercise for 30 minutes").
- **`description`**: (String) - A more detailed description of the habit.
- **`streak`**: (Number, default: 0) - The number of consecutive days the habit has been completed.
- **`lastCompleted`**: (Date) - The date the habit was last marked as complete.

## Relationships

- **One-to-Many**: A `User` can have multiple `Habits`. This is represented by the `user` field in the `Habit` model, which creates a relationship between a habit and its owner.
