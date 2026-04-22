from flask import jsonify, request
from database import get_db


def register_doctor_availability_routes(app):
    @app.route("/api/doctor/<int:user_id>/availability", methods=["GET"])
    def get_doctor_manage_availability(user_id):
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

        slots = cursor.execute("""
            SELECT id, available_date, available_time, is_booked
            FROM availability
            WHERE doctor_id = ?
            ORDER BY available_date ASC, available_time ASC
        """, (doctor["id"],)).fetchall()

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
            "doctor": {
                "id": doctor["id"],
                "name": doctor["name"],
                "specialty": doctor["specialty"]
            },
            "availability": availability_list
        })

    @app.route("/api/doctor/<int:user_id>/availability", methods=["POST"])
    def add_doctor_availability(user_id):
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Invalid JSON body"
            }), 400

        available_date = data.get("available_date")
        available_time = data.get("available_time")

        if not available_date or not available_time:
            return jsonify({
                "success": False,
                "message": "available_date and available_time are required"
            }), 400

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

        existing = cursor.execute("""
            SELECT * FROM availability
            WHERE doctor_id = ? AND available_date = ? AND available_time = ?
        """, (doctor["id"], available_date, available_time)).fetchone()

        if existing:
            conn.close()
            return jsonify({
                "success": False,
                "message": "This availability slot already exists"
            }), 409

        cursor.execute("""
            INSERT INTO availability (doctor_id, available_date, available_time, is_booked)
            VALUES (?, ?, ?, 0)
        """, (doctor["id"], available_date, available_time))

        conn.commit()
        slot_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "success": True,
            "message": "Availability slot added successfully",
            "slot_id": slot_id
        }), 201

    @app.route("/api/doctor/<int:user_id>/availability/<int:slot_id>", methods=["DELETE"])
    def delete_doctor_availability(user_id, slot_id):
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

        slot = cursor.execute("""
            SELECT * FROM availability
            WHERE id = ? AND doctor_id = ?
        """, (slot_id, doctor["id"])).fetchone()

        if not slot:
            conn.close()
            return jsonify({
                "success": False,
                "message": "Availability slot not found"
            }), 404

        if slot["is_booked"] == 1:
            conn.close()
            return jsonify({
                "success": False,
                "message": "Booked slots cannot be deleted"
            }), 400

        cursor.execute("""
            DELETE FROM availability
            WHERE id = ? AND doctor_id = ?
        """, (slot_id, doctor["id"]))

        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Availability slot deleted successfully"
        })