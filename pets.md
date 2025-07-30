# Pets Management

This document explains how pets are managed in the HabitHero application.

## Getting All Pets

- **Endpoint**: `GET /api/pets`
- **Controller**: `petController.js` -> `getPets`
- **Description**:
  - This endpoint retrieves a list of all available pets from the database.
  - It is a public endpoint and does not require authentication.

## Adding a Pet

- **Endpoint**: `POST /api/pets`
- **Controller**: `petController.js` -> `addPet`
- **Description**:
  - This endpoint allows an administrator to add a new pet to the store.
  - The request body should include the pet's `name`, `image`, `description`, and `cost`.

## Updating a Pet

- **Endpoint**: `PUT /api/pets/:id`
- **Controller**: `petController.js` -> `updatePet`
- **Description**:
  - This endpoint allows an administrator to update an existing pet's details.
  - The `id` of the pet to be updated is passed as a URL parameter.
  - The request body can include the `name`, `image`, `description`, and `cost`.

## Deleting a Pet

- **Endpoint**: `DELETE /api/pets/:id`
- **Controller**: `petController.js` -> `deletePet`
- **Description**:
  - This endpoint allows an administrator to delete a pet from the store.
  - The `id` of the pet to be deleted is passed as a URL parameter.

## Buying a Pet

- **Endpoint**: `POST /api/pets/buy`
- **Controller**: `petController.js` -> `buyPet`
- **Description**:
  - This endpoint allows a user to purchase a pet.
  - It requires authentication, and the user must have enough coins to buy the pet.
  - The request body should include the `petId` of the pet to be purchased.
  - Upon successful purchase, the pet is added to the user's collection, and the cost is deducted from the user's coins.
