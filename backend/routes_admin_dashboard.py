from flask import jsonify
from database import get_db


def register_admin_dashboard_routes(app):
    @app.route("/api/admin/<int:user_id>/dashboard", methods=["GET"])
    def get_admin_dashboard(user_id):
        conn = get_db()
        cursor = conn.cursor()

        admin_user = cursor.execute("""
            SELECT * FROM users
            WHERE id = ? AND role = 'admin'
        """, (user_id,)).fetchone()

        if not admin_user:
            conn.close()
            return jsonify({
                "success": False,
                "message": "Admin user not found"
            }), 404

        total_patients = cursor.execute("""
            SELECT COUNT(*) AS count FROM users
            WHERE role = 'patient'
        """).fetchone()["count"]

        total_doctor_users = cursor.execute("""
            SELECT COUNT(*) AS count FROM users
            WHERE role = 'doctor'
        """).fetchone()["count"]

        total_doctors = cursor.execute("""
            SELECT COUNT(*) AS count FROM doctors
        """).fetchone()["count"]

        total_appointments = cursor.execute("""
            SELECT COUNT(*) AS count FROM appointments
        """).fetchone()["count"]

        completed_appointments = cursor.execute("""
            SELECT COUNT(*) AS count FROM appointments
            WHERE status = 'Completed'
        """).fetchone()["count"]

        cancelled_appointments = cursor.execute("""
            SELECT COUNT(*) AS count FROM appointments
            WHERE status = 'Cancelled'
        """).fetchone()["count"]

        users = cursor.execute("""
            SELECT id, name, email, role
            FROM users
            ORDER BY id DESC
        """).fetchall()

        doctors = cursor.execute("""
            SELECT id, name, specialty, clinic, location, email, rating
            FROM doctors
            ORDER BY id DESC
        """).fetchall()

        recent_appointments = cursor.execute("""
            SELECT
                appointments.id,
                appointments.appointment_date,
                appointments.appointment_time,
                appointments.status,
                doctors.name AS doctor_name,
                doctors.specialty AS doctor_specialty,
                users.name AS patient_name
            FROM appointments
            JOIN doctors ON appointments.doctor_id = doctors.id
            JOIN users ON appointments.patient_id = users.id
            ORDER BY appointments.id DESC
            LIMIT 10
        """).fetchall()

        conn.close()

        user_list = []
        for user in users:
            user_list.append({
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            })

        doctor_list = []
        for doctor in doctors:
            doctor_list.append({
                "id": doctor["id"],
                "name": doctor["name"],
                "specialty": doctor["specialty"],
                "clinic": doctor["clinic"],
                "location": doctor["location"],
                "email": doctor["email"],
                "rating": doctor["rating"]
            })

        appointment_list = []
        for appt in recent_appointments:
            appointment_list.append({
                "id": appt["id"],
                "appointment_date": appt["appointment_date"],
                "appointment_time": appt["appointment_time"],
                "status": appt["status"],
                "doctor_name": appt["doctor_name"],
                "doctor_specialty": appt["doctor_specialty"],
                "patient_name": appt["patient_name"]
            })

        return jsonify({
            "success": True,
            "summary": {
                "total_patients": total_patients,
                "total_doctor_users": total_doctor_users,
                "total_doctors": total_doctors,
                "total_appointments": total_appointments,
                "completed_appointments": completed_appointments,
                "cancelled_appointments": cancelled_appointments
            },
            "users": user_list,
            "doctors": doctor_list,
            "recent_appointments": appointment_list
        })