# CampusSync

Smart campus resource booking and approval platform.

## Backend
```bash
cd backend
npm install
cp .env.example .env
# set DATABASE_URL and JWT secrets
npm run prisma:generate
npm run prisma:push
npm run dev
```

## Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tests
```bash
cd backend
npm run test
```
