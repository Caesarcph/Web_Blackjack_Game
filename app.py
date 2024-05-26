import flask
from flask_mysqldb import MySQL
from flask import jsonify
from flask import Flask, request, render_template, redirect, url_for
import re
from werkzeug.utils import secure_filename
import os
import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

app = Flask(__name__)

# Configure MySQL
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_PORT'] = int(os.getenv('MYSQL_PORT'))
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')
app.config['MYSQL_CURSORCLASS'] = os.getenv('MYSQL_CURSORCLASS')

mysql = MySQL(app)

def check_user_exists(username, email, phone_number):
    cursor = mysql.connection.cursor()
    query = """
    SELECT COUNT(1) FROM user_profile
    WHERE username = %s OR email = %s OR phone = %s
    """
    cursor.execute(query, (username, email, phone_number))
    result = cursor.fetchone()
    cursor.close()

    if result and result.get('COUNT(1)', 0) != 0:
        return True
    else:
        return False

@app.route('/showdb')
def show_db():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM login_profile")
    data = cursor.fetchall()
    cursor.close()
    return jsonify(data)

@app.route('/testdb')
def test_db():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT 1")
        data = cursor.fetchone()
        cursor.close()
        return "Database connected!"
    except Exception as e:
        return f"Database connection failed: {e}"

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/success')
def success():
    return render_template('success.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    UPLOAD_FOLDER = './data/ids/'
    errors = []
    if request.method == 'POST':
        # get form data
        username = request.form.get('username')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm')
        email = request.form.get('email')
        phone_number = request.form.get('Phone_number')
        date_of_birth = request.form.get('birth') 
        file = request.files['formFile']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
        validated = False
        # check if the form data is valid
        errors = []
        if not username or not password or not email:
            errors.append("Missing required fields")
        if password != confirm_password:
            errors.append("Passwords do not match")
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            errors.append("Invalid email format")
        if not re.match(r"\d{10,15}", phone_number):
            errors.append("Invalid phone number format")
        # birth date less than 18 years old
        if datetime.datetime.strptime(date_of_birth, '%m/%d/%Y') > (datetime.datetime.now() - datetime.timedelta(days=18*365)):
            errors.append("You must be at least 18 years old to register")

        # check if the user already exists
        if check_user_exists(username, email, phone_number):
            errors.append("User already exists")

        if not errors:
            # if no errors, insert the user into the database
            SQL = "INSERT INTO user_profile(username, password, email, phone, birth, idAddress, validated) VALUES(%s, %s, %s, %s, %s, %s, %s)"
            cursor = mysql.connection.cursor()
            cursor.execute(SQL, (username, password, email, phone_number, date_of_birth, file_path, validated))
            # get inserted id and use it to create a new record in the login_profile table
            user_id = cursor.lastrowid
            SQL = "INSERT INTO login_profile(username, password, user_profile_id, validated) VALUES(%s, %s, %s, %s)"
            cursor.execute(SQL, (username, password, user_id, validated))
            mysql.connection.commit()
            cursor.close()
            return redirect(url_for('success'))

        # check errors
        return render_template('register.html', errors=errors)
    return render_template('register.html', errors=errors)

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        cursor = mysql.connection.cursor()
        sql = "SELECT * FROM login_profile WHERE username = %s AND password = %s"
        cursor.execute(sql, (username, password))
        user = cursor.fetchone()
        if user:
            validated = user.get('validated')
            if validated == 0:
                cursor.close()
                return render_template('index.html', error="Please wait for the staff to validate your account")
            else:
                cursor.close()
                return render_template('game.html')
        else:
            cursor.close()
            return render_template('index.html', error="Invalid username or password")
    else:
        return render_template('index.html', error='noError')

if __name__ == '__main__':
    app.run()
