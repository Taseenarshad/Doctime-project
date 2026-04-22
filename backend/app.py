from flask import Flask, jsonify
from database import init_db
from routes_auth import register_auth_routes
from routes_doctors import register_doctor_routes
from routes_availability import register_availability_routes
from routes_appointments import register_appointment_routes
from routes_doctor_dashboard import register_doctor_dashboard_routes
from routes_doctor_availability import register_doctor_availability_routes
from routes_admin_dashboard import register_admin_dashboard_routes

app = Flask(__name__)
app.secret_key = "mysecretkey"

init_db()
register_auth_routes(app)
register_doctor_routes(app)
register_availability_routes(app)
register_appointment_routes(app)
register_doctor_dashboard_routes(app)
register_doctor_availability_routes(app)
register_admin_dashboard_routes(app)


@app.route("/")
def home():
    return jsonify({"message": "Backend is running"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)