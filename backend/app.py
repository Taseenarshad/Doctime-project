from flask import Flask, request, session, jsonify
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "mysecretkey"


def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialty TEXT NOT NULL,
            clinic TEXT NOT NULL,
            location TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            bio TEXT,
            rating REAL DEFAULT 4.5
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS availability (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doctor_id INTEGER NOT NULL,
            available_date TEXT NOT NULL,
            available_time TEXT NOT NULL,
            is_booked INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (doctor_id) REFERENCES doctors(id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doctor_id INTEGER NOT NULL,
            patient_id INTEGER NOT NULL,
            availability_id INTEGER,
            appointment_date TEXT NOT NULL,
            appointment_time TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Booked',
            notes TEXT,
            FOREIGN KEY (doctor_id) REFERENCES doctors(id),
            FOREIGN KEY (patient_id) REFERENCES users(id),
            FOREIGN KEY (availability_id) REFERENCES availability(id)
        )
    """)

    conn.commit()
    conn.close()


init_db()


# -------------------------
# Basic Route
# -------------------------

@app.route("/")
def home():
    return jsonify({"message": "Backend is running"})


# -------------------------
# Authentication Routes
# -------------------------

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "message": "Invalid JSON body"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not name or not email or not password or not role:
        return jsonify({"success": False, "message": "All fields are required"}), 400

    hashed_password = generate_password_hash(password)

    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            (name, email, hashed_password, role)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"success": False, "message": "Email already exists"}), 409

    conn.close()

    return jsonify({
        "success": True,
        "message": "Registration successful"
    }), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "message": "Invalid JSON body"}), 400

    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password or not role:
        return jsonify({"success": False, "message": "Email, password, and role are required"}), 400

    conn = get_db()
    cursor = conn.cursor()

    user = cursor.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    conn.close()

    if not user:
        return jsonify({"success": False, "message": "Invalid email or password"}), 401

    if not check_password_hash(user["password"], password):
        return jsonify({"success": False, "message": "Invalid email or password"}), 401

    if user["role"] != role:
        return jsonify({"success": False, "message": "Selected role does not match account"}), 403

    session["user_id"] = user["id"]
    session["name"] = user["name"]
    session["role"] = user["role"]

    return jsonify({
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    })


@app.route("/api/me", methods=["GET"])
def me():
    if "user_id" not in session:
        return jsonify({"loggedIn": False}), 401

    return jsonify({
        "loggedIn": True,
        "user": {
            "id": session["user_id"],
            "name": session["name"],
            "role": session["role"]
        }
    })


@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True, "message": "Logged out"})


# -------------------------
# Doctor Routes
# -------------------------

@app.route("/api/seed-doctors", methods=["POST"])
def seed_doctors():
    conn = get_db()
    cursor = conn.cursor()

    doctors = [
        (
            "Dr. Sarah Johnson",
            "Cardiology",
            "HeartCare Medical Center",
            "Dallas, TX",
            "214-555-1001",
            "sarah.johnson@doctime.com",
            "Experienced cardiologist specializing in preventive heart care.",
            4.8
        ),
        (
            "Dr. Michael Chen",
            "Dermatology",
            "Skin Health Clinic",
            "Houston, TX",
            "713-555-2002",
            "michael.chen@doctime.com",
            "Board-certified dermatologist focused on skin wellness and treatment.",
            4.7
        ),
        (
            "Dr. Emily Rodriguez",
            "Pediatrics",
            "Sunrise Children's Clinic",
            "Austin, TX",
            "512-555-3003",
            "emily.rodriguez@doctime.com",
            "Compassionate pediatrician with a focus on family-centered care.",
            4.9
        ),
        (
            "Dr. David Patel",
            "Neurology",
            "Advanced Neuro Specialists",
            "San Antonio, TX",
            "210-555-4004",
            "david.patel@doctime.com",
            "Neurologist with expertise in brain and nervous system disorders.",
            4.6
        ),
        (
            "Dr. Laura Smith",
            "General Practice",
            "Community Health Partners",
            "Fort Worth, TX",
            "817-555-5005",
            "laura.smith@doctime.com",
            "Primary care physician providing comprehensive general healthcare.",
            4.8
        ),
        (
            "Dr. James Walker",
            "Orthopedics",
            "Premier Bone & Joint Center",
            "El Paso, TX",
            "915-555-6006",
            "james.walker@doctime.com",
            "Orthopedic specialist focused on joint pain, fractures, and sports injuries.",
            4.7
        ),
        (
            "Dr. Nina Brooks",
            "Psychiatry",
            "MindWell Behavioral Health",
            "Plano, TX",
            "972-555-7007",
            "nina.brooks@doctime.com",
            "Psychiatrist providing compassionate mental health evaluation and treatment.",
            4.8
        ),
        (
            "Dr. Olivia Turner",
            "Ophthalmology",
            "ClearView Eye Institute",
            "Irving, TX",
            "469-555-8008",
            "olivia.turner@doctime.com",
            "Eye specialist offering vision care, eye exams, and surgical consultations.",
            4.9
        ),
        (
            "Dr. Ethan Murphy",
            "ENT",
            "North Texas ENT Associates",
            "Arlington, TX",
            "682-555-9009",
            "ethan.murphy@doctime.com",
            "ENT physician treating ear, nose, throat, sinus, and allergy conditions.",
            4.6
        ),
        (
            "Dr. Sophia Bennett",
            "Gynecology",
            "Women's Wellness Clinic",
            "Frisco, TX",
            "214-555-1010",
            "sophia.bennett@doctime.com",
            "Gynecologist dedicated to preventive care and women’s health services.",
            4.8
        ),
        (
            "Dr. Marcus Reed",
            "Oncology",
            "Hope Cancer Center",
            "McKinney, TX",
            "469-555-1111",
            "marcus.reed@doctime.com",
            "Oncologist specializing in personalized cancer treatment and follow-up care.",
            4.7
        ),
        (
            "Dr. Priya Nair",
            "Endocrinology",
            "Metro Endocrine Specialists",
            "Richardson, TX",
            "972-555-1212",
            "priya.nair@doctime.com",
            "Endocrinologist treating diabetes, thyroid, and hormone-related conditions.",
            4.9
        )
    ]

    inserted = 0

    for doctor in doctors:
        try:
            cursor.execute("""
                INSERT INTO doctors (
                    name, specialty, clinic, location, phone, email, bio, rating
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, doctor)
            inserted += 1
        except sqlite3.IntegrityError:
            pass

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": f"{inserted} doctors inserted"
    })


