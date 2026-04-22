from flask import request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from database import get_db


def register_auth_routes(app):
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