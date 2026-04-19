# CampusSync

**Neo-Brutalist Campus Resource Management Platform**

🔗 **Deployed Link**: [https://campus-resource-brown.vercel.app/](https://campus-resource-brown.vercel.app/)

CampusSync is a high-contrast, neo-brutalist SaaS application for managing campus rooms, labs, and equipment. It provides a clean, purpose-driven UI with solid color blocks, bold typography, and an intuitive navigation system (sidebar, navbar, footer) designed for fast, frictionless resource booking and approval workflows.

---

## ✨ Features
- **Unified Resource Catalog** – Browse and search classrooms, laboratories, and equipment.
- **Real-time Conflict Detection** – Automatic checks to prevent double-booking.
- **Approval Workflow** – Faculty/administrators can approve or reject requests with audit logs.
- **Analytics Dashboard** – Visualize usage, peak hours, and conflict statistics.
- **Responsive Neo-Brutalist UI** – Black background with teal, lime, and lavender accents, solid blocks, and bold uppercase typography.
- **Toast Notifications** – Immediate feedback for actions and errors.
- **Dark-mode ready** – Designed for high-contrast environments.

---

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL (or any Prisma-compatible DB)
- **Authentication**: JWT based auth with role-based access (Student, Faculty, Admin)
- **Deployment**: Vercel (frontend), Railway/Render (backend)

---

## 📦 Installation

### Backend
```bash
cd backend
npm install
cp .env.example .env  # configure DATABASE_URL and JWT secrets
npm run prisma:generate   # generate Prisma client
npm run prisma:push       # push schema to DB (or migrate)
npm run dev               # start server on http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
npm run dev               # start dev server on http://localhost:3000
```

---

## 🚀 Running Locally

Both backend and frontend can be started in parallel.

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` in the `backend/` directory based on `.env.example`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `PORT` | API server port (default: 4000) |

---

## 📂 Project Structure

```
├── backend/          # Express server, Prisma schema, API routes
├── frontend/         # React Vite app, UI components, stores
├── ErDiagram.md      # Entity-Relationship diagram
├── classDiagram.md   # Class diagram
├── sequenceDiagram.md # Sequence diagram
├── useCaseDiagram.md # Use-case diagram
└── README.md
```

---

## 📊 API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/login` | User login, returns JWT | Public |
| `POST` | `/auth/register` | Register new user | Public |
| `GET` | `/resources` | List all resources | Token |
| `GET` | `/bookings` | List bookings for current user | Token |
| `POST` | `/bookings` | Create a booking (conflict check) | Token |
| `GET` | `/bookings/conflicts/check` | Check for scheduling conflicts | Token |
| `GET` | `/analytics/usage` | Usage statistics | Admin |
| `GET` | `/audit` | Audit logs | Admin |

---

## 🧪 Testing

```bash
cd backend
npm run test
```

---

## 🎨 Design Guidelines

| Element | Specification |
|---|---|
| **Palette** | Black, Teal `#14b8a6`, Lime `#84cc16`, Lavender `#a78bfa` |
| **Typography** | Bold, uppercase headings (Inter/Outfit) |
| **Components** | Solid blocks, thick borders, no gradients or glassmorphism |
| **Animations** | Framer Motion for transitions and hover effects |
| **Navigation** | Fixed top navbar, collapsible sidebar, scrollable footer |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/awesome-feature`)
3. Ensure code follows existing style (TS lint, Prettier)
4. Submit a pull request with a clear description

---

## 📜 License

MIT License – see `LICENSE` file for details.
