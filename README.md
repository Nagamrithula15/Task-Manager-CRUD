# Task Manager CRUD Application

A simple full-stack Task Management web application built using **Node.js, Express.js, MongoDB, Mongoose, and Vanilla JavaScript**.

This project demonstrates complete **CRUD (Create, Read, Update, Delete)** functionality through a RESTful API and a simple responsive web interface.

## Features

- Create new tasks
- View all tasks
- View individual task details
- Update task details
- Change task status between **Pending** and **Completed**
- Delete tasks
- Filter tasks by status
- Basic input validation
- Responsive user interface
- Persistent data storage using MongoDB

## Technology Stack

### Backend
- Node.js
- Express.js
- Mongoose

### Database
- MongoDB
- MongoDB Atlas

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API

### Tools
- Git
- GitHub
- dotenv

## Project Structure

```text
Task-Manager-CRUD/
│
├── models/
│   └── Task.js
│
├── routes/
│   └── taskRoutes.js
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md

Getting Started
Prerequisites

Make sure you have the following installed or configured:

Node.js 18 or higher
MongoDB Atlas account or local MongoDB
Git
1. Clone the Repository
git clone https://github.com/Nagamrithula15/Task-Manager-CRUD.git
cd Task-Manager-CRUD
2. Install Dependencies
npm install
3. Configure Environment Variables

Create a .env file in the project root.

Use the following format:

PORT=3000
MONGO_URI=your_mongodb_connection_string

For MongoDB Atlas, replace your_mongodb_connection_string with your MongoDB Atlas connection string.

Do not commit the .env file to GitHub.

The project includes a .env.example file as a safe template.

4. Start the Application

For normal execution:

npm start

For development:

npm run dev
5. Open the Application

Open your browser and visit:

http://localhost:3000
