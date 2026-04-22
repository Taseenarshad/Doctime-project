from flask import jsonify
from database import get_db


def register_availability_routes(app):
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