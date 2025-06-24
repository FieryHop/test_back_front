import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from dotenv import load_dotenv
from datetime import datetime
from backend.models import db, User, Task
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
jwt = JWTManager(app)

def is_origin_allowed(origin):
    allowed_domains = [
        "https://test-back-front-658r.vercel.app",
        "https://test-back-front.vercel.app",
        "https://*.vercel.app",
        "http://localhost:5173"
    ]
    
    # Разрешаем все поддомены vercel.app
    if re.match(r"https://[\w-]+\.vercel\.app", origin):
        return True
        
    return origin in allowed_domains

CORS(app, 
     resources={r"/*": {
         "origins": allowed_origins,
         "supports_credentials": True,
         "allow_headers": ["Content-Type", "Authorization"],
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
     }}
)
@app.before_request
def handle_options_request():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        headers = response.headers
        origin = request.headers.get('Origin', '')
        
        # Проверяем, разрешен ли origin
        if any(origin.startswith(o.replace('*', '')) for o in allowed_origins if '*' in o) or origin in allowed_origins:
            headers['Access-Control-Allow-Origin'] = origin
            headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            headers['Access-Control-Allow-Credentials'] = 'true'
            headers['Access-Control-Max-Age'] = '600'
        
        return response

with app.app_context():
    db.create_all()


@app.route('/')
def home():
    return jsonify({
        "message": "Task API is running",
        "endpoints": {
            "register": "/register (POST)",
            "login": "/login (POST)",
            "tasks": "/tasks (GET, POST)",
            "task": "/tasks/<id> (PUT, DELETE)"
        }
    })


@app.route('/favicon.ico')
def favicon():
    return '', 404


@app.errorhandler(400)
def bad_request(e):
    return jsonify(error=str(e)), 400


@app.errorhandler(401)
def unauthorized(e):
    return jsonify(error="Unauthorized: Invalid or expired token"), 401


@app.errorhandler(403)
def forbidden(e):
    return jsonify(error="Forbidden: You don't have permission"), 403


@app.errorhandler(404)
def not_found(e):
    return jsonify(error="Resource not found"), 404


# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify(error="Username and password required"), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify(error="Username already exists"), 400

    user = User(username=data['username'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify(message="User created successfully"), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()

    if not user or not user.check_password(data.get('password')):
        return jsonify(error="Invalid credentials"), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token), 200


@app.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    try:
        
        user_id = int(get_jwt_identity())
        tasks = Task.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'status': task.status,
            'created_at': task.created_at.isoformat()
        } for task in tasks]), 200
    except ValueError:
        return jsonify(error="Invalid user ID"), 401


@app.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    data = request.get_json()
    if not data or 'title' not in data:
        return jsonify(error="Title is required"), 400

    try:
        
        user_id = int(get_jwt_identity())
        task = Task(
            title=data['title'],
            description=data.get('description', ''),
            user_id=user_id
        )
        db.session.add(task)
        db.session.commit()
        return jsonify(message="Task created", id=task.id), 201
    except ValueError:
        return jsonify(error="Invalid user ID"), 401


@app.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    try:
       
        current_user_id = int(get_jwt_identity())
        task = Task.query.get_or_404(task_id)

    
        if task.user_id != current_user_id:
            return jsonify(error="Forbidden: You don't have permission to update this task"), 403

        data = request.get_json()
        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.status = data.get('status', task.status)
        db.session.commit()
        return jsonify(message="Task updated"), 200
    except ValueError:
        return jsonify(error="Invalid user ID"), 401


@app.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    try:
        
        current_user_id = int(get_jwt_identity())
        task = Task.query.get_or_404(task_id)

        
        if task.user_id != current_user_id:
            return jsonify(error="Forbidden: You don't have permission to delete this task"), 403

        db.session.delete(task)
        db.session.commit()
        return jsonify(message="Task deleted"), 200
    except ValueError:
        return jsonify(error="Invalid user ID"), 401


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
