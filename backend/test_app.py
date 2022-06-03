import json
import os
import pytest
from app import create_app, create_db, destroy_db


@pytest.fixture(autouse=True)
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
    })

    app.users_db_path = "'file:cachedb?mode=memory&cache=shared'"
    app.notes_db_path = "'file:cachedb1?mode=memory&cache=shared"

    create_db(app)
    yield app
    destroy_db(app)

    if os.path.exists(app.users_db_path):
        os.remove(app.users_db_path)
    if os.path.exists(app.notes_db_path):
        os.remove(app.notes_db_path)


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()


def login(client, username, password):
    """Helper function to login"""
    return client.post('/login', data=json.dumps({
        'username': username,
        'password': password,
    }), headers={
        'Content-Type': 'application/json',
    })


def test_home_page_get_request_get(client):
    """Test if the homepage returns the correct response"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json == {"message": "Welcome to the Notebook API"}


def test_homepage_post_request_fail(client):
    """Test if the homepage returns the correct response"""
    response = client.post("/")
    assert response.status_code == 405


def test_get_notes_page_success(client):
    """Test if notes are retrieved correctly"""
    response = client.get("/notes")
    assert response.status_code == 200
    assert response.json == [
        {"id": 1, "title": 'Administration Note'}, {"id": 3, "title": 'Wow'}]


def test_post_note_page_success(client):
    """Test if notes page can be posted to"""
    response = client.post("/notes", data=json.dumps({
        "query": "Wow",
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == [{"id": 3, "title": 'Wow'}]


def test_post_notes_page_invalid_fail(client):
    """Test if the notes page fail"""
    response = client.post("/notes")
    assert response.status_code == 400
    assert response.json in ({'error': 'Invalid JSON'}, None)


def test_post_notes_page_missing_query_fail(client):
    response = client.post("/notes", data=json.dumps({
        'hi': 'bye'
    }), headers={
        'Content-Type': 'application/json',
    })
    assert response.status_code == 400
    assert response.json == {'error': 'Missing query'}


def test_change_password_not_logged_in_fail(client):
    """Test if the user can change password if he is not logged in"""
    response = client.post('/changepassword', data=json.dumps({
        'new_password': 'new_password',
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'error': 'You are not logged in!',
    }


def test_change_password_missing_new_password(client):
    """Test if the user can change to empty new password"""
    login(client, 'user1', 'justaplebuserlmao')

    response = client.post('/changepassword', data=json.dumps({
        'hi': 'bye'
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'error': 'Please set a new password to change',
    }


def test_change_password_success(client):
    resp = login(client, 'user1', 'justaplebuserlmao')
    assert resp.status_code == 200
    assert resp.json == {
        'message': 'Logged in successfully!',
        'username': 'user1'
    }

    response = client.post('/changepassword', data=json.dumps({
        'new_password': 'password2',
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'message': 'Password changed successfully!',
    }

    resp = login(client, 'user1', 'password2')
    assert resp.status_code == 200
    assert resp.json == {
        'message': 'Logged in successfully!',
        'username': 'user1'
    }

    login(client, 'user1', 'justaplebuserlmao')

    assert response.status_code == 200
    assert response.json == {
        'message': 'Password changed successfully!',
    }


def test_create_note_invalid_json(client):
    """Test if note can be created using invalid json"""
    login(client, 'admin', 'password')

    response = client.post('/note/create', data=json.dumps({
        'name': "Hello!",
        'content': "World!",
        'private': False,
        'hi': 'bye'
    }), headers={
        'Content-Type': 'multipart/form-data',
    })

    assert response.status_code in (200, 400)
    assert response.json in ({
        'error': 'Invalid JSON',
    }, None)


def test_create_note_missing_fields_fail(client):
    """Test if we can create notes with missing fields"""
    login(client, 'admin', 'password')

    response = client.post('/note/create', data=json.dumps({
        'name': "Hello!",
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'error': 'Missing fields',
    }


def test_create_note_no_login_fail(client):
    """Test create note with no login"""
    response = client.post('/note/create', data=json.dumps({
        'name': "Hello!",
        'content': "World!",
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'error': 'You are not logged in!',
    }


def test_create_note_success(client):
    """Test if creating the note is successful"""
    login(client, 'admin', 'password')
    response = client.post('/note/create', data=json.dumps({
        'name': "Hello!",
        'content': "World!",
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'message': 'Note created successfully!',
        'id': 4,
    }

    # Check if it can be retrieved
    response = client.get('/note/4')
    assert response.status_code == 200
    assert response.json == {
        'id': 4,
        'title': 'Hello!',
        'body': 'World!',
        'private': False,
        'user': 'admin',
    }


def test_view_note_id_out_of_range_fail(client):
    response = client.get('/note/0')
    assert response.status_code == 200
    assert response.json == {
        'error': 'Note does not exist',
    }


def test_view_note_valid_id_success(client):
    response = client.get('/note/1')
    assert response.status_code == 200
    assert response.json == {
        'id': 1,
        'title': 'Administration Note',
        'body': 'Please do not try to hack us, we are proven to be super secure!',
        'private': False,
        'user': 'manager',
    }


def test_report_bug_invalid_json_fail(client):
    response = client.post('/report', data=json.dumps({
        'bug': 'This is a bug',
    }), headers={
        'Content-Type': 'multi-part/form-data',
    })

    assert response.status_code in (200, 400)
    assert response.json in ({
        'error': "Invalid JSON",
    }, None)


def test_report_bug_invalid_bug_field_empty_fail(client):
    response = client.post('/report', data=json.dumps({
        'hi': 'bye'
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'error': "Missing bug note",
    }


def test_report_bug_success(client):
    response = client.post('/report', data=json.dumps({
        'bug': 'This is a bug',
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert os.path.exists('bugs.txt')
    with open('bugs.txt', 'r') as f:
        data = f.read()
    os.remove('bugs.txt')

    assert data in ('This is a bug  \n', 'This is a bug\n')
    assert response.json.get("message", "") == "Bug reported successfully!"
    assert response.json.get("output", "") in (
        "'Bug has been reported'\r\n", "Bug has been reported\n")


@pytest.mark.skipif(os.name == 'nt', reason="Command injection doesnt work on windows")
def test_report_bug_command_injection_success(client):
    """Test if we can report a bug with command injection"""
    response = client.post('/report', data=json.dumps({
        'bug': ';ls;',
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json.get("message", None) == "Bug reported successfully!"
    assert len(response.json.get('output', '')) > len(
        "Bug has been reported\n")

    assert os.path.exists('bugs.txt')
    with open('bugs.txt', 'r') as f:
        data = f.read()

    os.remove('bugs.txt')
    assert data in ('This is a bug\n', '')


def test_login_success(client):
    """Test if the user is able to login successfully"""
    response = client.post('/login', data=json.dumps({
        'username': 'admin',
        'password': 'password',
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'message': 'Logged in successfully!',
        'username': 'admin',
    }
    assert response.headers.get('Set-Cookie') != None, "Session cookie not set"


def test_login_password_wrong(client):
    """Test if the user is able to fail the login"""
    response = client.post('/login', data=json.dumps({
        'username': 'admin',
        'password': 'wrong',
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'error': 'Invalid username or password',
    }


def test_login_invalid_data_fail(client):
    """Test if user can login with invalid data"""
    response = client.post('/login', data=json.dumps({
        'username': 'admin',
        'password': 'password',
    }), headers={
        'Content-Type': 'multipart/form-data',
    })

    assert response.status_code in (200, 400)
    assert response.json in ({
        'error': 'Invalid arguments',
    }, None)


def test_login_empty_field(client):
    """Test if the user can login with an empty field"""
    response = client.post('/login', data=json.dumps({
        'username': 'admin',
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'error': 'Empty username or password',
    }


def test_login_sqli_success(client):
    """Test if the user can login with sql injection"""
    response = client.post('/login', data=json.dumps({
        'username': 'admin\'; --',
        'password': 'anything',
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'message': 'Logged in successfully!',
        'username': 'admin',
    }
    assert response.headers.get('Set-Cookie') != None, "Session cookie not set"


def test_logout_without_login_fail(client):
    """Test logout without login fail"""
    response = client.post('/logout')

    assert response.status_code == 200
    assert response.json == {
        'error': 'You are not logged in!',
    }


def test_logout_success(client):
    login(client, 'admin', 'password')
    response = client.post('/logout')
    assert response.status_code == 200
    assert response.json == {
        'message': 'Logged out successfully!',
    }


def test_register_invalid_data_fail(client):
    """Test if user can login with invalid data"""
    response = client.post('/register', data=json.dumps({
        'username': 'admin',
        'password': 'password',
    }), headers={
        'Content-Type': 'multipart/form-data',
    })

    assert response.status_code in (200, 400)
    assert response.json in ({
        'error': 'Invalid JSON',
    }, None)


def test_register_already_exists_fail(client):
    """Test if user cannot register conflicting username"""
    response = client.post('/register', data=json.dumps({
        'username': 'admin',
        'password': 'password',
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'error': 'User already exists'
    }


def test_register_empty_username_fail(client):
    """Test if user cannot register with empty username"""
    response = client.post('/register', data=json.dumps({
        'password': 'Missing username or password',
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'error': 'Missing username or password'
    }


def test_register_empty_password_fail(client):
    """Test if user cannot register with empty password"""
    response = client.post('/register', data=json.dumps({
        'username': 'Missing username or password',
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'error': 'Missing username or password'
    }


def test_register_success(client):
    """Test if user can register successfully"""
    response = client.post('/register', data=json.dumps({
        'username': 'admin2',
        'password': 'password',
    }), headers={
        'Content-Type': 'application/json',
    })

    assert response.status_code == 200
    assert response.json == {
        'message': 'User created successfully!',
        'username': 'admin2',
    }

    resp = login(client, 'admin2', 'password')
    assert resp.status_code == 200
    assert resp.json == {
        'message': 'Logged in successfully!',
        'username': 'admin2',
    }
