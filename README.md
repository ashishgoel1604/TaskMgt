# Task Management API

This is a **Task Management** API built with **NestJS** that allows you to create, manage, and assign tasks. It uses **PostgreSQL** as the database and **JWT** for authentication. The API is documented with **Swagger** for easy exploration.

---

## Table of Contents

- [Requirements](#requirements)
- [Setup and Installation](#setup-and-installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Swagger API Documentation](#swagger-api-documentation)
- [Initializing Admin User](#initializing-admin-user)
- [API Endpoints](#api-endpoints)
- [License](#license)

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

````bash
git clone https://gitlab.com/your-username/task-management.git
cd task-management


## Install Dependencies
Install all the required dependencies using npm

```bash
npm install


## Environment Configuration
Configure Environment Variables

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=task_management
JWT_SECRET=uytr#$%^78765434567


## Running the Application
Once you have configured the environment variables, you can start the application in development mode:
This will start the NestJS application, and it will be available on http://localhost:4000.

```bash
npm run start


## Swagger API Documentation
The API documentation is available via Swagger. To view it, open your browser and go to the following URL:

```bash
http://localhost:4000/api


## Initializing Admin User

Before you can start using the API, you need to initialize an Admin user. You can do this by calling the users/init API endpoint in Swagger

```bash
Email: admin@gmail.com
Password: 1234


## Log in
To log in as an admin and get a JWT token, use the login API:

Endpoint: POST /auth/login
Body:

```bash
Copy code
{
  "email": "admin@gmail.com",
  "password": "1234"
}


## Explore Other APIs

Once logged in, you can explore other APIs available in Swagger, including:

CRUD Operations for Tasks

Create, Update, Retrieve, and Delete tasks.
Assign tasks to users.
Update task status (Pending, In Progress, Completed).
CRUD Operations for Users (As an Admin):

Create, Update, Retrieve, and Delete users.


