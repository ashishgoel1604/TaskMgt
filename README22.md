# Task Management API with Frontend

This is a **Task Management** application with both a **Backend** built using **NestJS** and a **Frontend** built using **React**. The application allows you to create, manage, and assign tasks. It uses **PostgreSQL** as the database and **JWT** for authentication. The API is documented with **Swagger** for easy exploration.

The **frontend** and **backend** are integrated, and the app will run both the **NestJS API** and the **React app** concurrently.

---

## Table of Contents

- [Requirements](#requirements)
- [Setup and Installation](#setup-and-installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Swagger API Documentation](#swagger-api-documentation)
- [Initializing Admin User](#initializing-admin-user)
- [API Endpoints](#api-endpoints)

---

## Requirements

Before running this application, make sure you have the following installed:

- **Node.js** (v12.x or later)
- **PostgreSQL** (v12.x or later)
- **npm** (Node Package Manager)

---

## Setup and Installation

### Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://gitlab.com/your-username/task-management.git
cd task-management
Step 2: Install Dependencies for Both Backend and Frontend
You need to install the dependencies for both the backend and frontend projects. You can do this by running the following command from the root directory of the project:

```bash
npm run install:all
This will install all the necessary dependencies for both the backend (NestJS) and frontend (React) applications.

Environment Configuration
Step 3: Configure Environment Variables for the Backend
You need to create an .env file in the root directory of the backend project and set the following environment variables for your database connection and JWT secret:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=task_management
JWT_SECRET=uytr#$%^78765434567

Make sure your PostgreSQL database is running and the task_management database exists.

```bash
Running the Application
Step 4: Start Both Backend and Frontend
Once the dependencies are installed, you can run both the backend (NestJS) and frontend (React) concurrently in development mode with the following command:

```bash
npm run dev
This will execute the following:

Backend: The NestJS backend will start on http://localhost:4000.
Frontend: The React frontend will start on http://localhost:3000.

Swagger API Documentation
Step 5: Access the API Documentation
The API documentation for the backend is available via Swagger. To view it, open your browser and go to the following URL:

bash
http://localhost:4000/api
This will load the Swagger UI, where you can explore all the available API endpoints.

Initializing Admin User
Step 6: Create an Admin User
Before you can start using the API, you need to initialize an Admin user. You can do this by calling the users/init API endpoint in Swagger.

Endpoint: POST /users/init
Body: This will create a default admin user with the following credentials:
Email: admin@gmail.com
Password: 1234
Once you call this endpoint, the admin user will be created in the database.

API Endpoints
After initializing the admin user, you can log in and start using other API endpoints. The login credentials for the admin user are:

Email: admin@gmail.com
Password: 1234
Step 7: Log in
To log in as an admin and get a JWT token, use the login API:

Endpoint: POST /auth/login
Body:
{
  "email": "admin@gmail.com",
  "password": "1234"
}
This will return a JWT token. Use this token for authentication in subsequent API calls.

Step 8: Explore Other APIs
Once logged in, you can explore other APIs available in Swagger, including:

CRUD Operations for Tasks

Create, Update, Retrieve, and Delete tasks.
Assign tasks to users.
Update task status (Pending, In Progress, Completed).
CRUD Operations for Users (As an Admin):

Create, Update, Retrieve, and Delete users.

Step 9: Access the Frontend
Once both the backend and frontend are running, you can access the frontend UI by navigating to:

```bash
http://localhost:3000
This will serve the React application, where you can manage tasks, users, and interact with the API via a user-friendly interface.