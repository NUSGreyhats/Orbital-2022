import os
import sqlite3
from flask import Flask, jsonify, request, session
from util import initial_users, initial_notes
from dataclasses import dataclass
import subprocess


def create_app():
    app = Flask(__name__)
    app.secret_key = os.urandom(24)
    app.users_db_path = USERS_DB_PATH
    app.notes_db_path = NOTES_DB_PATH

    @app.route('/')
    def index():
        """The index page for the website"""
        return jsonify({'message': 'Welcome to the Notebook API'})

    # Reflected XSS Methods

    @app.route('/notes', methods=['POST', 'GET'])
    def notes():
        """Page to showcase Reflected XSS"""
        if request.method == 'GET':
            query = '_'  # load everything
        elif request.method == 'POST':
            if request.json is None:
                return jsonify({'error': 'Invalid JSON'}), 400
            # Get form data
            query = request.json.get('query', None)
            if query is None:
                return jsonify({"error": "Missing query"}), 400

        # Fetch the data from the database
        with sqlite3.connect(app.notes_db_path) as db:
            cur = db.cursor()
            # Search for the notes
            # Use prepared statements here to prevent SQLi
            notes = cur.execute(SEARCH_NOTES_QUERY, (query,))
            results = list(map(lambda x: (x[0], x[1]), notes))

        return jsonify(results)

    # CSRF Methods

    @app.route('/changepassword', methods=['POST'])
    def changepassword():
        """Page to showcase CSRF"""
        if 'user' not in session:  # not logged in!
            return jsonify({'error': 'You are not logged in!'})

        if request.json is None:
            return jsonify({'error': 'Invalid JSON'})

        if 'new_password' in request.json:  # we changing password bois
            password_new = request.json['new_password']
            with sqlite3.connect(app.users_db_path) as db:
                cursor = db.cursor()
                cursor.execute(
                    "UPDATE users SET password=? WHERE username=?", (password_new, session['user']))
                return jsonify({'message': 'Password changed successfully!'})

        return jsonify({'error': 'Please set a new password to change'})

    # Create a note

    @app.route('/note/create', methods=['POST'])
    def create_note():
        if 'user' not in session:  # not logged in!
            return jsonify({'error': 'You are not logged in!'})

        if request.json is None:
            return jsonify({'error': 'Invalid JSON'})

        name = request.json.get('name', None)
        content = request.json.get('content', None)
        private = 'private' in request.json
        user = session['user']

        if None in (name, content, user):
            return jsonify({'error': 'Missing fields'})

        with sqlite3.connect(app.notes_db_path) as db:
            cur = db.cursor()
            cur.execute(INSERT_NOTE_QUERY, (name, content, user, private))
            id = cur.lastrowid

        return jsonify({'id': id, 'message': "Note created successfully!"})

    # View a note - Stored XSS

    @app.route('/note/<int:id>')
    def view_note(id):
        """Page to showcase Stored XSS"""
        with sqlite3.connect(app.notes_db_path) as db:
            cur = db.cursor()
            # Search for the note
            notes = list(map(result_to_note, cur.execute(
                "SELECT * FROM notes WHERE id=?", (id,))))
            # Check if such a note was found
            if len(notes) == 0:
                return jsonify({'error': 'Note does not exist'})

            # There should be only one result of the query, since id is unique
            note = notes[0]

        return jsonify({'id': note.id, 'name': note.name, 'content': note.content, 'user': note.user, 'private': note.private})

    @app.route('/report', methods=['POST'])
    def report_bug():
        """Page to showcase Command Injection"""
        if request.json is None:
            return jsonify({'error': 'Invalid JSON'})
        bug = request.json.get('bug')
        if bug is None:
            return jsonify({'error': 'Missing bug note'})
        output = subprocess.run(
            f"echo {bug} >> bugs.txt && echo 'Bug has been reported'", shell=True, capture_output=True)
        return jsonify({'message': 'Bug reported successfully!', 'output': output.stdout.decode('utf-8')})

    # SQLi Methods

    def parse_args(username: str = None, password: str = None, **_):
        """Parse the arguments from the user"""
        return username, password

    # Login - SQLi

    @app.route('/login', methods=['POST'])
    def login():
        """Page to showcase SQL Injection"""

        # Check if the arguments are valid
        data = request.json
        if data == None:
            return jsonify({"error": "Invalid arguments"})

        username, password = parse_args(**data)
        # Check for empty data
        if None in (username, password):
            return jsonify({"error": "Empty username or password"})

        # Check if the entry exists
        with sqlite3.connect(app.users_db_path) as db:
            cursor = db.cursor()
            query = LOGIN_QUERY.format(username, password)
            try:
                cursor.execute(query)
                result = cursor.fetchall()
            except sqlite3.OperationalError as e:
                return jsonify({'error': str(e)})

        # If there are no users found
        if len(result) == 0:
            return jsonify({"error": "Invalid username or password"})

        # Set a cookie
        session['user'] = username
        return jsonify({'message': 'Logged in successfully!', 'username': result[0][0]})

    @app.route("/logout", methods=["POST"])
    def logout():
        if 'user' not in session:  # not logged in!
            return jsonify({'error': 'You are not logged in!'})

        session.pop('user', None)
        return jsonify({'message': 'Logged out successfully!'})
    return app


