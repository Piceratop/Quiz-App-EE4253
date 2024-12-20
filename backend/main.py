from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import mysql.connector
import json

app = Flask(__name__)
CORS(app)

PORT = 8000

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="Subsonic-Framing8-Monsieur-Lash",
    database="quiz_app",
    port=3306
)

@app.route("/api/questions", methods=["GET"])
def get_questions():
    mycursor = mydb.cursor()
    try:
        mydb.start_transaction()
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
                "correct_answer": question[3],
                "choices": question[4],
                "attempt_count": question[5],
                "correct_count": question[6],
                "shuffle": question[7]
            }
        return jsonify(questions_dict)
    except Exception as e:
        mydb.rollback()
        return make_response(jsonify({'error': str(e)}), 500)


@app.route("/api/questions/count", methods=["GET"])
def get_questions_count():
    mycursor = mydb.cursor()
    try:
        mydb.start_transaction()
        mycursor.execute("SELECT COUNT(*) FROM Questions")
        count = mycursor.fetchone()[0]
        mydb.commit()
        return jsonify({"count": count})
    except:
        mydb.rollback()
        return make_response(jsonify({'error': 'Database error occurred'}), 500)

@app.route("/api/questions", methods=["POST"])
def add_question():
    try:
        question_data = request.get_json()
    except Exception as e:
        return make_response(jsonify({'error': 'Invalid JSON'}), 400)
    mycursor = mydb.cursor()
    try:
        mydb.start_transaction()
        mycursor.execute(f"INSERT INTO Questions (question, question_type, correct_answer, choices, shuffle) VALUES ('{question_data['question']}', '{question_data['question_type']}', '{question_data['correct_answer']}', JSON_ARRAY({question_data['choices']}), '{question_data['shuffle']}')")
        mydb.commit()
        return make_response(jsonify({'message': 'Question added successfully', 'question_id': mycursor.lastrowid}), 201)
    except Exception as e:
        mydb.rollback()
        return make_response(jsonify({'error': str(e)}), 500)

if __name__ == "__main__":
    app.run(port=PORT)


