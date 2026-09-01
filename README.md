# 📋 Task Manager CRUD Application

A clean, full-stack Task Management web application built with **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, and **Vanilla JavaScript**.

This project demonstrates full **CRUD (Create, Read, Update, Delete)** functionality and follow RESTful API design principles with modular architecture and zero complex frameworks.

---

## 🚀 Features

- **Create Task**: Add new tasks with a required title, optional description, and status.
- **Read All Tasks**: View all saved tasks sorted by newest first.
- **Read Single Task**: Inspect complete task details (including MongoDB ID, timestamp, and description) inside a modal popup.
- **Update Task**: 
  - Edit title, description, or status through a dedicated edit form.
  - Quick 1-click status toggle (**Mark Done** / **Mark Pending**) directly from the task card.
- **Delete Task**: Remove tasks with user confirmation.
- **Filter by Status**: Quickly filter tasks by `All`, `Pending`, or `Completed`.
- **Environment Configuration**: Sensitive database credentials and port configurations managed securely with `.env`.
- **Responsive UI**: Pure CSS styling designed to work across desktop, tablet, and mobile devices.

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database & ODM**: MongoDB, Mongoose
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Fetch API)
- **Environment Management**: `dotenv`

---

## 📁 Project Structure

```text
Task-Manager-CRUD/
├── models/
│   └── Task.js          # Mongoose schema and data model
├── routes/
│   └── taskRoutes.js    # REST API route handlers (CRUD operations)
├── public/
│   ├── index.html       # Semantic HTML layout & modal
│   ├── style.css        # Responsive, modern styling
│   └── app.js           # Client-side JavaScript & API integration
├── .env.example         # Template for environment variables
├── .gitignore           # Git ignore rules (node_modules, .env)
├── package.json         # Project metadata and dependencies
├── server.js            # Express server initialization & MongoDB connection
└── README.md            # Project documentation
```

---

## 📡 REST API Reference

All task endpoints are prefixed with `/api/tasks`:

| Method | Endpoint | Description | Status Code | Sample Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/tasks` | Create a new task | `201 Created` | `{"title": "Buy milk", "description": "2% organic", "status": "Pending"}` |
| **GET** | `/api/tasks` | Retrieve all tasks | `200 OK` | *None* |
| **GET** | `/api/tasks/:id` | Retrieve a single task by ID | `200 OK` | *None* |
| **PUT** | `/api/tasks/:id` | Update an existing task | `200 OK` | `{"status": "Completed"}` |
| **DELETE**| `/api/tasks/:id` | Delete a task by ID | `200 OK` | *None* |

### Health Check
- **GET** `/api/health` — Returns server health status (`{"status": "ok"}`).

---

## ⚙️ Getting Started & Installation

Follow these steps to run the application locally:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/Task-Manager-CRUD.git
cd Task-Manager-CRUD
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env
```

Open `.env` and set your MongoDB connection string:
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
```
*(For MongoDB Atlas, replace `MONGO_URI` with your connection URI).*

### 5. Start the Application
```bash
npm start
```

### 6. Access in Browser
Open your browser and visit:
```
http://localhost:3000
```

---

## 🧪 Testing the API via cURL

#### Create a Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Study System Design","description":"Review REST principles","status":"Pending"}'
```

#### Get All Tasks
```bash
curl http://localhost:3000/api/tasks
```

#### Update a Task
```bash
curl -X PUT http://localhost:3000/api/tasks/<TASK_ID> \
  -H "Content-Type: application/json" \
  -d '{"status":"Completed"}'
```

#### Delete a Task
```bash
curl -X DELETE http://localhost:3000/api/tasks/<TASK_ID>
```

---

## 💡 Interview Highlights & Architecture Notes

- **Separation of Concerns**: Routes (`routes/taskRoutes.js`), Models (`models/Task.js`), and server bootstrap (`server.js`) are cleanly separated.
- **RESTful Standards**: Standard HTTP verbs (`POST`, `GET`, `PUT`, `DELETE`) paired with corresponding HTTP response status codes (`200`, `201`, `400`, `404`, `500`).
- **Security & Best Practices**: Sensitive credentials and environment-specific settings are stored in `.env` and never committed to version control (`.gitignore`).
- **No Over-Engineering**: Built deliberately without heavy UI libraries or build steps, demonstrating core JavaScript and DOM manipulation concepts.
