import os
import re
import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
import mysql.connector
from dotenv import load_dotenv
from functools import wraps
from flask import request, jsonify, make_response

# Load environment variables
load_dotenv()

# JWT Configuration
JWT_SECRET = os.getenv('JWT_SECRET', 'your_fallback_secret_key')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_DELTA = timedelta(days=1)

def get_db_connection():
    """Create a database connection."""
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
    """
    Validate password strength:
    - At least 8 characters
    - Contains at least one uppercase, one lowercase, one number
    - Contains at least one special character
    """
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False
    return True

def hash_password(password):
    """Hash a password using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt)

def verify_password(plain_password, hashed_password):
    """Verify a password against its hash."""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def generate_jwt_token(user_id, username):
    """Generate a JWT token for authentication."""
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.now(timezone.utc) + JWT_EXPIRATION_DELTA
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def validate_jwt_token(token):
    """
    Validate and decode a JWT token.
    
    Args:
        token (str): JWT token to validate
    
    Returns:
        dict: Decoded token payload if valid, None otherwise
    """
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
    """
    Decorator to require a valid JWT token for a route.
    
    Args:
        func (callable): The route function to decorate
    
    Returns:
        callable: Wrapped route function with token validation
    """
    @wraps(func)
    def decorated_function(*args, **kwargs):
        # Verify JWT token
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return make_response(jsonify({'error': 'No authorization header'}), 401)
        
        try:
            token = auth_header.split(' ')[1]  # Bearer <token>
            decoded = validate_jwt_token(token)
            if not decoded:
                return make_response(jsonify({'error': 'Invalid token'}), 401)
            
            # Attach decoded token to the request for use in the route
            request.token_payload = decoded
        except Exception as e:
            return make_response(jsonify({'error': 'Invalid token format'}), 401)
        
        return func(*args, **kwargs)
    
    return decorated_function

def register_user(username, password):
    """
    Register a new user with validation and security checks.
    
    Returns:
    - Tuple (success: bool, token/message: str)
    """
    # Validate password
    if not validate_password(password):
        return False, "Password does not meet complexity requirements"

    # Hash password
    hashed_password = hash_password(password)

    # Database insertion
    conn = get_db_connection()
    if not conn:
        return False, "Database connection error"

    try:
        cursor = conn.cursor(dictionary=True)
        
        # Check if username already exists
        cursor.execute("SELECT * FROM Users WHERE username = %s", (username,))
        if cursor.fetchone():
            return False, "Username already exists"

        # Insert new user
        cursor.execute(
            "INSERT INTO Users (username, password_hash, role) VALUES (%s, %s, %s)", 
            (username, hashed_password, 'user')
        )
        conn.commit()

        # Fetch the newly created user to get their ID
        cursor.execute("SELECT * FROM Users WHERE username = %s", (username,))
        user = cursor.fetchone()

        # Automatically generate login token
        token = generate_jwt_token(user['id'], user['username'])
        return True, token

    except mysql.connector.Error as err:
        print(f"Registration error: {err}")
        return False, "Registration failed"
    
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def login_user(username, password):
    """
    Authenticate a user and generate a JWT token.
    
    Returns:
    - Tuple (success: bool, token/message: str)
    """
    conn = get_db_connection()
    if not conn:
        return False, "Database connection error"

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if not user:
            return False, "User not found"

        # Verify password
        if not verify_password(password, user['password_hash']):
            return False, "Invalid credentials"

        # Generate JWT token
        token = generate_jwt_token(user['id'], user['username'])
        return True, token

    except mysql.connector.Error as err:
        print(f"Login error: {err}")
        return False, "Login failed"
    
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
