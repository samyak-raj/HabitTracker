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
- **`title`**: (String, required) - The name of the habit.
- **`description`**: (String) - A more detailed description of the habit.
- **`category`**: (String, enum: ['health', 'fitness', 'learning', 'productivity', 'mindfulness', 'other']) - The category of the habit.
- **`difficulty`**: (String, enum: ['easy', 'medium', 'hard']) - The difficulty level of the habit.
- **`experiencePoints`**: (Number) - The experience points awarded for completing the habit, determined by difficulty.
- **`status`**: (String, enum: ['active', 'completed']) - The current status of the habit.
- **`progress`**: (Array of Objects) - An array that tracks the daily progress of the habit.
  - **`date`**: (Date) - The date of the progress entry.
  - **`completed`**: (Boolean) - Whether the habit was completed on that date.
  - **`value`**: (Number) - A numerical value for progress, if applicable.
  - **`notes`**: (String) - Any notes for that day's progress.

## Pet Model (`models/Pet.js`)

- **`name`**: (String, required) - The name of the pet.
- **`image`**: (String, required) - The URL to the pet's image.
- **`description`**: (String) - A brief description of the pet.
- **`cost`**: (Number, required) - The cost of the pet in coins.

## Relationships

- **One-to-Many**: A `User` can have multiple `Habits`. This is represented by the `user` field in the `Habit` model, which creates a relationship between a habit and its owner.
- **Many-to-Many**: A `User` can own multiple `Pets`, and a `Pet` can be owned by multiple `Users`. This is implemented by storing an array of `Pet` ObjectIds in the `pets` field of the `User` model.
