# LifeOS – Personal Profile and Productivity Management Platform

LifeOS is a full-stack personal productivity and skill acceleration platform. Built with a modern React frontend and a Node.js/Express REST backend backed by Microsoft SQL Server (SSMS 20 compatible), LifeOS analyzes each user's career ambitions, technical skills, experience level, and available daily time to generate actionable, bite-sized daily tasks.

---

## 🚀 Key Features

- **Personalized Daily Task Engine**: Rule-based recommendation algorithm tailoring tasks across frontend, backend, AI/ML, DevOps, cybersecurity, communication, and fitness to match user skills and target minutes.
- **Interactive Checklists**: Real-time progress tracking allowing users to check off tasks and commit daily completion snapshots.
- **Streak & Analytics Engine**: Verified consecutive days streak calculation directly from SQL Server records and weekly completion trend charts using Recharts.
- **Multi-Step Onboarding**: Smooth 4-step wizard capturing profile details, interests, proficiency levels, available time (15–120 mins), and custom tags.
- **Enterprise SQL Server Architecture**: Non-destructive schema design (`CSE9909` database on server `103.207.1.91`) with parameterized queries, indexes, and full user data isolation.
- **Robust Security**: bcrypt password hashing, JWT stateless authentication, express-rate-limit protection, and zero hardcoded credentials.
- **Violet Design System**: Clean SaaS dashboard aesthetics with curated `#F8F7FF` background, `#7C3AED` primary violet, and fully responsive layouts.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (customized Violet design tokens)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Routing**: React Router v6
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database Driver**: `mssql` (Microsoft SQL Server connection pool)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Security & Utilities**: Helmet, Express Rate Limit, Express Validator, Morgan

### Database
- **Engine**: Microsoft SQL Server 2022 / SSMS 20 Compatible
- **Host**: `103.207.1.91:1433`
- **Database**: `CSE9909`

### Deployment
- **Frontend**: Vercel (SPA rewrite rules configured in `vercel.json`)
- **Backend**: Render (Web Service with environment variables)
- **Source Control**: GitHub (`https://github.com/pandiyarajan123098-dev/lifeosproject`)

---

## 📂 Project Structure

```
lifeosproject/
├── backend/
│   ├── sql/
│   │   └── schema.sql              # Non-destructive SQL Server DDL script
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js               # MSSQL pool & parameterized query runner
│   │   │   └── jwt.js              # Token signing & verification
│   │   ├── controllers/
│   │   │   ├── authController.js   # Register, Login, GetMe, UpdatePassword
│   │   │   ├── profileController.js# Profile, Interests & Skills management
│   │   │   ├── taskController.js   # Today tasks, generation, toggling, submit
│   │   │   └── dashboardController.js # Aggregated metrics & chart data
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT validation & user attachment
│   │   │   └── errorMiddleware.js  # Centralized error & 404 handlers
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── profileRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── services/
│   │   │   ├── taskGeneratorService.js # Intelligent task recommendation engine
│   │   │   └── streakService.js    # Verified consecutive streak calculator
│   │   ├── validators/
│   │   │   ├── authValidators.js
│   │   │   └── profileValidators.js
│   │   ├── utils/
│   │   │   └── logger.js
│   │   ├── scripts/
│   │   │   └── initDb.js           # Automated schema verification script
│   │   ├── app.js                  # Express middleware & route setup
│   │   └── server.js               # Server bootstrap & health check
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProgressCard.jsx
│   │   │   ├── ProgressChart.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TaskCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global authentication state
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx     # High-conversion product showcase
│   │   │   ├── RegisterPage.jsx    # Registration with validation
│   │   │   ├── LoginPage.jsx       # Secure login
│   │   │   ├── OnboardingPage.jsx  # Multi-step personalization wizard
│   │   │   ├── DashboardPage.jsx   # Metrics, checklist, charts, streak
│   │   │   ├── DailyTasksPage.jsx  # Filterable daily task management
│   │   │   ├── TaskHistoryPage.jsx # Historical timeline & search
│   │   │   └── ProfilePage.jsx     # Profile, skills, and password manager
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance with auth interceptor
│   │   │   ├── authService.js
│   │   │   ├── profileService.js
│   │   │   └── taskService.js
│   │   ├── App.jsx                 # Route declarations
│   │   ├── index.css               # Tailwind & custom tokens
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── vercel.json                 # SPA rewrite rules
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## 💻 Local Setup Instructions

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Access to the target SQL Server `103.207.1.91` (or local SQL Server instance)

### 1. Clone the Repository
```bash
git clone https://github.com/pandiyarajan123098-dev/lifeosproject.git
cd lifeosproject
```

### 2. Configure Backend
```bash
cd backend
npm install
cp .env.example .env
```
Edit `backend/.env` with your SQL Server credentials:
```env
PORT=5000
NODE_ENV=development

DB_SERVER=103.207.1.91
DB_PORT=1433
DB_NAME=CSE9909
DB_USER=your_authorized_db_username
DB_PASSWORD=your_authorized_db_password
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

JWT_SECRET=replace_with_a_long_random_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Initialize Database Tables
Run the safe non-destructive initialization script:
```bash
npm run init-db
```
*(Alternatively, execute `backend/sql/schema.sql` directly in SSMS 20)*

