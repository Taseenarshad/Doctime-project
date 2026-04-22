from flask import jsonify
from database import get_db


def register_doctor_dashboard_routes(app):
    @app.route("/api/doctor/<int:user_id>/appointments", methods=["GET"])
    def get_doctor_appointments(user_id):
        conn = get_db()
        cursor = conn.cursor()

        user = cursor.execute("""
            SELECT * FROM users
            WHERE id = ? AND role = 'doctor'
        """, (user_id,)).fetchone()

        if not user:
            conn.close()
            return jsonify({
                "success": False,
                "message": "Doctor user not found"
            }), 404

        doctor = cursor.execute("""
            SELECT * FROM doctors
            WHERE email = ?
        """, (user["email"],)).fetchone()

        if not doctor:
            conn.close()
            return jsonify({
                "success": False,
                "message": "No doctor profile found for this account"
            }), 404

        appointments = cursor.execute("""
            SELECT
                appointments.id,
                appointments.appointment_date,
                appointments.appointment_time,
                appointments.status,
                appointments.notes,
                users.name AS patient_name
            FROM appointments
            JOIN users ON appointments.patient_id = users.id
            WHERE appointments.doctor_id = ?
            ORDER BY appointments.appointment_date ASC,
                     appointments.appointment_time ASC
        """, (doctor["id"],)).fetchall()

        conn.close()

        appointment_list = []

        for appt in appointments:
            appointment_list.append({
                "id": appt["id"],
                "appointment_date": appt["appointment_date"],
                "appointment_time": appt["appointment_time"],
                "status": appt["status"],
                "notes": appt["notes"],
                "patient_name": appt["patient_name"]
            })

        return jsonify({
            "success": True,
            "doctor": {
                "id": doctor["id"],
                "name": doctor["name"],
                "specialty": doctor["specialty"],
                "clinic": doctor["clinic"],
                "location": doctor["location"],
                "email": doctor["email"]
            },
            "appointments": appointment_list
        })