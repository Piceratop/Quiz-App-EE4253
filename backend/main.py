from mailbox import Message
from dotenv import load_dotenv
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from mysql.connector.pooling import MySQLConnectionPool
import json
import os
from auth import register_user, login_user, validate_jwt_token, require_token, update_username, update_password

app = Flask(__name__)
CORS(app)

PORT = 8000

load_dotenv()

pool = MySQLConnectionPool(
    pool_name="quiz_app_connection_pool",
    pool_size=8,
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    passwd=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
    port=int(os.getenv("DB_PORT"))
)

### Question Management

# Get Questions

@app.route("/api/questions", methods=["GET"])
def get_questions():
    connection = pool.get_connection()
    mycursor = connection.cursor()
    try:
        connection.start_transaction()
        query = "SELECT * FROM Questions"
        if request.args.get("search"):
            search_term = request.args.get("search")
            query += f" WHERE LOWER(question) LIKE LOWER('%{search_term}%')"
        if request.args.get("page"):
            page = int(request.args.get("page"))
            query += f" ORDER BY id DESC LIMIT {(page - 1) * 5}, 5"
        mycursor.execute(query)
        questions = mycursor.fetchall()
        questions_dict = {}
        for question in questions:
            questions_dict[question[0]] = {
                "question": question[1],
                "question_type": question[2],
                "correct_answers": question[3],
                "possible_answers": question[4],
                "attempt_count": question[5],
                "correct_count": question[6],
                "shuffle": question[7],
                "created_by": question[8]
            }
        connection.commit()
        return jsonify(questions_dict)
    except Exception as e:
        connection.rollback()
        return make_response(jsonify({'error': str(e)}), 500)
    finally:
        mycursor.close()
        connection.close()

@app.route("/api/questions/count", methods=["GET"])
def get_questions_count():
    connection = pool.get_connection()
    mycursor = connection.cursor()
    try:
        connection.start_transaction()
        query = "SELECT COUNT(*) FROM Questions"
        if request.args.get("search"):
            search_term = request.args.get("search")
            query += f" WHERE LOWER(question) LIKE LOWER('%{search_term}%')"
        mycursor.execute(query)
        count = mycursor.fetchone()[0]
        connection.commit()
        return jsonify({"count": count})
    except Exception as e:
        connection.rollback()
        return make_response(jsonify({'error': str(e)}), 500)
    finally:
        mycursor.close()
        connection.close()

@app.route("/api/questions-set", methods=["GET"])
@require_token
def get_questions_set():
    count = int(request.args.get("count"))

    connection = pool.get_connection()
    mycursor = connection.cursor()
    try:
        connection.start_transaction()
        query = "SELECT * FROM Questions ORDER BY RAND() LIMIT %s"
        mycursor.execute(query, (count,))
        questions = mycursor.fetchall()
        questions_dict = []
        for question in questions:
            questions_dict.append({
                "id": question[0],
                "question": question[1],
                "question_type": question[2],
                "correct_answers": question[3],
                "possible_answers": question[4],
                "attempt_count": question[5],
                "correct_count": question[6],
                "shuffle": question[7],
                "created_by": question[8]
            })
        connection.commit()
        return jsonify(questions_dict)
    except Exception as e:
        connection.rollback()
        return make_response(jsonify({'error': str(e)}), 500)
    finally:
        mycursor.close()
        connection.close()
    

# Add Question

@app.route("/api/questions", methods=["POST"])
@require_token
def add_question():
    try:
        question_data = request.get_json()
    except Exception as e:
        return make_response(jsonify({'error': 'Invalid JSON'}), 400)
    
    connection = pool.get_connection()
    mycursor = connection.cursor()
    try:
        correct_answers = json.dumps(question_data['correct_answers'])
        possible_answers = json.dumps(question_data['possible_answers'])
        
        query = "INSERT INTO Questions(question, question_type, correct_answers, possible_answers, shuffle, created_by) VALUES (%s, %s, %s, %s, %s, %s)"
        connection.start_transaction()
        mycursor.execute(query, (
            question_data['question'], 
            question_data['question_type'], 
            correct_answers, 
            possible_answers,
            question_data.get('shuffle', True),
            request.token_payload['user_id']
        ))
        connection.commit()
        return make_response(jsonify({'message': 'Question added successfully', 'question_id': mycursor.lastrowid}), 201)
    except Exception as e:
        connection.rollback()
        return make_response(jsonify({'error': str(e)}), 500)
    finally:
        mycursor.close()
        connection.close()

# Add wrong answers

@app.route("/api/wrong-responses", methods=["POST"])
@require_token
def add_wrong_responses():
    user_id = request.token_payload['user_id']
    try:
        wrong_responses_data = request.get_json()
    except Exception as e:
        return make_response(jsonify({'error': 'Invalid JSON'}), 400)

    connection = pool.get_connection()
    mycursor = connection.cursor()
    try:
        connection.start_transaction()
        for wrong_response in wrong_responses_data:
            mycursor.execute("SELECT * FROM WrongResponseRecords WHERE user_id = %s AND question_id = %s", (user_id, wrong_response))
            if mycursor.fetchone():
                continue
            mycursor.execute("INSERT INTO WrongResponseRecords (user_id, question_id) VALUES (%s, %s)", (user_id, wrong_response))
        connection.commit()
        return make_response(jsonify({'message': 'Wrong responses added successfully'}), 201)
    except Exception as e:
        connection.rollback()
        return make_response(jsonify({'error': str(e)}), 500)
    finally:
        mycursor.close()
        connection.close()

### User Management

# Login and Register

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing required fields"}), 400

    success, result = register_user(username, password)
    
    if success:
        return jsonify({"token": result[0], "id": result[1], "user": username}), 201
    else:
        return jsonify({"error": result}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    success, result= login_user(username, password)
    
    if success:
        return jsonify({"token": result[0], "id": result[1], "user": username}), 200
    else:
        return jsonify({"error": result}), 401

# Update Username and Password

@app.route('/api/update-username', methods=['PATCH'])
@require_token
def update_username_route():
    data = request.get_json()
    new_username = data.get('username')

    if not new_username:
        return jsonify({"error": "New username is required"}), 400

    user_id = request.token_payload['user_id']

    success, message = update_username(user_id, new_username)
    
    if success:
        return jsonify({"message": message, "new_username": new_username}), 200
    else:
        return jsonify({"error": message}), 400

@app.route('/api/update-password', methods=['PATCH'])
@require_token
def update_password_route():
    data = request.get_json()
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    if not new_password:
        return jsonify({"error": "New password is required"}), 400

    user_id = request.token_payload['user_id']

    success, message = update_password(user_id, old_password, new_password)
    
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 400

if __name__ == "__main__":
    app.run(port=PORT, debug=True)
