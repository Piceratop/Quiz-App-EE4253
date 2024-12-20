# Quiz-App-EE4253

## How to run the application:

### 1. Clone the repository:
Install git and clone the repository using the following command:
```
git clone https://github.com/EE4253-quiz-app/quiz-app.git
```

### 2. Install dependencies:
In the 'frontend' directory, run the following command to install the required dependencies:
```
npm install
```

In the 'backend' directory, run the following command to install the required dependencies:
```
pip install -r requirements.txt
```

### 3. Run the server:
First, create a MySQL database with the following command:
```
mysql -u root -p 
CREATE DATABASE quiz_app;
```

Then run the command in 'database.sql' to create tables in the database. Read the 'database.sql' file for more details.

In the 'backend' directory, create a .env file and add the following lines:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<password>
DB_NAME=quiz_app
```

Then run the following command to start the backend server:
```
python3 backend/main.py
```

### 4. Run the application:
In the 'frontend' directory, run the following command to start the frontend application:
```
npm run dev
```