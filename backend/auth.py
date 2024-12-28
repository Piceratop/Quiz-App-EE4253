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
            database=os.getenv('DB_NAME'),
            charset='utf8mb4',  
            use_unicode=True,   
            collation='utf8mb4_unicode_ci'  
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
    connection = get_db_connection()
    if not connection:
        return None

    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM Users WHERE LOWER(username) = LOWER(%s)", (username,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            return None

        hashed_password = hash_password(password)

        insert_query = "INSERT INTO Users (username, password_hash, role) VALUES (%s, %s, %s)"
        cursor.execute(insert_query, (username, hashed_password, 'user'))
        
        connection.commit()
        user_id = cursor.lastrowid
        
        token = generate_jwt_token(user_id, username)
        return True, (token, user_id, username)

    except mysql.connector.Error as err:
        print(f"Error registering user: {err}")
        connection.rollback()
        return False, "Registration failed"
    finally:
        cursor.close()
        connection.close()

def login_user(username, password):
    connection = get_db_connection()
    if not connection:
        return None

    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM Users WHERE LOWER(username) = LOWER(%s)", (username,))
        user = cursor.fetchone()
        
        if user and verify_password(password, user['password_hash']):
            token = generate_jwt_token(user['id'], user['username'])
            return True, (token, user['id'], user['username'])
        
        return False, "Invalid credentials"

    except mysql.connector.Error as err:
        print(f"Error logging in: {err}")
        return False, "Login failed"
    finally:
        cursor.close()
        connection.close()

def update_username(user_id, new_username):
    connection = get_db_connection()
    if not connection:
        return False

    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM Users WHERE LOWER(username) = LOWER(%s)", (new_username,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            return False, "Username already exists"

        update_query = "UPDATE Users SET username = %s WHERE id = %s"
        cursor.execute(update_query, (new_username, user_id))
        
        connection.commit()
        return True, "Username updated successfully"

    except mysql.connector.Error as err:
        print(f"Error updating username: {err}")
        connection.rollback()
        return False, "Username update failed"
    finally:
        cursor.close()
        connection.close()

def update_password(user_id, old_password, new_password):
    connection = get_db_connection()
    if not connection:
        return False

    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT password_hash FROM Users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user or not verify_password(old_password, user['password_hash']):
            return False, "The old password is incorrect"

        hashed_new_password = hash_password(new_password)
        update_query = "UPDATE Users SET password_hash = %s WHERE id = %s"
        cursor.execute(update_query, (hashed_new_password, user_id))
        
        connection.commit()
        return True, "Password updated successfully"

    except mysql.connector.Error as err:
        print(f"Error updating password: {err}")
        connection.rollback()
        return False, "Password update failed"
    finally:
        cursor.close()
        connection.close()
