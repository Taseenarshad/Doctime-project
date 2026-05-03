# DocTime – Full Stack Healthcare Appointment System

## 📌 Project Overview

DocTime is a full-stack web application that allows patients to:

* Search for doctors
* Book appointments
* Message doctors
* Manage profile settings

The system also includes:

* Doctor dashboard (manage appointments, patients, availability)
* Admin dashboard (manage users, doctors, appointments)

---

## ⚙️ Requirements

Before running the project, make sure the following are installed:

* Java 17
* Node.js (v16 or higher) must be installed 
* npm  (comes with Node.js)

You can verify installations using:

java -version
node -v
npm -v

---

## 🚀 How to Run the Project

### 🔹 Step 1 – Run Backend

Make sure you are inside the correct folder before running commands.
Navigate to the project folder (where the Doctime folder is located):

Open a terminal:

```bash
cd Doctime/backend-java
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

Backend will run at:

```
http://localhost:8080
```

---

### 🔹 Step 2 – Run Frontend

Open a **new terminal**:

```bash
cd Doctime/frontend
npm install  (**MUST RUN THIS**)
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

### 🔹 Step 3 – Open Application

Open your browser and go to:

```
http://localhost:5173
```

---

## 🔐 Test Accounts

### 👤 Patient Account

* Email: `patient@test.com`
* Password: `123456`
* Role: Patient

---

### 🛠️ Admin Account

* Email: `admin@test.com`
* Password: `123456`
* Role: Admin

---

### 🩺 Doctor Accounts

Use any of the following doctor accounts to access the Doctor Dashboard:

| Name                | Email                                                             |
| ------------------- | ----------------------------------------------------------------- |
| Dr. Sarah Johnson   | [sarah.johnson@doctime.com](mailto:sarah.johnson@doctime.com)     |
| Dr. Michael Chen    | [michael.chen@doctime.com](mailto:michael.chen@doctime.com)       |
| Dr. Emily Rodriguez | [emily.rodriguez@doctime.com](mailto:emily.rodriguez@doctime.com) |
| Dr. David Patel     | [david.patel@doctime.com](mailto:david.patel@doctime.com)         |
| Dr. Laura Smith     | [laura.smith@doctime.com](mailto:laura.smith@doctime.com)         |
| Dr. James Walker    | [james.walker@doctime.com](mailto:james.walker@doctime.com)       |
| Dr. Nina Brooks     | [nina.brooks@doctime.com](mailto:nina.brooks@doctime.com)         |
| Dr. Olivia Turner   | [olivia.turner@doctime.com](mailto:olivia.turner@doctime.com)     |
| Dr. Ethan Murphy    | [ethan.murphy@doctime.com](mailto:ethan.murphy@doctime.com)       |
| Dr. Sophia Bennett  | [sophia.bennett@doctime.com](mailto:sophia.bennett@doctime.com)   |
| Dr. Marcus Reed     | [marcus.reed@doctime.com](mailto:marcus.reed@doctime.com)         |
| Dr. Priya Nair      | [priya.nair@doctime.com](mailto:priya.nair@doctime.com)           |

* Password (for all doctors): `123456`
* Role: Doctor


### You are also able to create any account using the "Sign up" button beside Log in. 
 (Doesn't have to be real email or password)
---

## 🧠 Notes

* The system uses an **H2 in-memory database**, so:

  * No database installation is required
  * Data resets every time the backend is restarted
  * Test data is automatically loaded

* If the frontend does not load correctly:

  * Ensure both backend and frontend are running

---

## 🧪 Optional: H2 Database Console

You can view the database at:

```
http://localhost:8080/h2-console
```

Use the following settings:

* JDBC URL: `jdbc:h2:mem:doctime`
* Username: `sa`
* Password: (leave blank)

---

## 📦 Submission Notes

* This project is designed to run locally using:

  * Spring Boot (backend)
  * React + Vite (frontend)

* No code changes are required to run on another machine

---

## ✅ End of Setup
