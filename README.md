# DocTime — Team Setup Guide

Welcome to the **DocTime** project. Follow these steps to run the application locally and contribute to development.

---

## Project Overview

DocTime is a healthcare appointment platform with:

* User registration & login
* Role-based access (Patient / Doctor / Admin)
* Doctor discovery by specialty
* Availability scheduling
* Appointment booking
* Patient dashboard

---

## Project Structure

```text
Doctime-project/
├── backend/              # Flask backend API
├── Frontend/frontend/    # React + Vite frontend
```

---

## Prerequisites

Install the following before starting:

* Python 3
* Node.js
* npm

Check installation:

```bash
python3 --version
node -v
npm -v
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/Taseenarshad/Doctime-project.git
cd Doctime-project
```

---

## 2. Run the Backend

Open **Terminal #1**

```bash
cd backend
python3 app.py
```

Backend runs at:

```text
http://127.0.0.1:5000
```

---

## 3. Run the Frontend

Open **Terminal #2**

```bash
cd Frontend/frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

Open that link in your browser.

---

## 4. Seed Test Data

After the backend is running, open another terminal.

### Seed Doctors

```bash
curl -X POST http://127.0.0.1:5000/api/seed-doctors
```

### Seed Availability Slots

```bash
curl -X POST http://127.0.0.1:5000/api/seed-availability
```

---

## 5. Test Accounts

Create accounts through the website signup/login page.

Available roles:

* Patient
* Doctor
* Admin

---

## 6. How to Use the App

1. Start backend
2. Start frontend
3. Open website
4. Register or log in
5. Browse doctors
6. Book appointments

---

## GitHub Team Workflow

### Before Starting Work

```bash
git pull
```

### After Making Changes

```bash
git add .
git commit -m "Describe your changes"
git push
```

---

## Troubleshooting

### npm command not found

Install Node.js:

https://nodejs.org

### Port already in use

Close old backend/frontend terminals and restart.

### Changes not showing

Make sure frontend terminal is running:

```bash
npm run dev
```

---

## Current Development Status

Completed:

* Authentication system
* Doctor discovery
* Availability system
* Booking system
* Patient dashboard

In Progress:

* Doctor dashboard
* Admin dashboard
* Notifications
* Medical records

---

## Notes for Team Members

Please pull latest changes before working to avoid conflicts.

Use clear commit messages.

Example:

```bash
git commit -m "Added patient dashboard UI"
```
