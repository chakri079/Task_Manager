# Full Stack Task Management System

A complete MERN stack (MongoDB, Express, React, Node.js) Task Management web application featuring authentication, task CRUD operations, advanced filtering, search, pagination, and a beautiful analytics dashboard.

## 🌟 Features

### Authentication
- User Signup & Login
- Strong Passwords Enforcement (8+ chars, upper, lower, numbers, special symbols)
- Forgot Password & Secure Password Reset Flow (via automated Email)
- Render Free Tier Firewall Fallback (graceful UI links if SMTP gets blocked)
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes

### Task Management
- Create, Read, Update, and Delete tasks
- Assign Priority (Low, Medium, High)
- Track Status (Todo, In Progress, Done)
- Set Due Dates

### Advanced Filtering & Search
- Search tasks by title
- Filter by Status and Priority
- Sort by Due Date, Priority, or Creation Date
- Pagination support

### Analytics Dashboard
- Key Performance Indicators (Total, Completed, Pending tasks)
- Completion percentage tracking
- Interactive Pie Chart for Task Status breakdown
- Interactive Bar Chart for Task Priority breakdown
- Powered by Recharts

### Modern UI/UX
- Responsive design tailored for mobile and desktop
- Dark mode toggle with system preference detection
- Clean, intuitive interface built with Tailwind CSS
- Toast notifications and loading states

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- React Router DOM
- Tailwind CSS
- Axios
- Recharts
- Heroicons
- Date-fns

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- CORS & dotenv

## 📂 Architecture & Folder Structure

The project follows a clean MVC (Model-View-Controller) architecture on the backend, and an organized component-based structure on the frontend.

```
task_management/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic (auth, tasks)
│   ├── middleware/      # JWT auth and error handling
│   ├── models/          # Mongoose schemas with indexing
│   ├── routes/          # Express API routes
│   ├── .env             # Environment variables
│   └── server.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components (Navbar, Sidebar, TaskCard, TaskForm, StatsCard)
    │   ├── context/     # React Context API for Global Auth State
    │   ├── pages/       # Route-level components (Login, Dashboard, Tasks, Analytics)
    │   ├── services/    # Axios API configuration with interceptors
    │   ├── App.jsx      # Main layout and routing
    │   ├── index.css    # Tailwind entry and custom CSS classes
    │   └── main.jsx     # Vite entry point
    ├── postcss.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone & Install Dependencies

```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install


### 3. Database Design & Indexing

MongoDB schemas automatically create indexes on fields frequently queried for performance optimization:
- `userId` (for retrieving a user's tasks)
- `status`, `priority`, `dueDate` (for fast filtering and sorting)
- Compound indexes for `userId + status` and `userId + priority`

### 4. Running the Application

**Start the Backend server:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Start the Frontend dev server:**
```bash
cd frontend
npm run dev
# Vite runs on http://localhost:5173
```

## 🔌 API Endpoints Reference

**Authentication**
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/forgotpassword` - Send password reset email to user
- `PUT /api/auth/resetpassword/:resettoken` - Submit new password and reset token

**Tasks**
- `GET /api/tasks/stats` - Get analytic metrics (Total, Completed, percentages, breakdowns)
- `GET /api/tasks` - Get tasks (supports `?page`, `?limit`, `?search`, `?status`, `?priority`, `?sortBy`, `?order`)
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 💡 Design Decisions

1. **State Management**: Used React Context API for Authentication state instead of Redux to reduce boilerplate, as the data flow is relatively straightforward (user session token).
2. **Styling**: Leveraged Tailwind CSS for rapid UI development and custom `@layer components` to abstract repeated UI elements (like buttons and badges) to keep JSX clean.
3. **API Layer**: Centralized API calls using an Axios instance with interceptors to automatically attach the JWT token to requests and handle 401 Unauthorized responses globally.
4. **Dark Mode**: Integrated standard `class` strategy in Tailwind where the `dark` class is toggled on the `html` tag and saved in `localStorage`.
5. **Database Indexing**: Implemented strategic indexing on the MongoDB `Task` collection to ensure fast response times for the advanced filtering and sorting queries.
