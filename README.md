
```
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

```bash
git clone https://gitlab.com/your-username/task-management.git
cd task-management
```

### Step 2: Install Dependencies

Install all the required dependencies using **npm**:

```bash
npm install
```

This will install all the necessary dependencies defined in the `package.json` file.

---

## Environment Configuration

### Step 3: Configure Environment Variables

You need to create an `.env` file in the root directory of the project and set the following environment variables for your database connection and JWT secret.

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=task_management
JWT_SECRET=uytr#$%^78765434567
```

- **DB_HOST**: The host where your PostgreSQL database is running (default is `localhost`).
- **DB_PORT**: The port on which your PostgreSQL database is running (default is `5432`).
- **DB_USER**: The username for your PostgreSQL database.
- **DB_PASSWORD**: The password for your PostgreSQL user.
- **DB_NAME**: The name of the PostgreSQL database (e.g., `task_management`).
- **JWT_SECRET**: The secret key used for signing JWT tokens (you can generate your own).

Make sure your PostgreSQL database is running and the `task_management` database exists.

---

## Running the Application

### Step 4: Start the Application

Once you have configured the environment variables, you can start the application in **development mode**:

```bash
npm run start
```

This will start the NestJS application, and it will be available on `http://localhost:4000`.

---

## Swagger API Documentation

### Step 5: Access the API Documentation

The API documentation is available via Swagger. To view it, open your browser and go to the following URL:

```
http://localhost:4000/api
```

This will load the Swagger UI, where you can explore all the available API endpoints.

---

## Initializing Admin User

### Step 6: Create an Admin User

Before you can start using the API, you need to initialize an **Admin user**. You can do this by calling the `users/init` API endpoint in Swagger.

- **Endpoint**: `POST /users/init`
- **Body**: This will create a default admin user with the following credentials:
  - Email: `admin@gmail.com`
  - Password: `1234`

Once you call this endpoint, the admin user will be created in the database.

---

## API Endpoints

After initializing the admin user, you can log in and start using other API endpoints. The login credentials for the admin user are:

- **Email**: `admin@gmail.com`
- **Password**: `1234`

### Step 7: Log in

To log in as an admin and get a **JWT token**, use the login API:

- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "admin@gmail.com",
    "password": "1234"
  }
  ```

This will return a **JWT token**. Use this token for authentication in subsequent API calls.

### Step 8: Explore Other APIs

Once logged in, you can explore other APIs available in Swagger, including:

- **CRUD Operations for Tasks**
  - Create, Update, Retrieve, and Delete tasks.
  - Assign tasks to users.
  - Update task status (Pending, In Progress, Completed).

- **CRUD Operations for Users** (As an Admin):
  - Create, Update, Retrieve, and Delete users.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

---

Now you can copy everything in this block and paste it into your `README.md` file. This version maintains a consistent format, from Step 1 through to the end.

Let me know if you need any further adjustments!
