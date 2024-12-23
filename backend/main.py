from dotenv import load_dotenv
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from mysql.connector.pooling import MySQLConnectionPool
import json
import os
from auth import register_user, login_user, validate_jwt_token, require_token

app = Flask(__name__)
CORS(app)

PORT = 8000


load_dotenv()

pool = MySQLConnectionPool(
    pool_name="quiz_app_connection_pool",
    pool_size=5,
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    passwd=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
    port=int(os.getenv("DB_PORT"))
)

@app.route("/api/questions", methods=["GET"])
@require_token
def get_questions():
    connection = pool.get_connection()
    mycursor = connection.cursor()
    try:
        connection.start_transaction()
        if request.args.get("page"):
            page = int(request.args.get("page"))
            mycursor.execute(f"SELECT * FROM Questions ORDER BY id DESC LIMIT {(page - 1) * 5}, 5")
        else:
            mycursor.execute("SELECT * FROM Questions ORDER BY id DESC")
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
                "created_by": question[8]  # Add the created_by field
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
        mycursor.execute("SELECT COUNT(*) FROM Questions")
        count = mycursor.fetchone()[0]
        connection.commit()
        return jsonify({"count": count})
    except Exception as e:
        connection.rollback()
        return make_response(jsonify({'error': str(e)}), 500)
    finally:
        mycursor.close()
        connection.close()

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
        # Use json.dumps to convert lists to JSON strings
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
            request.token_payload['user_id']  # Use the token payload from the decorator
        ))
        connection.commit()
        return make_response(jsonify({'message': 'Question added successfully', 'question_id': mycursor.lastrowid}), 201)
    except Exception as e:
        connection.rollback()
        return make_response(jsonify({'error': str(e)}), 500)
    finally:
        mycursor.close()
        connection.close()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing required fields"}), 400

    success, message = register_user(username, password)
    
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    success, result = login_user(username, password)
    
    if success:
        return jsonify({"token": result}), 200
    else:
        return jsonify({"error": result}), 401

if __name__ == "__main__":
    app.run(port=PORT)
