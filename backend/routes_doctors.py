from flask import jsonify
from database import get_db


def register_doctor_routes(app):
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
            except Exception:
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