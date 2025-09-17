# Authentication Task – Full Task Documentation

## ⚠️ Safari Cookie Limitation in Current Production Setup

When testing the app on Safari, the `refresh_token` cookie may not be saved.
This is **not caused by the code or implementation** but by Safari’s default behavior: it blocks cross-site cookies when the frontend and backend are served from different domains.

- Chrome / Edge / Firefox → Works as expected
- Safari → You need to disable cross-site tracking from:
  **Safari > Preferences > Privacy > Prevent cross-site tracking**

🟥 **Recommendation:** For the best experience and faster performance, I strongly suggest running the project locally. Once frontend and backend are hosted under the same domain, this limitation will no longer occur.

### How to Fix in Production

This is not an implementation issue. The problem will be solved automatically once both the **frontend** and **backend** are hosted under the same domain (e.g., `api.example.com` and `app.example.com`).

## 🚀 Running the Project Locally

### Ports Requirement

Before running the project, make sure the following ports are free:

- **5173** → React (Vite)
- **27017** → MongoDB
- **3000** → NestJS

### Backend (NestJS + MongoDB)

1. Clone the backend repository and navigate to the backend folder:

   [Backend Repository](https://github.com/ahmedzzabdalla0/auth-backend.git)

   ```bash
   git clone https://github.com/ahmedzzabdalla0/auth-backend.git
   cd auth-backend
   ```

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

1. Clone the frontend repository and navigate to the frontend folder:

   [Frontend Repository](https://github.com/ahmedzzabdalla0/auth-frontend.git)

   ```bash
   git clone https://github.com/ahmedzzabdalla0/auth-frontend.git
   cd auth-frontend
   ```

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

### Access the Application

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:3000](http://localhost:3000)
- **Swagger API Docs:** [http://localhost:3000/api](http://localhost:3000/api)

## Overview

This project implements a complete **Authentication System** with both **Backend** and **Frontend** integration.  
It includes features such as signup, login, token refresh, session management, and secure route protection.  
The backend is powered by **NestJS, TypeScript, MongoDB (local via Docker)**, and the frontend is built with a **React-based atomic structure**.  
The project also provides a **Swagger API documentation** and is deployed for live testing.

## 🔐 Token Storage Strategy

For security and best practices:

- The **refresh token** is stored in a secure, HttpOnly cookie so it cannot be accessed by client-side JavaScript.
- The **access token** is obtained on login/refresh and kept only in memory during the application’s runtime. In the frontend, it is managed through a **React Context Provider**, which makes it available to the application without persisting it in localStorage or sessionStorage.

This approach minimizes the risk of token theft through XSS while still allowing smooth authentication flows.

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
  - App Router Structure with layouts and nested routes.

---

## Deployment

- **Frontend:** [Vercel Deployment](https://auth-frontend-eight-zeta.vercel.app/)
- **Backend:** [Render Deployment](https://auth-backend-v6f5.onrender.com)

  > ⚠️ Note: The Render free instance spins down with inactivity, which can delay requests by \~50 seconds.
