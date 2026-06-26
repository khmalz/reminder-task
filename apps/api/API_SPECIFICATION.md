# API Specification - Reminder Task

This document contains the complete API specification for the **Reminder Task** backend, organized by module.

## General Information
- **Base URL**: `/api` (or configured port, typically `http://localhost:3000` or `http://localhost:3001`)
- **Authentication**: Most endpoints require a JSON Web Token (JWT) passed in the HTTP `Authorization` header as a Bearer token:
  ```http
  Authorization: Bearer <your_jwt_token>
  ```
- **Response Format**: All response bodies are in JSON format.

---

## Table of Contents
1. [Authentication Module (`/auth`)](#1-authentication-module)
2. [Profile Module (`/profile`)](#2-profile-module)
3. [Category Module (`/category`)](#3-category-module)
4. [Task Module (`/tasks`)](#4-task-module)
5. [Pomodoro Module (`/pomodoro`)](#5-pomodoro-module)

---

## 1. Authentication Module
Base path: `/auth`

Endpoints in this module handle user registration, login, and logout.

### `POST /auth/register`
Registers a new user account.
*   **Authentication**: None
*   **Request Body**:
    *   `username` (string, required): A unique username.
    *   `name` (string, required): The user's display name.
    *   `password` (string, required, min 8 characters): The user's password.
*   **Responses**:
    *   **201 Created**: User successfully registered.
        ```json
        {
           "id": "cmhyb5qrw0000t2g4t88y6zb2",
           "username": "johndoe",
           "name": "John Doe",
           "createdAt": "2025-11-14T03:38:23.564Z",
           "updatedAt": "2025-11-14T03:38:23.564Z"
        }
        ```
    *   **400 Bad Request**: Validation failed (e.g., empty username or password too short).
        ```json
        {
           "statusCode": 400,
           "message": [
              "username should not be empty",
              "Password minimal harus 8 karakter"
           ],
           "error": "Bad Request"
        }
        ```
    *   **409 Conflict**: Username is already registered.
        ```json
        {
           "statusCode": 409,
           "message": "Username sudah terdaftar",
           "error": "Conflict"
        }
        ```

### `POST /auth/login`
Logs in an existing user and returns a JWT access token.
*   **Authentication**: None
*   **Request Body**:
    *   `username` (string, required): The registered username.
    *   `password` (string, required, min 8 characters): The user's password.
*   **Responses**:
    *   **200 OK**: Login successful. Returns the JWT token and basic user info.
        ```json
        {
           "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
           "user": {
              "username": "johndoe",
              "name": "John Doe"
           }
        }
        ```
    *   **400 Bad Request**: Validation failed (e.g., empty credentials).
        ```json
        {
           "statusCode": 400,
           "message": [
              "username should not be empty",
              "password must be longer than or equal to 8 characters"
           ],
           "error": "Bad Request"
        }
        ```
    *   **401 Unauthorized**: Invalid credentials.
        ```json
        {
           "statusCode": 401,
           "message": "Username atau password salah",
           "error": "Unauthorized"
        }
        ```

### `POST /auth/logout`
Logs out the current user (invalidates the token client-side).
*   **Authentication**: Bearer Token
*   **Responses**:
    *   **200 OK**: Logout successful.
        ```json
        {
           "message": "Logout berhasil. Pastikan token dihapus di sisi klien."
        }
        ```
    *   **401 Unauthorized**: Invalid or missing token.
        ```json
        {
           "statusCode": 401,
           "message": "Unauthorized"
        }
        ```

---

## 2. Profile Module
Base path: `/profile`

Endpoints in this module allow users to update their profile and change their password.

### `PATCH /profile`
Updates the user's username and display name.
*   **Authentication**: Bearer Token
*   **Request Body**:
    *   `username` (string, optional): New unique username.
    *   `name` (string, optional): New display name.
*   **Responses**:
    *   **200 OK**: Profile updated successfully.
        ```json
        {
           "id": "cmhyb5qrw0000t2g4t88y6zb2",
           "username": "johndoe_updated",
           "name": "John Doe Updated",
           "createdAt": "2025-11-14T03:38:23.564Z",
           "updatedAt": "2025-11-14T09:00:00.000Z"
        }
        ```
    *   **400 Bad Request**: Validation failed.
        ```json
        {
           "statusCode": 400,
           "message": [
              "username should not be empty",
              "name should not be empty"
           ],
           "error": "Bad Request"
        }
        ```
    *   **401 Unauthorized**: Invalid or missing token.
        ```json
        {
           "statusCode": 401,
           "message": "Unauthorized"
        }
        ```
    *   **404 Not Found**: User not found.
        ```json
        {
           "statusCode": 404,
           "message": "User tidak ditemukan",
           "error": "Not Found"
        }
        ```
    *   **409 Conflict**: Username is already taken by another user.
        ```json
        {
           "statusCode": 409,
           "message": "Username sudah digunakan oleh user lain",
           "error": "Conflict"
        }
        ```

### `PATCH /profile/password`
Updates the user's password.
*   **Authentication**: Bearer Token
*   **Request Body**:
    *   `oldPassword` (string, required): Current password.
    *   `newPassword` (string, required, min 8 characters): New password.
*   **Responses**:
    *   **200 OK**: Password updated successfully.
        ```json
        {
           "message": "Password berhasil diupdate"
        }
        ```
    *   **400 Bad Request**: Validation failed (e.g., passwords too short).
        ```json
        {
           "statusCode": 400,
           "message": [
              "oldPassword should not be empty",
              "Password minimal harus 8 karakter"
           ],
           "error": "Bad Request"
        }
        ```
    *   **401 Unauthorized**: Current password is incorrect or invalid token.
        ```json
        {
           "statusCode": 401,
           "message": "Password lama tidak sesuai",
           "error": "Unauthorized"
        }
        ```
    *   **404 Not Found**: User not found.
        ```json
        {
           "statusCode": 404,
           "message": "User tidak ditemukan",
           "error": "Not Found"
        }
        ```

---

## 3. Category Module
Base path: `/category`

Endpoints in this module manage task categories. Categories are classified into types: `TASK_KIND`, `TASK_TYPE`, and `TASK_COLLECTION`.

### `POST /category`
Creates a new custom category.
*   **Authentication**: Bearer Token
*   **Request Body**:
    *   `title` (string, required): Title of the category.
    *   `categoryTypeName` (string, required): Must be one of `TASK_KIND`, `TASK_TYPE`, `TASK_COLLECTION`.
*   **Responses**:
    *   **201 Created**: Category successfully created.
        ```json
        {
           "id": "cmhylpk2y0001t2xotqf0xc7a",
           "title": "Solo Work",
           "typeId": 2,
           "userId": "cmhyb5qrw0000t2g4t88y6zb2",
           "createdAt": "2025-11-14T08:33:44.167Z",
           "updatedAt": "2025-11-14T08:33:44.167Z"
        }
        ```
    *   **400 Bad Request**: Validation failed (invalid type or empty title).
        ```json
        {
           "statusCode": 400,
           "message": [
              "title should not be empty",
              "categoryTypeName must be one of the following values: TASK_KIND, TASK_TYPE, TASK_COLLECTION"
           ],
           "error": "Bad Request"
        }
        ```
    *   **401 Unauthorized**: Invalid or missing token.
        ```json
        {
           "statusCode": 401,
           "message": "Unauthorized"
        }
        ```
    *   **404 Not Found**: The specified category type has not been seeded in the database.
        ```json
        {
           "statusCode": 404,
           "message": "CategoryType: TASK_TYPE belum di-seed.",
           "error": "Not Found"
        }
        ```

### `GET /category`
Retrieves all categories, filtered by their category type.
*   **Authentication**: Bearer Token
*   **Query Parameters**:
    *   `type` (string, required): Category type to filter by. Must be one of `TASK_KIND`, `TASK_TYPE`, `TASK_COLLECTION`.
*   **Responses**:
    *   **200 OK**: List of categories retrieved successfully.
        ```json
        [
           {
              "id": "cmhylpk2y0001t2xotqf0xc7a",
              "title": "Solo Work",
              "typeId": 2,
              "userId": "cmhyb5qrw0000t2g4t88y6zb2",
              "createdAt": "2025-11-14T08:33:44.167Z",
              "updatedAt": "2025-11-14T08:33:44.167Z"
           },
           {
              "id": "cmhylq1u40003t2xovuw9oun1",
              "title": "Meeting",
              "typeId": 2,
              "userId": "cmhyb5qrw0000t2g4t88y6zb2",
              "createdAt": "2025-11-14T08:34:07.180Z",
              "updatedAt": "2025-11-14T08:34:07.180Z"
           }
        ]
        ```
    *   **400 Bad Request**: Invalid `type` parameter.
        ```json
        {
           "statusCode": 400,
           "message": [
              "type must be one of the following values: TASK_KIND, TASK_TYPE, TASK_COLLECTION"
           ],
           "error": "Bad Request"
        }
        ```
    *   **401 Unauthorized**: Invalid or missing token.
        ```json
        {
           "statusCode": 401,
           "message": "Unauthorized"
        }
        ```
    *   **404 Not Found**: Category type not seeded.
        ```json
        {
           "statusCode": 404,
           "message": "CategoryType: TASK_TYPE belum di-seed.",
           "error": "Not Found"
        }
        ```

### `PUT /category/:id`
Updates an existing custom category.
*   **Authentication**: Bearer Token
*   **URL Path Parameters**:
    *   `id` (string, required): Category ID.
*   **Request Body**:
    *   `title` (string, optional): Updated title of the category.
    *   `categoryTypeName` (string, optional): Must be one of `TASK_KIND`, `TASK_TYPE`, `TASK_COLLECTION`.
*   **Responses**:
    *   **200 OK**: Category updated successfully.
        ```json
        {
           "id": "cmhylpk2y0001t2xotqf0xc7a",
           "title": "Solo Work (Updated)",
           "typeId": 2,
           "userId": "cmhyb5qrw0000t2g4t88y6zb2",
           "createdAt": "2025-11-14T08:33:44.167Z",
           "updatedAt": "2025-11-14T08:40:00.000Z"
        }
        ```
    *   **400 Bad Request**: Validation failed.
        ```json
        {
           "statusCode": 400,
           "message": [
              "title should not be empty"
           ],
           "error": "Bad Request"
        }
        ```
    *   **401 Unauthorized**: Invalid or missing token.
        ```json
        {
           "statusCode": 401,
           "message": "Unauthorized"
        }
        ```
    *   **403 Forbidden**: Cannot update category owned by another user or a system category.
        ```json
        {
           "statusCode": 403,
           "message": "Anda hanya dapat mengubah Category custom milik Anda.",
           "error": "Forbidden"
        }
        ```
    *   **404 Not Found**: Category not found.
        ```json
        {
           "statusCode": 404,
           "message": "Category tidak ditemukan.",
           "error": "Not Found"
        }
        ```

### `DELETE /category/:id`
Deletes a custom category.
*   **Authentication**: Bearer Token
*   **URL Path Parameters**:
    *   `id` (string, required): Category ID.
*   **Responses**:
    *   **200 OK**: Category deleted successfully.
        ```json
        {
           "message": "Category berhasil dihapus."
        }
        ```
    *   **401 Unauthorized**: Invalid or missing token.
        ```json
        {
           "statusCode": 401,
           "message": "Unauthorized"
        }
        ```
    *   **403 Forbidden**: Cannot delete category owned by another user or a system category.
        ```json
        {
           "statusCode": 403,
           "message": "Anda hanya dapat mengubah Category custom milik Anda.",
           "error": "Forbidden"
        }
        ```
    *   **404 Not Found**: Category not found.
        ```json
        {
           "statusCode": 404,
           "message": "Category tidak ditemukan.",
           "error": "Not Found"
        }
        ```

---

## 4. Task Module
Base path: `/tasks`

Endpoints in this module allow users to manage their tasks. Tasks can be associated with multiple categories (many-to-many relationship).

### `POST /tasks`
Creates a new task.
*   **Authentication**: Bearer Token
*   **Request Body**:
    *   `title` (string, required): The title of the task.
    *   `isCompleted` (boolean, optional, default: `false`): Initial completion status of the task.
    *   `dueDateAt` (string, required, ISO-8601 format): The due date of the task.
    *   `categoryIds` (array of strings, required): An array of category CUIDs to associate with the task.
*   **Responses**:
    *   **201 Created**: Task successfully created with its category relations.
        ```json
        {
           "id": "cmhylu9em0007t2xoz82fx2ms",
           "title": "Selesaikan coding task routes (v2 - Many-to-Many)",
           "isCompleted": false,
           "dueDateAt": "2025-11-20T17:00:00.000Z",
           "userId": "cmhyb5qrw0000t2g4t88y6zb2",
           "createdAt": "2025-11-14T08:37:23.614Z",
           "updatedAt": "2025-11-14T08:37:23.614Z",
           "categoryToTasks": [
              {
                 "category": {
                    "id": "cmhylq1u40003t2xovuw9oun1",
                    "title": "Zoom Link",
                    "typeName": "TASK_COLLECTION"
                 }
              },
              {
                 "category": {
                    "id": "cmhylpk2y0001t2xotqf0xc7a",
                    "title": "Solo Work",
                    "typeName": "TASK_TYPE"
                 }
              }
           ]
        }
        ```
    *   **400 Bad Request**: Validation failed (e.g., empty title, or categoryIds is not an array).
        ```json
        {
           "statusCode": 400,
           "message": [
              "title should not be empty",
              "categoryIds must be an array"
           ],
           "error": "Bad Request"
        }
        ```
    *   **401 Unauthorized**: Invalid or missing token.
        ```json
        {
           "statusCode": 401,
           "message": "Unauthorized"
        }
        ```

### `GET /tasks`
Retrieves all tasks for the authenticated user.
*   **Authentication**: Bearer Token
*   **Responses**:
    *   **200 OK**: List of tasks retrieved successfully.
        ```json
        [
           {
              "id": "cmhylu9em0007t2xoz82fx2ms",
              "title": "Selesaikan coding task routes (v2 - Many-to-Many)",
              "isCompleted": false,
              "dueDateAt": "2025-11-20T17:00:00.000Z",
              "userId": "cmhyb5qrw0000t2g4t88y6zb2",
              "createdAt": "2025-11-14T08:37:23.614Z",
              "updatedAt": "2025-11-14T08:37:23.614Z",
              "categoryToTasks": [
                 {
                    "category": {
                       "id": "cmhylq1u40003t2xovuw9oun1",
                       "title": "Zoom Link",
                       "typeName": "TASK_COLLECTION"
                    }
                 }
              ]
           }
        ]
        ```
    *   **401 Unauthorized**: Invalid or missing token.
        ```json
        {
           "statusCode": 401,
           "message": "Unauthorized"
        }
        ```

### `GET /tasks/:id`
Retrieves a specific task by ID.
*   **Authentication**: Bearer Token
*   **URL Path Parameters**:
    *   `id` (string, required): Task ID.
*   **Responses**:
    *   **200 OK**: Task retrieved successfully.
        ```json
        {
           "id": "cmhylu9em0007t2xoz82fx2ms",
           "title": "Selesaikan coding task routes (v2 - Many-to-Many)",
           "isCompleted": false,
           "dueDateAt": "2025-11-20T17:00:00.000Z",
           "userId": "cmhyb5qrw0000t2g4t88y6zb2",
           "createdAt": "2025-11-14T08:37:23.614Z",
           "updatedAt": "2025-11-14T08:37:23.614Z",
           "categoryToTasks": [
              {
                 "category": {
                    "id": "cmhylq1u40003t2xovuw9oun1",
                    "title": "Zoom Link",
                    "typeName": "TASK_COLLECTION"
                 }
              }
           ]
        }
        ```
    *   **401 Unauthorized**: Invalid or missing token.
        ```json
        {
           "statusCode": 401,
           "message": "Unauthorized"
        }
        ```
    *   **404 Not Found**: Task not found.
        ```json
        {
           "statusCode": 404,
           "message": "Tugas tidak ditemukan.",
           "error": "Not Found"
        }
        ```

### `PATCH /tasks/:id`
Updates a task's details.
*   **Authentication**: Bearer Token
*   **URL Path Parameters**:
    *   `id` (string, required): Task ID.
*   **Request Body**:
    *   `title` (string, optional): Updated title.
    *   `isCompleted` (boolean, optional): Updated completion status.
    *   `dueDateAt` (string, optional, ISO-8601 format): Updated due date.
    *   `categoryIds` (array of strings, optional): Updated array of category IDs.
*   **Responses**:
    *   **200 OK**: Task updated successfully.
        ```json
        {
           "id": "cmhylu9em0007t2xoz82fx2ms",
           "title": "Task routes v2 (DI-UPDATE)",
           "isCompleted": true,
           "dueDateAt": "2025-11-20T17:00:00.000Z",
           "userId": "cmhyb5qrw0000t2g4t88y6zb2",
           "createdAt": "2025-11-14T08:37:23.614Z",
           "updatedAt": "2025-11-14T08:38:04.733Z",
           "categoryToTasks": [
              {
                 "category": {
                    "id": "cmhylq1u40003t2xovuw9oun1",
                    "title": "Zoom Link",
                    "typeName": "TASK_COLLECTION"
                 }
              }
           ]
        }
        ```
    *   **400 Bad Request**: Validation failed.
        ```json
        {
           "statusCode": 400,
           "message": [
              "title should not be empty"
           ],
           "error": "Bad Request"
        }
        ```
    *   **401 Unauthorized**: Invalid or missing token.
        ```json
        {
           "statusCode": 401,
           "message": "Unauthorized"
        }
        ```
    *   **404 Not Found**: Task not found.
        ```json
        {
           "statusCode": 404,
           "message": "Tugas tidak ditemukan.",
           "error": "Not Found"
        }
        ```

### `PATCH /tasks/:id/toggle-completed`
Toggles a task's completion status.
*   **Authentication**: Bearer Token
*   **URL Path Parameters**:
    *   `id` (string, required): Task ID.
*   **Responses**:
    *   **200 OK**: Task completion status toggled successfully.
        ```json
        {
           "id": "cmhylu9em0007t2xoz82fx2ms",
           "isCompleted": true,
           "message": "Tugas ditandai selesai"
        }
        ```
    *   **401 Unauthorized**: Invalid or missing token.
        ```json
        {
           "statusCode": 401,
           "message": "Unauthorized"
        }
        ```
    *   **404 Not Found**: Task not found.
        ```json
        {
           "statusCode": 404,
           "message": "Tugas tidak ditemukan.",
           "error": "Not Found"
        }
        ```

### `DELETE /tasks/:id`
Deletes a task.
*   **Authentication**: Bearer Token
*   **URL Path Parameters**:
    *   `id` (string, required): Task ID.
*   **Responses**:
    *   **200 OK**: Task deleted successfully.
        ```json
        {
           "message": "Tugas berhasil dihapus"
        }
        ```
    *   **401 Unauthorized**: Invalid or missing token.
        ```json
        {
           "statusCode": 401,
           "message": "Unauthorized"
        }
        ```
    *   **404 Not Found**: Task not found.
        ```json
        {
           "statusCode": 404,
           "message": "Tugas tidak ditemukan.",
           "error": "Not Found"
        }
        ```

---

## 5. Pomodoro Module
Base path: `/pomodoro`

Endpoints in this module manage Pomodoro sessions. Sessions can optionally be associated with a specific task.

### `POST /pomodoro`
Starts a new Pomodoro session.
*   **Authentication**: Bearer Token
*   **Request Body**:
    *   `durationMinutes` (number, required, min: 1): Duration of the session in minutes.
    *   `startedAt` (string, required): Start time in ISO 8601 format.
    *   `endedAt` (string, required): End time in ISO 8601 format.
    *   `taskId` (string, optional): Optional task CUID to associate with the session.
*   **Responses**:
    *   **201 Created**: Pomodoro session log successfully created.
        ```json
        {
           "id": "cmn0s9x5j0003t2l8n7h1t9z2",
           "durationMinutes": 25,
           "startedAt": "2026-05-04T08:30:00.000Z",
           "endedAt": "2026-05-04T08:55:00.000Z",
           "userId": "cmhyb5qrw0000t2g4t88y6zb2",
           "taskId": "cmhylu9em0007t2xoz82fx2ms",
           "createdAt": "2026-05-04T08:55:00.000Z",
           "updatedAt": "2026-05-04T08:55:00.000Z",
           "task": {
              "id": "cmhylu9em0007t2xoz82fx2ms",
              "title": "Selesaikan makalah"
           }
        }
        ```
    *   **400 Bad Request**: Validation failed (e.g., duration is less than 1).
        ```json
        {
           "statusCode": 400,
           "message": [
              "durationMinutes must not be less than 1"
           ],
           "error": "Bad Request"
        }
        ```
    *   **401 Unauthorized**: Invalid or missing token.
        ```json
        {
           "statusCode": 401,
           "message": "Unauthorized"
        }
        ```
    *   **404 Not Found**: The specified task was not found.
        ```json
        {
           "statusCode": 404,
           "message": "Tugas tidak ditemukan.",
           "error": "Not Found"
        }
        ```

### `GET /pomodoro`
Retrieves all pomodoro logs for the authenticated user, optionally filtered by `taskId`.
*   **Authentication**: Bearer Token
*   **Query Parameters**:
    *   `taskId` (string, optional): Filter logs to only those associated with this task ID.
*   **Responses**:
    *   **200 OK**: List of pomodoro logs retrieved successfully.
        ```json
        [
           {
              "id": "cmn0s9x5j0003t2l8n7h1t9z2",
              "durationMinutes": 25,
              "startedAt": "2026-05-04T08:30:00.000Z",
              "endedAt": "2026-05-04T08:55:00.000Z",
              "userId": "cmhyb5qrw0000t2g4t88y6zb2",
              "taskId": null,
              "createdAt": "2026-05-04T08:55:00.000Z",
              "updatedAt": "2026-05-04T08:55:00.000Z",
              "task": null
           }
        ]
        ```
    *   **401 Unauthorized**: Invalid or missing token.
        ```json
        {
           "statusCode": 401,
           "message": "Unauthorized"
        }
        ```
    *   **404 Not Found**: The specified task filter was not found.
        ```json
        {
           "statusCode": 404,
           "message": "Tugas tidak ditemukan.",
           "error": "Not Found"
        }
        ```
