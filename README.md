# Authentication Task – Full Task Documentation

## ⚠️ Safari Cookie Limitation

When testing the app on **Safari**, you may face issues with the `refresh_token` cookie not being saved.  
This happens because Safari blocks **cross-site cookies** by default if the frontend and backend are served from **different domains**.

- On Chrome/Edge/Firefox → Everything works as expected.
- On Safari → You need to disable **"Prevent cross-site tracking"** from:  
  `Safari > Preferences > Privacy > Prevent cross-site tracking`.

### How to Fix in Production

This is not an implementation issue. The problem will be solved automatically once both the **frontend** and **backend** are hosted under the same domain (e.g., `api.example.com` and `app.example.com`).

## Overview

This project implements a complete **Authentication System** with both **Backend** and **Frontend** integration.  
It includes features such as signup, login, token refresh, session management, and secure route protection.  
The backend is powered by **NestJS, TypeScript, MongoDB (local via Docker)**, and the frontend is built with a **React-based atomic structure**.  
The project also provides a **Swagger API documentation** and is deployed for live testing.

---

## Backend

### Tech Stack

- **NestJS** (TypeScript)
- **MongoDB** (local, containerized with Docker)
- **Swagger** (API documentation)
- **Security Middleware**
  - Helmet
  - Cookie Parser
  - Throttler (rate limiting)
  - CORS configuration

### Swagger Endpoints

#### **POST** `/auth/signup`

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "StrongP@ssw0rd",
  "repassword": "StrongP@ssw0rd",
  "name": "Ahmed Mohamed"
}
```

**Response**

- `201 Created`

---

#### **POST** `/auth/login`

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "StrongP@ssw0rd",
  "rememberMe": true
}
```

**Response**

- `200 OK`

---

#### **POST** `/auth/refresh`

**Response**

- `201 Created`

---

#### **GET** `/auth/get_user`

**Response**

- `200 OK`

---

#### **POST** `/auth/report_refresh_stolen`

**Description**
Invalidate stolen refresh token and keep the current session active.
All other sessions will be logged out once their access token expires, the page is refreshed, or an authenticated action is attempted.

**Response**

- `201 Created`

---

#### **POST** `/auth/logout`

**Response**

- `201 Created`

---

#### **GET** `/dashboard/content` (Protected)

**Response**

- `200 OK`

---

## Frontend

### Features

- **Route Protection**
  - If a user tries to access any route, authentication and authorization are verified.
  - If logged in and navigates to `login`/`signup`, they are redirected to the dashboard.
  - If not authenticated, accessing protected routes redirects them back to `login`.

- **Atomic Design Structure**
  - Organized and scalable folder structure for components.

---

## Deployment

- **Frontend:** [Vercel Deployment](https://auth-frontend-eight-zeta.vercel.app/)
- **Backend:** [Render Deployment](https://auth-backend-v6f5.onrender.com)

  > ⚠️ Note: The Render free instance spins down with inactivity, which can delay requests by \~50 seconds.
