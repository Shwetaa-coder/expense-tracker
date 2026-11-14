# Expense Tracker

A full-stack Expense Tracker application built to help users manage their personal finances, track income and expenses, set monthly budgets, and monitor their spending.

## Features

- **Transaction Management:** Add, update, delete, and view income and expense transactions.
- **Category Management:** Organize transactions by categories.
- **Budget Management:** Create, update, and delete monthly budgets.
- **Budget Tracking:** Monitor total spending and remaining budget.
- **Dashboard:** View financial summaries and spending insights.
- **RESTful APIs:** Backend APIs for communication between the frontend and backend.

## Tech Stack

### Frontend
- React
- JavaScript
- CSS
- Vite

### Backend
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Bean Validation

### Database
- PostgreSQL

### Tools
- IntelliJ IDEA
- Postman
- Git and GitHub
- pgAdmin

## Project Structure

```text
expense-tracker/
├── frontend/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── src/
│   └── pom.xml
│
└── README.md
```

*Note: Update the folder structure above to match the actual project structure.*

## Getting Started

### Prerequisites

- Java JDK
- Maven
- Node.js and npm
- PostgreSQL
- Git

### Backend Setup

1. Clone the repository.
2. Create a PostgreSQL database named `expense_tracker`.
3. Configure the database connection in `application.properties`.
4. Set your database password using the `DB_PASSWORD` environment variable.
5. Run the Spring Boot application.

### Frontend Setup

1. Navigate to the frontend directory.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## API Testing

Backend REST APIs can be tested using Postman.

## Learning Outcomes

- Building REST APIs using Spring Boot.
- Implementing CRUD operations.
- Integrating React with a Spring Boot backend.
- Connecting PostgreSQL using Spring Data JPA and Hibernate.
- Implementing validation and exception handling.
- Managing project versions using Git.

## Future Enhancements

- User authentication and authorization.
- Advanced financial analytics.
- Interactive spending charts.
- Export financial reports.

## Author

Developed as a full-stack development project.