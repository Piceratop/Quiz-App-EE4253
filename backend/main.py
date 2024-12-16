import http.server
import socketserver
import mysql.connector
import json

PORT = 8000

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="Subsonic-Framing8-Monsieur-Lash",
    database="quiz_app",
    port=3306
)

class QuizAppRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/api/questions"):
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            mycursor = mydb.cursor()
            if self.path == "/api/questions":
                mycursor.execute("SELECT * FROM Questions ORDER BY id DESC")
            else:
                page = int(self.path.split("=")[1])
                mycursor.execute(f"SELECT * FROM Questions ORDER BY id DESC LIMIT {(page - 1) * 5}, 5")
            questions = mycursor.fetchall()
            questions_dict = {}
            for question in questions:
                questions_dict[question[0]] = {
                    "question": question[1],
                    "question_type": question[2],
                    "correct_answer": question[3],
                    "choices": question[4],
                    "correct_count": question[5],
                }
            self.wfile.write(json.dumps(questions_dict).encode())

with socketserver.TCPServer(("", PORT), QuizAppRequestHandler) as httpd:
    print("Server started at http://localhost:" + str(PORT))
    httpd.serve_forever()

