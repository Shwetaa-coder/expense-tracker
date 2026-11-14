# Expense Tracker Backend

Spring Boot REST API using Java 21, Spring Data JPA and PostgreSQL.

## Run locally
1. Install Java 21 and PostgreSQL.
2. Create a database named `expense_tracker`.
3. Set `DB_USERNAME` and `DB_PASSWORD`, or edit `src/main/resources/application.properties`.
4. Open this folder in IntelliJ as a Maven project and run `ExpenseTrackerApplication`.
5. API base URL: `http://localhost:8081`.

## API endpoints
- `POST /api/users`, `GET /api/users/{id}`, `PUT /api/users/{id}`
- `POST /api/categories`, `GET /api/categories?userId=1`, `PUT /api/categories/{id}`, `DELETE /api/categories/{id}?userId=1`
- `POST /api/transactions`, `GET /api/transactions?userId=1&page=0&size=10`, `GET /api/transactions/{id}?userId=1`, `PUT /api/transactions/{id}`, `DELETE /api/transactions/{id}?userId=1`
- `POST /api/budgets`, `GET /api/budgets?userId=1`, `PUT /api/budgets/{id}`, `DELETE /api/budgets/{id}?userId=1`
- `GET /api/dashboard/summary?userId=1`

Transaction filters: optional `type`, `categoryId`, `startDate`, `endDate`, `page`, `size`, `sortBy` (date/amount/title), and `direction` (ASC/DESC).

## Notes
This is a learning project without authentication or authorization. User IDs in requests are not a security boundary. Do not use it for real financial data or deploy publicly until authentication and authorization are implemented. `ddl-auto=update` is for local development; use database migrations for production.
