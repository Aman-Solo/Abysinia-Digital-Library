# Abysinia Digital Library

A full-stack digital library platform for discovering, managing, sharing, and assessing educational and heritage materials. The project combines a React frontend with a Node.js backend, a local SQLite database, file uploads, bookmarks, quizzes, user profiles, researcher applications, notifications, and administrative workflows.

## Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [How the Application Runs](#how-the-application-runs)
- [Backend](#backend)
- [Frontend](#frontend)
- [Database and File Storage](#database-and-file-storage)
- [API Reference](#api-reference)
- [Available Frontend Pages](#available-frontend-pages)
- [Development Commands](#development-commands)
- [Troubleshooting](#troubleshooting)
- [Important Project Notes](#important-project-notes)

## Project Overview

Abysinia Digital Library is organized as two applications:

- **Backend API**: a CommonJS Node.js HTTP server that exposes REST-style endpoints on port `3001`.
- **Frontend client**: a Create React App application served on port `3000` during development.

The frontend calls the backend directly at `http://localhost:3001`. Both applications therefore need to be running for the complete experience to work.

## Technology Stack

### Frontend

- React `19`
- React DOM
- React Router DOM
- Create React App via `react-scripts`
- Tailwind CSS and PostCSS
- React Icons
- React Toastify
- `date-fns`
- Fetch API and Axios dependencies

### Backend

- Node.js
- Native Node.js HTTP server
- A local `MiniRouter` implementation
- SQLite through `sqlite3` and `sqlite`
- `bcrypt` and `bcryptjs` for password handling
- Multer for multipart file uploads
- Sharp for image optimization
- CORS headers configured by the server

### Storage

- SQLite database: `backend final/database/chpa.db`
- Original uploads: `backend final/uploads/originals/`
- Optimized uploads: `backend final/uploads/optimized/`

## Repository Structure

```text
Abysinia DL/
├── README.md
├── backend final/
│   ├── server.js                 # Backend entry point
│   ├── package.json              # Backend dependencies
│   ├── database/
│   │   ├── db.js                # SQLite connection and table initialization
│   │   └── chpa.db              # Local SQLite database
│   ├── controllers/              # Request and business logic
│   ├── middleware/               # Upload and authorization helpers
│   ├── models/                   # Database access helpers
│   ├── routes/                   # API route declarations
│   ├── utils/                    # Router and media utilities
│   ├── uploads/                  # Uploaded files
│   ├── schema.sql                # Schema reference/SQL utilities
│   └── update_db_schema.js       # Optional database migration utility
├── frontend final/
│   ├── package.json              # Frontend dependencies and scripts
│   ├── public/                   # Static public assets
│   ├── src/
│   │   ├── App.js                # Route configuration
│   │   ├── components/           # Reusable React components
│   │   └── pages/                # Application screens
│   ├── build/                    # Existing production build output
│   └── README.md                 # Create React App reference
└── .gitignore
```

Both application folders also contain a `Things to finish/` directory. These are duplicate or alternate project versions. The supported development paths are the top-level `backend final/` and `frontend final/` directories documented above.

## Prerequisites

Install the following before starting:

- Node.js with npm
- A modern browser such as Chrome, Edge, or Firefox
- PowerShell or another terminal

Check Node.js and npm:

```powershell
node --version
npm --version
```

The project currently has `node_modules` and lockfiles in both active application folders, but running `npm install` is safe and is recommended after cloning the repository or changing machines.

## Quick Start

Open two PowerShell terminals from the repository root.

### Terminal 1: Start the backend

```powershell
cd "C:\Users\amanu\Desktop\Abysinia DL\backend final"
npm install
node server.js
```

Expected output includes:

```text
Server running on port 3001
Users table initialized.
```

Verify the backend in a browser or PowerShell:

```powershell
Invoke-WebRequest http://localhost:3001/test
```

The test endpoint returns:

```json
{"ok":true}
```

### Terminal 2: Start the frontend

```powershell
cd "C:\Users\amanu\Desktop\Abysinia DL\frontend final"
npm install
npm start
```

Open:

```text
http://localhost:3000
```

The root route redirects to `/home`.

Stop a development server with `Ctrl+C`.

## How the Application Runs

1. `node server.js` loads `backend final/database/db.js`.
2. SQLite opens `database/chpa.db` relative to the backend working directory.
3. The database module creates missing tables automatically.
4. The backend listens on port `3001`.
5. `npm start` launches the React development server on port `3000`.
6. Browser requests from the frontend call the backend using URLs beginning with `http://localhost:3001`.
7. Uploaded files are served by the backend under `/uploads/...`.

The backend uses permissive development CORS headers, allowing the frontend development server to communicate with it locally.

## Backend

### Entry point

```text
backend final/server.js
```

The backend is a native Node.js HTTP server rather than an Express application. Routes are registered with the local `MiniRouter` utility and dispatched from `server.js`.

### Port

```text
3001
```

The port is currently defined directly in `server.js` as `const PORT = 3001`.

### Route modules

- `authRoutes.js`: registration, login, security questions, password recovery
- `learningMaterialRoutes.js`: material uploads, searching, approval, denial, editing, and deletion
- `bookmarkRoutes.js`: adding, removing, and listing bookmarks
- `userRoutes.js`: profiles, users, roles, statistics, and researcher applications
- `notificationRoutes.js`: notification retrieval
- `mediaRoutes.js`: media uploads
- `quizRoutes.js`: quiz creation, approval, browsing, submissions, and history
- `contactRoutes.js`: contact form submissions and administration

### Static uploads

The backend serves uploaded files from the `/uploads/` URL path. For example:

```text
http://localhost:3001/uploads/optimized/example.webp
```

## Frontend

### Entry point

```text
frontend final/src/index.js
```

The React application is configured in:

```text
frontend final/src/App.js
```

The application uses React Router and includes public pages, account workflows, dashboards, quizzes, bookmarks, search, uploads, and contact functionality.

### Frontend development server

```text
http://localhost:3000
```

The frontend API requests currently use the fixed backend URL:

```text
http://localhost:3001
```

No environment file is required for the current local setup.

## Database and File Storage

### SQLite tables

The database initializer creates these tables when they do not already exist:

- `users`
- `learning_materials`
- `bookmarks`
- `notifications`
- `quizzes`
- `questions`
- `quiz_submissions`
- `contact_messages`

The database is created or opened relative to the directory from which the backend is started. Always start the backend from `backend final/` so it uses the intended database location:

```powershell
cd "C:\Users\amanu\Desktop\Abysinia DL\backend final"
node server.js
```

### Database maintenance scripts

The backend includes utility scripts for inspection and maintenance:

```powershell
node update_db_schema.js
node audit_db.js
node check_messages.js
node list_tables.js
node repair_db.js
```

Run these from `backend final/`. They are maintenance tools, not part of the normal application startup.

### Upload processing

Uploads are handled by Multer. Image and media utilities are available under `backend final/utils/`, including Sharp-based optimization. The upload directories should remain writable by the user running the backend.

## API Reference

All endpoints below use this base URL during local development:

```text
http://localhost:3001
```

### Health check

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/test` | Confirms that the backend is running |

### Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Log in a user |
| POST | `/auth/get-questions` | Retrieve security questions |
| POST | `/auth/forgot-password` | Start password recovery |

### Learning materials

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/materials` | List approved materials |
| GET | `/materials/search` | Search materials |
| GET | `/materials/user/:userId` | List materials belonging to a user |
| POST | `/materials` | Upload a material using multipart form data |
| GET | `/materials/pending` | List pending materials |
| GET | `/materials/history` | List material history |
| PUT | `/materials/:id` | Update a material |
| PUT | `/materials/:id/approve` | Approve a material |
| PUT | `/materials/:id/deny` | Deny a material |
| DELETE | `/materials/:id` | Delete a material |

### Bookmarks

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/bookmarks/add` | Add a bookmark |
| POST | `/bookmarks/remove` | Remove a bookmark |
| GET | `/bookmarks/:userId` | List a user's bookmarks |

### Users and applications

| Method | Endpoint | Purpose |
| --- | --- | --- |
| PUT | `/user/update` | Update a profile |
| GET | `/user/all` | List users |
| PUT | `/user/role` | Change a user's role |
| DELETE | `/user/:id` | Delete a user |
| GET | `/user/stats` | Retrieve user statistics |
| GET | `/user/applications` | List researcher applications |
| POST | `/user/apply` | Submit a researcher application with an optional ID picture |
| PUT | `/user/applications/:id/approve` | Approve an application |
| PUT | `/user/applications/:id/reject` | Reject an application |

### Quizzes

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/quizzes` | Create a quiz |
| GET | `/quizzes/pending` | List pending quizzes |
| GET | `/quizzes/approved` | List approved quizzes |
| GET | `/quizzes/history` | List quiz history |
| GET | `/quizzes/:id` | Retrieve quiz details |
| PUT | `/quizzes/:id/approve` | Approve a quiz |
| PUT | `/quizzes/:id/deny` | Deny a quiz |
| DELETE | `/quizzes/:id` | Delete a quiz |
| POST | `/quizzes/submit` | Submit quiz answers |
| GET | `/quizzes/teacher/:teacherId` | List quizzes created by a teacher |
| GET | `/quizzes/student/:studentId` | List a student's submissions |

### Media, notifications, and contact

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/media/upload` | Upload media using multipart form data |
| GET | `/notifications/notifications` | Retrieve notifications |
| POST | `/contact/submit` | Submit a contact message |
| GET | `/contact/all` | List contact messages |
| DELETE | `/contact/:id` | Delete a contact message |

## Available Frontend Pages

The frontend routes are defined in `frontend final/src/App.js`:

| Route | Page |
| --- | --- |
| `/home` | Home page |
| `/contact` | Contact form |
| `/login` | Login |
| `/register` | Registration |
| `/teacher-verification` | Researcher application |
| `/dashboard` | Role-based dashboard entry point |
| `/upload` | Material upload |
| `/admin` | Administration area |
| `/search` | Material search |
| `/profile` | User profile |
| `/bookmarks` | Saved materials |
| `/forgot-password` | Password recovery |
| `/create-quiz` | Quiz creation |
| `/quizzes` | Approved quizzes and submissions |
| `/take-quiz/:id` | Quiz attempt page |

## Development Commands

### Backend

Run the server:

```powershell
cd "backend final"
node server.js
```

Run a database utility:

```powershell
cd "backend final"
node <script-name>.js
```

The backend package does not currently define a `start` script, so use `node server.js` directly.

### Frontend

Start the development server:

```powershell
cd "frontend final"
npm start
```

Create a production build:

```powershell
cd "frontend final"
npm run build
```

Run frontend tests:

```powershell
cd "frontend final"
npm test
```

The frontend build is generated in `frontend final/build/`.

## Troubleshooting

### The frontend cannot reach the backend

Confirm that the backend terminal shows `Server running on port 3001`, then test:

```powershell
Invoke-WebRequest http://localhost:3001/test
```

Also confirm that no other process is using port `3001`.

### The frontend opens but data is missing

The frontend depends on the API, so make sure both terminals are running. Browser developer tools can show failed requests and their response status.

### The database appears in the wrong directory

Start the backend from `backend final/`, not from the repository root or `backend final/Things to finish/`. The database path in `database/db.js` is relative to the current working directory.

### `npm install` fails for SQLite or Sharp

Use a supported current Node.js LTS release, remove the incomplete installation, and reinstall from the relevant application directory:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

Only run this inside the application whose dependencies need repair.

### Port 3000 is already in use

Create React App will usually offer another port. Accept the prompt, then use the displayed frontend URL. The backend must still remain on port `3001` unless the frontend request URLs are changed as well.

### Port 3001 is already in use

Find the process using the port:

```powershell
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
```

Stop the conflicting process only after confirming it is safe to do so, or start the project after the port has been released.

## Important Project Notes

- Use the top-level `backend final/` and `frontend final/` folders for normal development.
- Do not start the copies inside `Things to finish/` unless you intentionally need to inspect an alternate version.
- The backend has no configured authentication middleware on every route; role and identity checks are implemented in project-specific controllers and helpers. Review authorization behavior before deploying publicly.
- The development server enables broad CORS access with `Access-Control-Allow-Origin: *`.
- The application currently uses local SQLite storage and local filesystem uploads. A production deployment should add a deliberate backup, access-control, secret-management, and file-storage strategy.
- Do not commit `node_modules`, local databases, generated builds, logs, or environment secrets. The repository `.gitignore` already covers several of these categories.

## License

No project license has been declared in the current package metadata.
