# Pennywise — Expense Tracker Frontend

A responsive React + Vite frontend for the supplied Spring Boot Expense Tracker backend.

## Requirements
- Node.js 18.18+ (Node 20 LTS recommended)
- npm
- The Expense Tracker Spring Boot backend running on `http://localhost:8081`
- PostgreSQL database and existing user ID `1`

## Run the frontend
1. Extract this ZIP.
2. Open the `expense-tracker-frontend` folder in VS Code or IntelliJ.
3. Open the terminal in this folder.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the URL printed by Vite, normally `http://localhost:5173`.

Start the backend first. The supplied backend's CORS configuration already allows `http://localhost:5173`.

## Configuration
The app defaults to the backend and user already used in the supplied project:
- API base: `http://localhost:8081/api`
- User ID: `1`

To override them, copy `.env.example` to `.env` and edit the values:

```env
VITE_API_BASE_URL=http://localhost:8081/api
VITE_USER_ID=1
```

Restart Vite after changing `.env`.

## Features
- Overview dashboard with income, expenses, balance, category spending chart, recent transactions and budget progress
- Transaction create, edit, delete, type/category/date filters, pagination and page-local search
- Monthly budgets with spent/remaining calculations, create/edit/delete and month/year selection
- Expense and income category management
- Profile name/email editing
- Responsive sidebar and mobile layout

## Backend API contract used
- `GET /api/users/{id}`, `PUT /api/users/{id}`
- `GET/POST /api/categories`, `PUT/DELETE /api/categories/{id}`
- `GET/POST /api/transactions`, `PUT/DELETE /api/transactions/{id}`
- `GET/POST /api/budgets`, `PUT/DELETE /api/budgets/{id}`
- `GET /api/dashboard/summary`

All request fields and query parameter names follow the DTOs and controllers in the provided backend ZIP. The app uses the existing user ID and does not implement authentication because the backend does not currently provide login/auth endpoints.

## Notes
- The backend accepts only dates in the past or today for transactions; the form enforces that.
- Budgets can only be created for expense categories; the form filters categories accordingly.
- Transaction categories are filtered to match the selected transaction type.
- Keep the project local during development. The backend README notes that authentication/authorization are not implemented.
