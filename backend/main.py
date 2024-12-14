import http.server
import socketserver
import mysql.connector

PORT = 8000

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="",
  database="quiz-app",
  port=3306
)

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Server started at http://localhost:" + str(PORT))
    httpd.serve_forever()
