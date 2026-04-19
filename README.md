# CampusSync

**Campus Resource Management Platform**

🔗 **Deployed Link**: [https://campus-resource-arev.vercel.app/](https://campus-resource-arev.vercel.app/)

CampusSync is a full-stack SaaS application for managing campus rooms, labs, and equipment. It features real-time conflict detection, role-based approval workflows, and an analytics dashboard for institutional resource governance.

---

##  Features
- **Resource Catalog** – Browse and search classrooms, laboratories, and equipment.
- **Real-time Conflict Detection** – Automatic scheduling overlap checks before booking.
- **Approval Workflow** – Faculty and admins can approve or reject booking requests.
- **Audit Logs** – Immutable record of every system action for governance.
- **Analytics Dashboard** – Usage patterns, peak hours, and conflict statistics.
- **Real-time Notifications** – WebSocket-powered alerts for booking status changes.
- **Role-Based Access** – Distinct permissions for Students, Faculty, and Admins.

---

##  Tech Stack

### Frontend
- React 18 + TypeScript
- Vite 5
- Tailwind CSS 4
- Framer Motion (animations)
- Zustand (state management)
- Recharts (data visualization)
- Socket.io Client (real-time)
- Lucide React (icons)

### Backend
- Node.js + Express 4
- TypeScript
- Prisma ORM
- Socket.io (WebSocket)
- Zod (validation)
- bcryptjs + JWT (auth)
- Helmet + CORS (security)
- Vitest + Supertest (testing)

---

##  Installation

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:push
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

##  Environment Variables

Create a `.env` in `backend/` based on `.env.example`:

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | API server port | `4000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/campussync` |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens | — |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | — |
| `JWT_ACCESS_TTL` | Access token expiry | `15m` |
| `JWT_REFRESH_TTL` | Refresh token expiry | `7d` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3000` |

Frontend env (optional):

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE` | Backend API URL | `http://localhost:4000/api` |

---

## Project Structure

```
├── backend/
│   └── src/saas/
│       ├── routes/         # auth, bookings, resources, analytics, audit, notifications
│       ├── services/       # business logic
│       ├── middlewares/     # auth, role guards, error handling
│       ├── config/         # env, db, logger
│       ├── app.ts          # Express app factory
│       └── server.ts       # Entry point
├── frontend/
│   └── src/
│       ├── pages/          # Landing, Auth, Dashboard, Bookings, Approvals, Audit, Resources
│       ├── components/     # UI components, layout
│       ├── store/          # Zustand stores (auth, app)
│       ├── services/       # API client
│       └── types/          # TypeScript interfaces
├── ErDiagram.md
├── classDiagram.md
├── sequenceDiagram.md
├── useCaseDiagram.md
└── README.md
```

---

##  API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login, returns JWT |

### Resources
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/resources` | List all campus resources |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/bookings` | List current user's bookings |
| `POST` | `/api/bookings` | Create a new booking |
| `GET` | `/api/bookings/conflicts/check` | Check for scheduling conflicts |
| `PATCH` | `/api/bookings/:id/approve` | Approve a booking (Faculty/Admin) |
| `PATCH` | `/api/bookings/:id/reject` | Reject a booking (Faculty/Admin) |
| `PATCH` | `/api/bookings/:id/cancel` | Cancel a booking |

### Analytics & Audit
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/usage` | Usage statistics (Admin) |
| `GET` | `/api/audit` | Audit logs (Admin) |
| `GET` | `/api/notifications` | User notifications |

---

##  Testing

```bash
cd backend
npm run test
```