### 4. Start Backend Development Server
```bash
npm run dev
# The backend will start on http://localhost:5000
# Verify via: http://localhost:5000/api/health
```

### 5. Configure & Start Frontend
In a separate terminal:
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
# The frontend will open at http://localhost:5173
```

---

## 🗄️ Database Schema & Object Rules

The database schema is strictly non-destructive. It executes against database `CSE9909` and uses `IF OBJECT_ID(...) IS NULL` so that existing college or repository tables are never dropped or altered.

| Table Name | Description | Key Columns |
|------------|-------------|-------------|
| `dbo.LifeOSUsers` | User credentials & accounts | `id` (PK), `full_name`, `email` (UQ), `password_hash`, `created_at` |
| `dbo.LifeOSProfiles` | Personal details & goals | `id` (PK), `user_id` (FK), `skill_level`, `primary_goal`, `daily_available_minutes` |
| `dbo.LifeOSInterests` | User's technical interests | `id` (PK), `user_id` (FK), `interest_name` |
| `dbo.LifeOSSkills` | User's skills & proficiency | `id` (PK), `user_id` (FK), `skill_name`, `proficiency_level` |
| `dbo.LifeOSTasks` | Generated & completed tasks | `id` (PK), `user_id` (FK), `task_title`, `priority`, `task_date`, `is_completed` |
| `dbo.LifeOSDailyProgress` | Daily snapshots & completion % | `id` (PK), `user_id` (FK), `progress_date`, `total_tasks`, `completed_tasks`, `completion_percentage` (UQ: user_id + date) |

---

## 🔌 API Endpoint Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Create a new user account and receive JWT.
- `POST /api/auth/login`: Authenticate email and password, returns JWT and user status.
- `GET /api/auth/me`: Get current authenticated user profile and onboarding state.
- `PUT /api/auth/password`: Securely change user password.
- `POST /api/auth/logout`: Clears authentication session.

### Profile & Onboarding (`/api/profile`)
- `GET /api/profile`: Get profile details, interests, and skills.
- `POST /api/profile`: Submit initial onboarding form and setup initial plan.
- `PUT /api/profile`: Update personal info, goals, or time commitment.
- `GET /api/profile/interests` & `PUT /api/profile/interests`: Manage user interest tags.
- `GET /api/profile/skills` & `PUT /api/profile/skills`: Manage user skills and levels.

### Tasks & Recommendations (`/api/tasks`)
- `GET /api/tasks/today`: Retrieve today's tasks and completion statistics.
- `POST /api/tasks/generate`: Run recommendation algorithm to generate daily tasks (supports `{ regenerate: true }`).
- `PATCH /api/tasks/:id`: Toggle task completion status (`is_completed`).
- `POST /api/tasks/submit`: Submit daily completion snapshot to `LifeOSDailyProgress`.
- `GET /api/tasks/history`: Filter past tasks by date, search term, and status.

### Dashboard & Analytics (`/api/dashboard`)
- `GET /api/dashboard/stats`: Returns aggregated stats, verified streak, 7-day progress chart data, and today's tasks.

### System Diagnostics
- `GET /api/health`: Non-sensitive health check reporting service status and database connectivity.

---

## 🌐 Deployment Guide

### Vercel Deployment (Frontend)
1. Push code to GitHub repository `https://github.com/pandiyarajan123098-dev/lifeosproject`.
2. Log into [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import the `lifeosproject` repository.
4. Set **Root Directory** to `frontend`.
5. Build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://<your-render-backend-name>.onrender.com/api`
7. Click **Deploy**. Vercel will build the frontend with SPA rewrites (`vercel.json`).

### Render Deployment (Backend)
1. Log into [Render](https://render.com/) and click **"New +"** -> **"Web Service"**.
2. Connect your GitHub repository.
3. Configuration settings:
   - **Name**: `lifeos-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, configure:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `DB_SERVER` = `103.207.1.91`
   - `DB_PORT` = `1433`
   - `DB_NAME` = `CSE9909`
   - `DB_USER` = `<your_db_username>`
   - `DB_PASSWORD` = `<your_db_password>`
   - `DB_ENCRYPT` = `false`
   - `DB_TRUST_SERVER_CERTIFICATE` = `true`
   - `JWT_SECRET` = `<generate_a_secure_random_key>`
   - `FRONTEND_URL` = `https://<your-vercel-domain>.vercel.app`
5. Click **Create Web Service**.
6. Verify deployment by checking `https://<your-backend>.onrender.com/api/health`.

---

## 🛡️ SQL Server Connectivity & Firewall Troubleshooting

If Render backend or local instances encounter connection timeouts:
1. **Firewall Rule**: The SQL Server host (`103.207.1.91`) must allow inbound traffic on TCP port `1433`.
2. **Render Outbound IPs**: Render uses dynamic outbound IP addresses on free tier or static egress IPs on paid team plans. Ensure port 1433 is open to public IPs or the Render egress IP range.
3. **TLS/SSL Encryption**: In SQL Server Management Studio (SSMS 20), verify whether "Force Encryption" is enabled. If self-signed certificates are in use, ensure `DB_TRUST_SERVER_CERTIFICATE=true` in backend environment variables.
4. **SQL Server Browser / Mixed Authentication**: Ensure "SQL Server and Windows Authentication mode" is enabled on the server instance.

---

## 📄 License
This project is licensed under the MIT License.
