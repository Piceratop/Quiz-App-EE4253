import os
import re
import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
import mysql.connector
from dotenv import load_dotenv

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
    """Validate and decode a JWT token."""
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def register_user(username, password):
    """
    Register a new user with validation and security checks.
    
    Returns:
    - Tuple (success: bool, message: str)
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
        cursor = conn.cursor()
        
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
        return True, "User registered successfully"

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
