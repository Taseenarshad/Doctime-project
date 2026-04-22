from flask import jsonify, request
from database import get_db


def register_appointment_routes(app):
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