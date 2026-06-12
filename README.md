# Student Career & Internship Tracker (SCT Tracker)

A modern, production-ready React + TypeScript web application built with Redux Toolkit and Tailwind CSS to help students organize their internship search, log learning goals, track interviews, manage job applications, and visualize their recruitment metrics.

## Project Overview

SCT Tracker is a self-contained assessment application. It utilizes local session validation, integrates with the `dummyjson.com` API to pull real-time internship openings, and synchronizes application data and learning progress with `localStorage`. It features a sleek glassmorphism theme, dynamic analytics charts (using Recharts), and full responsive support for mobile, tablet, and desktop views.

---

## Core Features

- **🔒 Mock Authentication**: Full session management (remember me option) using credential simulation (`student@example.com` / `password123`). Protected routes guard student dashboards and profile fields.
- **📊 Analytics Dashboard**: 
  - Pie Chart for application status distribution.
  - Bar Chart for monthly submissions.
  - Line Chart showing growth trends over time.
  - Real-time progress trackers for coursework.
- **💼 Complete CRUD Internship Management**: Add, update, view, and delete internship applications with validated inputs (emails, required fields, date validations).
- **🔍 Advanced Search & Filter**: Real-time filtering by status, company, and location, combined with multi-criteria sorting (applied date, company names, status).
- **📚 Learning Goals Tracker**: Slices dedicated to logging courses, Platforms, and progress percentages, complete with interactive inline progress adjustment sliders and completion dates.
- **🌐 Mock API Integration**: Integrated with `dummyjson.com` to pull mock internship opportunities, simulate data uploads (POST requests), handle network exceptions gracefully, and provide a connection retry feature.
- **💡 Extra Polish**: Features a class-based Error Boundary, custom Toast alerts, delete confirmation dialogs, empty states, and pagination (5 entries per page).

---

## Tech Stack

- **Core**: React 18+ (scaffolded via Vite), TypeScript
- **State Management**: Redux Toolkit (authSlice, internshipSlice, learningSlice)
- **Routing**: React Router DOM (v6)
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons
- **Visualizations**: Recharts
- **HTTP Client**: Axios

---

## Folder Structure

```
src/
├── components/
│   ├── Charts/               # StatusPieChart, MonthlyBarChart, GrowthLineChart
│   ├── DashboardCards/       # Analytics metrics count cards
│   ├── ErrorBoundary/        # React Class component catching rendering errors
│   ├── InternshipForm/       # Dual-purpose Add/Edit internship input form
│   ├── InternshipTable/      # Paginated tables and mobile card fallbacks
│   ├── Layout/               # Sidebar + Navbar responsive shell
│   ├── Loader/               # Spinners and skeletons loaders
│   ├── Modal/                # ConfirmationModal before destructive actions
│   └── SearchFilter/         # Text searching and filters
├── context/
│   └── ToastContext.tsx      # System notifications provider
├── hooks/
│   └── index.ts              # Typed Redux useDispatch and useSelector
├── pages/
│   ├── AddApplication/       # Create/Edit internship page
│   ├── Applications/         # Searchable applications list page
│   ├── Dashboard/            # Central stats and Recharts widgets
│   ├── LearningProgress/     # Study courses and skills tracker
│   ├── Login/                # Centered login card page
│   └── Profile/              # Student settings and target industries
├── redux/
│   ├── authSlice.ts          # Auth state thunks
│   ├── internshipSlice.ts    # Internship state CRUD
│   ├── learningSlice.ts      # Study goals state
│   └── store.ts              # Combined store configurations
├── routes/
│   └── ProtectedRoute.tsx    # Session-checking redirect wrapper
├── services/
│   └── api.ts                # Axios DummyJSON queries wrapper
├── types/
│   └── index.ts              # Global type definitions
├── App.css
├── App.tsx
├── index.css
└── main.tsx
```

---

## Installation & Running Locally

1. **Clone or unzip the project** to your local workspace.
2. Navigate to the root directory `student-career-tracker`:
   ```bash
   cd student-career-tracker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5173`.
6. Log in with the credentials:
   - **Email**: `student@example.com`
   - **Password**: `password123`

---

## API Endpoints Used

The application utilizes the following endpoints on `https://dummyjson.com`:

* **GET `/users/1`**: Fetches details for profile card and initial mock student information on login.
* **GET `/posts?limit=15`**: Fetches posts that are mapped into internship suggestions shown on the dashboard.
* **POST `/posts/add`**: Simulates sending a new internship submission. Returns mock API response with auto-generated ID.

---

## Deployment Steps

### Deploying to Vercel

#### Option 1: Vercel CLI (Fastest)
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Log in and deploy from the root of the project:
   ```bash
   vercel
   ```
3. Follow the CLI wizard. It will auto-detect Vite. Use default build settings (`npm run build` and output folder `dist`).

#### Option 2: GitHub Integration
1. Push your code to a GitHub repository.
2. Go to the [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. Import your repository and add any environment variables from `.env.example` in the settings.
4. Click **Deploy**.

---

### Deploying to Netlify

#### Option 1: Netlify CLI
1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
2. Build the production build locally:
   ```bash
   npm run build
   ```
3. Deploy the build:
   ```bash
   netlify deploy --prod --dir=dist
   ```

#### Option 2: Netlify Dashboard
1. Push your code to a GitHub repository.
2. Go to [Netlify Dashboard](https://app.netlify.com) and select **Import from Git**.
3. Choose your repository.
4. Configure Build Settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Click **Deploy Site**.

> [!WARNING]
> Since this application is a single-page app (SPA) using React Router DOM, make sure to add a `_redirects` file in your `public` directory with the following content to avoid 404 errors on refreshes:
> `/*    /index.html   200`
