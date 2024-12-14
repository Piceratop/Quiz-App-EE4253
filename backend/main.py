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

class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/questions":
            self.send_response(200)
            self.end_headers()
            mycursor = mydb.cursor()
            mycursor.execute("SELECT * FROM questions")
            questions = mycursor.fetchall()
            self.wfile.write(json.dumps(questions).encode())

with socketserver.TCPServer(("", PORT), MyRequestHandler) as httpd:
    print("Server started at http://localhost:" + str(PORT))
    httpd.serve_forever()

