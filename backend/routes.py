from flask import current_app as app, jsonify, render_template, request, send_file, send_from_directory
from flask_security import auth_required, hash_password
from flask_security.utils import verify_password
from backend.models import UserRoles, Role, db
from datetime import datetime  
from backend.celery.tasks import create_csv 
from celery.result import AsyncResult
from flask_security import auth_required, current_user
import os

datastore = app.security.datastore
cache = app.cache
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<path:filename>')
def static_files(filename):
    file_path = os.path.join('frontend', filename)
    if os.path.isfile(file_path):
        return send_from_directory('frontend', filename)
    else:
        return send_from_directory('frontend', 'index.html')

# Catch-all for Vue history mode
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return send_from_directory('frontend','index.html')

@app.get('/get-csv/<id>')
def getCSV(id):
    result = AsyncResult(id)
    if result.ready():
        return send_file(f'./backend/celery/user-downloads/{result.result}'), 200
    else:
        return {'message' : 'task not ready'}, 405


@app.get('/create-csv')
@auth_required('token')
def createCSV():
    task = create_csv.delay(current_user.id)
    return {'task_id': task.id}, 200


@app.get('/cache')
@cache.cached(timeout = 5)
def cache():
    return {'time' : str(datetime.now())}

@app.get('/protected')
@auth_required('token')
def protected():
    return "This is a protected route. You must be logged in to see this."

@app.route('/login', methods=['GET', 'POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = datastore.find_user(email=email)
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 404
    if not user:
        return jsonify({"message": "User not found"}), 404
    if user and verify_password(password, user.password):
        return jsonify({"message": "Login successful", 'token' : user.get_auth_token(), 'email' : user.email, 'role' : user.roles[0].name, 'id' : user.id}), 200
    return jsonify({"message": "Invalid credentials"}), 400

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 404

    if datastore.find_user(email=email):
        return jsonify({"message": "User already exists"}), 400

    try:
        user_role = Role.query.filter_by(name='user').first()
        if not user_role:
            user_role = Role(name='user')
            db.session.add(user_role)
            db.session.commit()

        user = datastore.create_user(
            email=email,
            password=hash_password(password),
            roles=[user_role],
            active=True
        )
        db.session.commit()

        return jsonify({
            "message": "User created successfully",
            "token": user.get_auth_token(),
            "email": user.email,
            "role": user.roles[0].name,
            "id": user.id
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating user", "error": str(e)}), 500

