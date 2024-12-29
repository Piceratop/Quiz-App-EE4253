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
    port=int(os.getenv("DB_PORT")),
    charset='utf8mb4',   
    use_unicode=True,   
    collation='utf8mb4_unicode_ci'  
)

### Question Management

# Get Questions

@app.route("/api/questions", methods=["GET"])
def get_questions():
    connection = pool.get_connection()
    # Use dictionary cursor to handle Unicode more robustly
    mycursor = connection.cursor(dictionary=True)
    try:
        connection.start_transaction()
        query = "SELECT * FROM Questions"
        if request.args.get("search"):
            search_term = request.args.get("search")
            query += f" WHERE LOWER(question) LIKE LOWER('%{search_term}%')"
        if request.args.get("user"):
            user_id = request.args.get("user")
            query += f" WHERE created_by = {user_id}"
        if request.args.get("page"):
            page = int(request.args.get("page"))
            query += f" ORDER BY id DESC LIMIT {(page - 1) * 5}, 5"
        
        mycursor.execute(query)
        questions = mycursor.fetchall()


        
        questions_dict = {}
        for question in questions:
            # Fetch answers for the question
            mycursor.execute("SELECT answer, correct FROM Answers WHERE question_id = %s", (question['id'],))
            answers = mycursor.fetchall()

            # Prepare correct and possible answers
            correct_answers = [ans['answer'] for ans in answers if ans['correct']]
            possible_answers = [ans['answer'] for ans in answers]

            questions_dict[question['id']] = {
                "question": question['question'],
                "question_type": question['question_type'],
                "correct_answers": json.dumps(correct_answers),
                "possible_answers": json.dumps(possible_answers),
                "attempt_count": question['attempt_count'],
                "correct_count": question['correct_count'],
                "shuffle": question['shuffle'],
                "created_by": question['created_by']
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
    mycursor = connection.cursor(dictionary=True)
    try:
        connection.start_transaction()
        query = "SELECT * FROM Questions ORDER BY RAND() LIMIT %s"
        mycursor.execute(query, (count,))
        questions = mycursor.fetchall()
        
        questions_dict = []
        for question in questions:
            # Fetch answers for the question
            mycursor.execute("SELECT answer, correct FROM Answers WHERE question_id = %s", (question['id'],))
            answers = mycursor.fetchall()
            
            # Prepare correct and possible answers
            correct_answers = [ans['answer'] for ans in answers if ans['correct']]
            possible_answers = [ans['answer'] for ans in answers]
            
            questions_dict.append({
                "id": question['id'],
                "question": question['question'],
                "question_type": question['question_type'],
                "correct_answers": json.dumps(correct_answers),
                "possible_answers": json.dumps(possible_answers),
                "attempt_count": question['attempt_count'],
                "correct_count": question['correct_count'],
                "shuffle": question['shuffle'],
                "created_by": question['created_by']
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
    mycursor = connection.cursor(dictionary=True)
    try:
        connection.start_transaction()
        
        # Insert question
        query = "INSERT INTO Questions(question, question_type, attempt_count, correct_count, shuffle, created_by) VALUES (%s, %s, 0, 0, %s, %s)"
        mycursor.execute(query, (
            question_data['question'], 
            question_data['question_type'], 
            question_data.get('shuffle', True),
            request.token_payload['user_id']
        ))
        question_id = mycursor.lastrowid
        
        # Insert answers
        correct_answers = question_data.get('correct_answers', [])
        possible_answers = question_data.get('possible_answers', [])
        
        # Combine and deduplicate answers
        all_answers = list(set(correct_answers + possible_answers))
        
        for answer in all_answers:
            is_correct = answer in correct_answers
            ans_query = "INSERT INTO Answers(question_id, answer, correct) VALUES (%s, %s, %s)"
            mycursor.execute(ans_query, (question_id, answer, is_correct))
        
        connection.commit()
        return make_response(jsonify({'message': 'Question added successfully', 'question_id': question_id}), 201)
    except Exception as e:
        connection.rollback()
        return make_response(jsonify({'error': str(e)}), 500)
    finally:
        mycursor.close()
        connection.close()

# Delete Question

@app.route("/api/questions/<int:question_id>", methods=["DELETE"])
@require_token
def delete_question(question_id):
    connection = pool.get_connection()
    mycursor = connection.cursor()
    try:
        connection.start_transaction()
        query = "DELETE FROM Questions WHERE id = %s AND created_by = %s"
        mycursor.execute(query, (question_id, request.token_payload['user_id']))
        connection.commit()
        return make_response(jsonify({'message': 'Question deleted successfully'}), 200)
    except Exception as e:
        connection.rollback()
        return make_response(jsonify({'error': str(e)}), 500)
    finally:
        mycursor.close()
        connection.close()

### Wrong Responses

# Get Wrong Responses for a Specified User

@app.route("/api/wrong-responses", methods=["GET"])
@require_token
def get_wrong_responses():
    user_id = request.token_payload['user_id']
    count = request.args.get('count')
    
    # Add logging
    print(f"Fetching wrong responses for user_id: {user_id}, count: {count}")
    
    connection = pool.get_connection()
    mycursor = connection.cursor(dictionary=True)
    try:
        connection.start_transaction()
        query = """SELECT q.* 
                    FROM WrongResponseRecords wr
                    JOIN Questions q ON wr.question_id = q.id
                    WHERE wr.user_id = %s
                    ORDER BY RAND()
                    LIMIT %s"""
        
        print(f"Executing query with params: user_id={user_id}, count={count}")
        
        mycursor.execute(query, (user_id, int(count)))
        wrong_responses = mycursor.fetchall()
        
        wrong_responses_dict = []
        for wrong_response in wrong_responses:
            # Fetch answers for the question
            mycursor.execute("SELECT answer, correct FROM Answers WHERE question_id = %s", (wrong_response['id'],))
            answers = mycursor.fetchall()
            
            # Prepare correct and possible answers
            correct_answers = [ans['answer'] for ans in answers if ans['correct']]
            possible_answers = [ans['answer'] for ans in answers]
            
            wrong_responses_dict.append({
                "id": wrong_response['id'],
                "question": wrong_response['question'],
                "question_type": wrong_response['question_type'],
                "correct_answers": json.dumps(correct_answers),
                "possible_answers": json.dumps(possible_answers),
                "attempt_count": wrong_response['attempt_count'],
                "correct_count": wrong_response['correct_count'],
                "shuffle": wrong_response['shuffle'],
                "created_by": wrong_response['created_by']
            })
        
        connection.commit()
        return jsonify(wrong_responses_dict)
    except Exception as e:
        connection.rollback()
        # Add more detailed error logging
        print(f"Error fetching wrong responses: {str(e)}")
        return make_response(jsonify({'error': str(e)}), 500)
    finally:
        mycursor.close()
        connection.close()

@app.route("/api/wrong-responses/count", methods=["GET"])
@require_token
def count_wrong_responses():
    user_id = request.token_payload['user_id']
    connection = pool.get_connection()
    mycursor = connection.cursor()
    try:
        connection.start_transaction()
        query = "SELECT COUNT(*) FROM WrongResponseRecords WHERE user_id = %s"
        mycursor.execute(query, (user_id,))
        count = mycursor.fetchone()[0]
        connection.commit()
        return jsonify({"count": count})
    except Exception as e:
        connection.rollback()
        return make_response(jsonify({'error': str(e)}), 500)
    finally:
        mycursor.close()
        connection.close()

# Add Wrong Responses

@app.route("/api/wrong-responses", methods=["POST"])
@require_token
def add_wrong_responses():
    user_id = request.token_payload['user_id']
    try:
        wrong_responses_data = request.get_json()
    except Exception as e:
        return make_response(jsonify({'error': 'Invalid JSON'}), 400)

    connection = pool.get_connection()
    mycursor = connection.cursor(dictionary=True)
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

# Remove Wrong Responses

@app.route("/api/wrong-responses", methods=["DELETE"])
@require_token
def remove_wrong_responses():
    user_id = request.token_payload['user_id']
    try:
        wrong_responses_data = request.get_json()
    except Exception as e:
        return make_response(jsonify({'error': 'Invalid JSON'}), 400)

    connection = pool.get_connection()
    mycursor = connection.cursor(dictionary=True)
    try:
        connection.start_transaction()
        for wrong_response in wrong_responses_data:
            mycursor.execute("DELETE FROM WrongResponseRecords WHERE user_id = %s AND question_id = %s", (user_id, wrong_response))
        connection.commit()
        return make_response(jsonify({'message': 'Wrong responses removed successfully'}), 200)
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
