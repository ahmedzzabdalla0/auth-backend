# Authentication Task – Full Task Documentation

## ⚠️ Safari Cookie Limitation

When testing the app on Safari, you may notice that the `refresh_token` cookie is not being saved.
This is **not an issue with the code or the implementation**. Safari blocks cross-site cookies by default when the frontend and backend are hosted on different domains.

To work around this limitation during testing, I have configured the application to handle it this way.

- On Chrome, Edge, or Firefox → Everything works as expected.
- On Safari → You can temporarily disable cross-site tracking by going to:
  **Safari > Preferences > Privacy > Prevent cross-site tracking**

**For the best experience and faster performance, I strongly recommend running the project locally.**

Once the frontend and backend are hosted under the same domain, this limitation will no longer occur.

---

## 🚀 Running the Project Locally

### Backend (NestJS + MongoDB)

1. Clone the repository and navigate to the backend folder.
2. Create a `.env.docker` file in the root of the backend project with the following content:

   ```env
   MONGO_URI=mongodb://ahmed:65489Ad5643@mongo:27017/nestjs?authSource=admin
   RT_SECRET=4746dcf0a14269ce6ef737a330fbda3b
   AT_SECRET=718293a4b5c6d7e8f9fa0b1c2d3e4f50
   CSRF_SECRET=8f9e7d6c5b4a39281716151413121110
   FRONTEND_BASE_URL=http://localhost:5173
   ```

3. Start the backend using Docker:

   ```bash
   docker compose build --no-cache
   docker compose up
   ```

> This will spin up MongoDB and the NestJS backend.

---

### Frontend (React + Vite)

1. Clone the repository and navigate to the frontend folder.

2. Create a `.env` file in the root of the frontend project with the following content:

```env
VITE_BACKEND_API_URL=http://localhost:3000
```

3. Install dependencies and start the development server:

   ```bash
   npm install
   npm run dev
   ```

---

Now the application should be accessible at:

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:3000](http://localhost:3000)

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
