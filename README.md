# DocTime — Healthcare Appointment Management System

DocTime is a full-stack healthcare appointment management application built with **React, Java Spring Boot, and H2**. The platform provides dedicated functionality for patients, doctors, and administrators to manage the appointment process through role-specific dashboards.

## Key Features

### Patient

- Search and discover doctors
- Book appointments based on doctor availability
- View and manage appointments
- Message doctors
- Manage profile settings
- Create a patient account through the sign-up system

### Doctor

- Access a dedicated doctor dashboard
- View and manage appointments
- Manage patient information
- Create and manage availability
- Monitor scheduled appointments

### Admin

- Access a centralized administration dashboard
- Manage users
- Manage doctors
- Manage appointments
- View system-level information

## Tech Stack

### Frontend

- React
- Vite
- JavaScript

### Backend

- Java 17
- Spring Boot
- Spring Data JPA

### Database

- H2 in-memory database

## Application Architecture

```text
React + Vite Frontend
        |
        | HTTP Requests
        v
Java Spring Boot Backend
        |
        | JPA
        v
   H2 Database
```

The frontend runs independently from the Spring Boot backend. Application data is managed through the H2 in-memory database.

## Project Structure

```text
Doctime/
├── backend-java/    # Java Spring Boot backend
├── frontend/        # React + Vite frontend
├── README.md
└── Part I Doctime.docx
```

## Requirements

Before running DocTime, install:

- Java 17
- Node.js 16 or newer
- npm

Verify the installations:

```bash
java -version
node -v
npm -v
```

## Running the Application

### 1. Start the Backend

From the DocTime project directory:

```bash
cd backend-java
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend runs at:

```text
http://localhost:8080
```

### 2. Start the Frontend

Open another terminal and navigate to the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

Open `http://localhost:5173` in a browser to access DocTime.

## Test Accounts

### Patient

- **Email:** `patient@test.com`
- **Password:** `123456`
- **Role:** Patient

### Administrator

- **Email:** `admin@test.com`
- **Password:** `123456`
- **Role:** Admin

### Doctor Accounts

The application includes multiple seeded doctor accounts for testing:

| Doctor | Email |
| --- | --- |
| Dr. Sarah Johnson | `sarah.johnson@doctime.com` |
| Dr. Michael Chen | `michael.chen@doctime.com` |
| Dr. Emily Rodriguez | `emily.rodriguez@doctime.com` |
| Dr. David Patel | `david.patel@doctime.com` |
| Dr. Laura Smith | `laura.smith@doctime.com` |
| Dr. James Walker | `james.walker@doctime.com` |
| Dr. Nina Brooks | `nina.brooks@doctime.com` |
| Dr. Olivia Turner | `olivia.turner@doctime.com` |
| Dr. Ethan Murphy | `ethan.murphy@doctime.com` |
| Dr. Sophia Bennett | `sophia.bennett@doctime.com` |
| Dr. Marcus Reed | `marcus.reed@doctime.com` |
| Dr. Priya Nair | `priya.nair@doctime.com` |

**Doctor password:** `123456`

Users can also create an account through the application's sign-up functionality.

## H2 Database

DocTime uses an **H2 in-memory database**, allowing the application to run without installing a separate database server.

Because the database is stored in memory:

- Test data is automatically loaded when the application starts.
- Data resets when the backend is restarted.
- No external database installation is required.

### H2 Console

The H2 database console is available at:

```text
http://localhost:8080/h2-console
```

Use the following settings:

```text
JDBC URL: jdbc:h2:mem:doctime
Username: sa
Password: [leave blank]
```

## Future Improvements

Potential improvements include:

- Persistent production database
- Enhanced authentication and authorization
- Appointment reminders and notifications
- Expanded doctor-patient messaging
- Deployment to a cloud environment
- Improved responsive/mobile support

## Project Purpose

DocTime was developed as a full-stack software project to demonstrate the integration of a modern frontend, REST-based backend, relational data management, and role-based application functionality in a healthcare appointment system.