# Constants
USERS_DB_PATH = os.path.join('data', 'users.db')
INSERT_USERS_QUERY = 'INSERT INTO users VALUES (?, ?)'
BLANK_ERROR_MSG = 'Please do not leave any fields blank!'
CREATE_USERS_QUERY = 'CREATE TABLE users (username TEXT PRIMARY KEY, password TEXT)'
LOGIN_QUERY = ''' SELECT * FROM users WHERE username = '{}' AND password = '{}' '''

NOTES_DB_PATH = os.path.join('data', 'notes.db')
CREATE_NOTE_QUERY = 'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, content TEXT, user TEXT, private TINYINT)'
INSERT_NOTE_QUERY = 'INSERT INTO notes(name, content, user, private) VALUES (?, ?, ?, ?)'
SEARCH_NOTES_QUERY = 'SELECT id, name FROM notes p WHERE p.private <> 1 and p.name LIKE \'%\' || ? || \'%\''

CHECK_TABLE_EXIST = ''' SELECT count(name) FROM sqlite_master WHERE type='table' AND name='{}' '''


@dataclass
class Note:
    id: int
    name: str
    content: str
    user: str
    private: bool


def result_to_note(tup):
    return Note(tup[0], tup[1], tup[2], tup[3], tup[4] == 1)

# Database methods

def destroy_db(app) -> None:
    with sqlite3.connect(app.users_db_path) as db:
        cursor = db.cursor()
        cursor.execute('DROP TABLE IF EXISTS users')

    with sqlite3.connect(app.notes_db_path) as db:
        cursor = db.cursor()
        cursor.execute('DROP TABLE IF EXISTS notes')

def create_db(app) -> None:
    if not os.path.exists('data'):
        os.makedirs('data')

    """Create the database if it does not exist"""
    # Check if database exists
    with sqlite3.connect(app.users_db_path) as db:
        cur = db.cursor()

        cur.execute(CHECK_TABLE_EXIST.format('users'))
        # if the count is 1, then table exists
        if cur.fetchone()[0] != 1:

            # Create the table
            cur.execute(CREATE_USERS_QUERY)
            # Add initial list of users, e.g. admin, user1
            for (username, password) in initial_users:
                cur.execute(INSERT_USERS_QUERY, (username, password))

    with sqlite3.connect(app.notes_db_path) as db:
        cur = db.cursor()

        cur.execute(CHECK_TABLE_EXIST.format('notes'))
        # if the count is 1, then table exists
        if cur.fetchone()[0] != 1:

            # Create the table
            cur.execute(CREATE_NOTE_QUERY)
            # Add initial list notes
            for (name, content, user, private) in initial_notes:
                cur.execute(INSERT_NOTE_QUERY, (name, content, user, private))


# Run the website as main
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 3000))
    app = create_app()
    create_db(app)
    app.run(host='0.0.0.0', port=port)
