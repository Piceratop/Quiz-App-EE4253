import os
import re
import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
import mysql.connector
from dotenv import load_dotenv
from functools import wraps
from flask import request, jsonify, make_response

load_dotenv()

JWT_SECRET = os.getenv('JWT_SECRET', 'your_fallback_secret_key')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_DELTA = timedelta(days=1)

def get_db_connection():
    try:
        return mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
        return None

def validate_password(password):
    if len(password) < 8:
        return False
    return True

def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt)

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def generate_jwt_token(user_id, username):
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.now(timezone.utc) + JWT_EXPIRATION_DELTA
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def validate_jwt_token(token):
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        return None
    except jwt.InvalidTokenError:
        print("Invalid token")
        return None

def require_token(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return make_response(jsonify({'error': 'No authorization header'}), 401)
        
        try:
            token = auth_header.split(' ')[1]
            decoded = validate_jwt_token(token)
            if not decoded:
                return make_response(jsonify({'error': 'Invalid token'}), 401)
            
            request.token_payload = decoded
        except Exception as e:
            return make_response(jsonify({'error': 'Invalid token format'}), 401)
        
        return func(*args, **kwargs)
    
    return decorated_function

def register_user(username, password):
    if not validate_password(password):
        return False, "Password does not meet complexity requirements"

    hashed_password = hash_password(password)

    conn = get_db_connection()
    if not conn:
        return False, "Database connection error"

    try:
        conn.start_transaction()
        
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM Users WHERE username = %s", (username,))
        if cursor.fetchone():
            conn.rollback()
            return False, "Username already exists"

        cursor.execute(
            "INSERT INTO Users (username, password_hash, role) VALUES (%s, %s, %s)", 
            (username, hashed_password, 'user')
        )

        cursor.execute("SELECT * FROM Users WHERE username = %s", (username,))
        user = cursor.fetchone()

        conn.commit()

        token = generate_jwt_token(user['id'], user['username'])
        return True, token, user['id'], user['username']

    except mysql.connector.Error as err:
        conn.rollback()
        print(f"Registration error: {err}")
        return False, "Registration failed"
    
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def login_user(username, password):
    conn = get_db_connection()
    if not conn:
        return False, "Database connection error"

    try:
        conn.start_transaction()
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if not user:
            conn.rollback()
            return False, "User not found"

        if not verify_password(password, user['password_hash']):
            conn.rollback()
            return False, "Invalid credentials"

        conn.commit()

        token = generate_jwt_token(user['id'], user['username'])
        return True, (token, user['id'])

    except mysql.connector.Error as err:
        conn.rollback()
        print(f"Login error: {err}")
        return False, "Login failed"
    
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def update_username(user_id, new_username):
    if not new_username or len(new_username) < 3:
        return False, "Username must be at least 3 characters long"

    conn = get_db_connection()
    if not conn:
        return False, "Database connection error"

    try:
        conn.start_transaction()
        
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM Users WHERE username = %s", (new_username,))
        if cursor.fetchone():
            conn.rollback()
            return False, "Username already exists"

        cursor.execute(
            "UPDATE Users SET username = %s WHERE id = %s", 
            (new_username, user_id)
        )

        if cursor.rowcount == 0:
            conn.rollback()
            return False, "User not found"

        conn.commit()

        return True, "Username updated successfully"

    except mysql.connector.Error as err:
        conn.rollback()
        print(f"Username update error: {err}")
        return False, "Username update failed"
    
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def update_password(user_id, old_password, new_password):
    if not validate_password(new_password):
        return False, "New password does not meet complexity requirements"

    conn = get_db_connection()
    if not conn:
        return False, "Database connection error"

    try:
        conn.start_transaction()
        
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM Users WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        if not user:
            conn.rollback()
            return False, "User not found"

        if not verify_password(old_password, user['password_hash']):
            conn.rollback()
            return False, "The old password is incorrect"

        new_hashed_password = hash_password(new_password)

        cursor.execute(
            "UPDATE Users SET password_hash = %s WHERE id = %s", 
            (new_hashed_password, user_id)
        )

        if cursor.rowcount == 0:
            conn.rollback()
            return False, "Password update failed"

        conn.commit()

        return True, "Password updated successfully"

    except mysql.connector.Error as err:
        conn.rollback()
        print(f"Password update error: {err}")
        return False, "Password update failed"
    
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
