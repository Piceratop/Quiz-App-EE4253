# Quiz-App-EE4253

## How to run the application:

### 1. Clone the repository:

Install git on [https://git-scm.com/downloads](https://git-scm.com/downloads) and clone the repository using the following command:

```
git clone https://github.com/Piceratop/Quiz-App-EE4253.git
```

### 2. Install dependencies:

Install NodeJS on [https://nodejs.org/en/download/prebuilt-installer/current](https://nodejs.org/en/download/prebuilt-installer/current). In the 'frontend' directory, run the following command to install the required dependencies:

```
npm install
```

Install Python on [https://www.python.org/downloads/](https://www.python.org/downloads/). In the 'backend' directory, run the following command to install the required dependencies:

```
pip install -r requirements.txt
```

### 3. Run the server:

First, create a MySQL database with the following command:

```
mysql -u root -p
CREATE DATABASE quiz_app;
```

Then run the command in 'database.sql' in the 'backend' directory to create tables in the database. Read the 'database.sql' file for more details.

In the 'backend' directory, create a .env file and add the following lines:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<password>
DB_NAME=quiz_app
DB_PORT=<your database port, default is 3306>
```

Then run the following command to start the backend server:

```
python main.py
```

### 4. Run the application:

In the 'frontend' directory, run the following command to start the frontend application:

```
npm run dev
```
