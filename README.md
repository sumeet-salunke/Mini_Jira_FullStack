# Mini Jira – Full Stack Task Management System

Mini Jira is a full stack task management web application where users can create projects, manage tasks, assign tasks, add comments, and view dashboard analytics.

## Live Demo

Frontend: (GitHub Pages Link)
Backend API: (Render Link)

## Features

* User Authentication (JWT)
* Dashboard Analytics
* Project Management
* Task Management
* Task Status Tracking
* Task Priority & Due Date
* Comments on Tasks
* Responsive UI
* Animations
* Protected Routes

## Tech Stack

### Frontend

* React (Vite)
* Axios
* React Router
* CSS / Tailwind

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Deployment

* Frontend: GitHub Pages
* Backend: Render
* Database: MongoDB Atlas

## Project Structure

mini-jira-fullstack/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── config/
│   └── app.js
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   ├── api/
│   └── App.jsx
│
├── README.md
└── .gitignore

## Installation

### Clone Repository

git clone https://github.com/yourusername/mini-jira-fullstack.git

### Backend Setup

cd backend
npm install
npm start

### Frontend Setup

cd frontend
npm install
npm run dev

## Environment Variables

Create a .env file in backend folder and add:

PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key

## API Routes

### Auth

POST /api/auth/register
POST /api/auth/login

### Projects

GET /api/projects
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id

### Tasks

GET /api/tasks/project/:projectId
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

### Comments

GET /api/comments/task/:taskId
POST /api/comments
DELETE /api/comments/:id

### Dashboard

GET /api/dashboard

## Deployment

### Backend (Render)

* Connect GitHub repository
* Root directory: backend
* Build command: npm install
* Start command: node app.js
* Add environment variables

### Frontend (GitHub Pages)

cd frontend
npm run build
npm run deploy

## Author

Your Name