@app.route("/api/doctors", methods=["GET"])
def get_doctors():
    conn = get_db()
    cursor = conn.cursor()

    doctors = cursor.execute("""
        SELECT * FROM doctors
    """).fetchall()

    conn.close()

    doctor_list = []
    for doctor in doctors:
        doctor_list.append({
            "id": doctor["id"],
            "name": doctor["name"],
            "specialty": doctor["specialty"],
            "clinic": doctor["clinic"],
            "location": doctor["location"],
            "phone": doctor["phone"],
            "email": doctor["email"],
            "bio": doctor["bio"],
            "rating": doctor["rating"]
        })

    return jsonify({
        "success": True,
        "doctors": doctor_list
    })


# -------------------------
# Availability Routes
# -------------------------

@app.route("/api/seed-availability", methods=["POST"])
def seed_availability():
    conn = get_db()
    cursor = conn.cursor()

    slots = [
        (1, "2026-04-25", "09:00 AM"),
        (1, "2026-04-25", "10:00 AM"),
        (1, "2026-04-25", "11:00 AM"),
        (2, "2026-04-25", "01:00 PM"),
        (2, "2026-04-25", "02:00 PM"),
        (3, "2026-04-26", "09:30 AM"),
        (3, "2026-04-26", "10:30 AM"),
        (4, "2026-04-26", "03:00 PM"),
        (5, "2026-04-27", "08:30 AM"),
        (6, "2026-04-27", "11:30 AM"),
        (7, "2026-04-28", "02:00 PM"),
        (8, "2026-04-28", "04:00 PM"),
        (9, "2026-04-29", "09:00 AM"),
        (10, "2026-04-29", "10:00 AM"),
        (11, "2026-04-30", "01:30 PM"),
        (12, "2026-04-30", "03:30 PM")
    ]

    inserted = 0

    for slot in slots:
        existing = cursor.execute("""
            SELECT * FROM availability
            WHERE doctor_id = ? AND available_date = ? AND available_time = ?
        """, slot).fetchone()

        if not existing:
            cursor.execute("""
                INSERT INTO availability (doctor_id, available_date, available_time)
                VALUES (?, ?, ?)
            """, slot)
            inserted += 1

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": f"{inserted} availability slots inserted"
    })


@app.route("/api/doctors/<int:doctor_id>/availability", methods=["GET"])
def get_doctor_availability(doctor_id):
    conn = get_db()
    cursor = conn.cursor()

    doctor = cursor.execute(
        "SELECT * FROM doctors WHERE id = ?",
        (doctor_id,)
    ).fetchone()

    if not doctor:
        conn.close()
        return jsonify({"success": False, "message": "Doctor not found"}), 404

    slots = cursor.execute("""
        SELECT id, available_date, available_time, is_booked
        FROM availability
        WHERE doctor_id = ?
        ORDER BY available_date, available_time
    """, (doctor_id,)).fetchall()

    conn.close()

    availability_list = []
    for slot in slots:
        availability_list.append({
            "id": slot["id"],
            "available_date": slot["available_date"],
            "available_time": slot["available_time"],
            "is_booked": bool(slot["is_booked"])
        })

    return jsonify({
        "success": True,
        "doctor_id": doctor_id,
        "availability": availability_list
    })


# -------------------------
# Appointment Routes
# -------------------------

@app.route("/api/appointments", methods=["POST"])
def create_appointment():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "message": "Invalid JSON body"}), 400

    doctor_id = data.get("doctor_id")
    patient_id = data.get("patient_id")
    availability_id = data.get("availability_id")
    notes = data.get("notes", "")

    if not doctor_id or not patient_id or not availability_id:
        return jsonify({
            "success": False,
            "message": "doctor_id, patient_id, and availability_id are required"
        }), 400

    conn = get_db()
    cursor = conn.cursor()

    doctor = cursor.execute(
        "SELECT * FROM doctors WHERE id = ?",
        (doctor_id,)
    ).fetchone()

    patient = cursor.execute(
        "SELECT * FROM users WHERE id = ? AND role = 'patient'",
        (patient_id,)
    ).fetchone()

    slot = cursor.execute("""
        SELECT * FROM availability
        WHERE id = ? AND doctor_id = ?
    """, (availability_id, doctor_id)).fetchone()

    if not doctor:
        conn.close()
        return jsonify({"success": False, "message": "Doctor not found"}), 404

    if not patient:
        conn.close()
        return jsonify({"success": False, "message": "Patient not found"}), 404

    if not slot:
        conn.close()
        return jsonify({"success": False, "message": "Availability slot not found"}), 404

    if slot["is_booked"] == 1:
        conn.close()
        return jsonify({"success": False, "message": "This slot is already booked"}), 409

    cursor.execute("""
        INSERT INTO appointments (
            doctor_id,
            patient_id,
            availability_id,
            appointment_date,
            appointment_time,
            status,
            notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        doctor_id,
        patient_id,
        availability_id,
        slot["available_date"],
        slot["available_time"],
        "Booked",
        notes
    ))

    cursor.execute("""
        UPDATE availability
        SET is_booked = 1
        WHERE id = ?
    """, (availability_id,))

    conn.commit()
    appointment_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "success": True,
        "message": "Appointment booked successfully",
        "appointment_id": appointment_id
    }), 201


@app.route("/api/appointments", methods=["GET"])
def get_appointments():
    conn = get_db()
    cursor = conn.cursor()

    appointments = cursor.execute("""
        SELECT
            appointments.id,
            appointments.appointment_date,
            appointments.appointment_time,
            appointments.status,
            appointments.notes,
            doctors.name AS doctor_name,
            doctors.specialty AS doctor_specialty,
            users.name AS patient_name
        FROM appointments
        JOIN doctors ON appointments.doctor_id = doctors.id
        JOIN users ON appointments.patient_id = users.id
        ORDER BY appointments.appointment_date, appointments.appointment_time
    """).fetchall()

    conn.close()

    appointment_list = []
    for appt in appointments:
        appointment_list.append({
            "id": appt["id"],
            "appointment_date": appt["appointment_date"],
            "appointment_time": appt["appointment_time"],
            "status": appt["status"],
            "notes": appt["notes"],
            "doctor_name": appt["doctor_name"],
            "doctor_specialty": appt["doctor_specialty"],
            "patient_name": appt["patient_name"]
        })

    return jsonify({
        "success": True,
        "appointments": appointment_list
    })

@app.route("/api/patient/<int:patient_id>/appointments", methods=["GET"])
def get_patient_appointments(patient_id):
    conn = get_db()
    cursor = conn.cursor()

    patient = cursor.execute(
        "SELECT * FROM users WHERE id = ? AND role = 'patient'",
        (patient_id,)
    ).fetchone()

    if not patient:
        conn.close()
        return jsonify({
            "success": False,
            "message": "Patient not found"
        }), 404

    appointments = cursor.execute("""
        SELECT
            appointments.id,
            appointments.appointment_date,
            appointments.appointment_time,
            appointments.status,
            appointments.notes,
            doctors.name AS doctor_name,
            doctors.specialty AS doctor_specialty,
            doctors.clinic AS clinic_name,
            doctors.location AS doctor_location
        FROM appointments
        JOIN doctors ON appointments.doctor_id = doctors.id
        WHERE appointments.patient_id = ?
        ORDER BY appointments.appointment_date ASC,
                 appointments.appointment_time ASC
    """, (patient_id,)).fetchall()

    conn.close()

    appointment_list = []

    for appt in appointments:
        appointment_list.append({
            "id": appt["id"],
            "appointment_date": appt["appointment_date"],
            "appointment_time": appt["appointment_time"],
            "status": appt["status"],
            "notes": appt["notes"],
            "doctor_name": appt["doctor_name"],
            "doctor_specialty": appt["doctor_specialty"],
            "clinic_name": appt["clinic_name"],
            "doctor_location": appt["doctor_location"]
        })

    return jsonify({
        "success": True,
        "appointments": appointment_list
    })

@app.route("/api/appointments/<int:appointment_id>/cancel", methods=["POST"])
def cancel_appointment(appointment_id):
    conn = get_db()
    cursor = conn.cursor()

    appointment = cursor.execute("""
        SELECT * FROM appointments WHERE id = ?
    """, (appointment_id,)).fetchone()

    if not appointment:
        conn.close()
        return jsonify({
            "success": False,
            "message": "Appointment not found"
        }), 404

    if appointment["status"] == "Cancelled":
        conn.close()
        return jsonify({
            "success": False,
            "message": "Appointment is already cancelled"
        }), 400

    cursor.execute("""
        UPDATE appointments
        SET status = 'Cancelled'
        WHERE id = ?
    """, (appointment_id,))

    if appointment["availability_id"]:
        cursor.execute("""
            UPDATE availability
            SET is_booked = 0
            WHERE id = ?
        """, (appointment["availability_id"],))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Appointment cancelled successfully"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)