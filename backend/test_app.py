import pytest
from app import create_app

@pytest.fixture()
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
    })

    app.user_db_path = "test_users.db"
    app.notes_db_path = "test_notes.db"

    yield app


@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def runner(app):
    return app.test_cli_runner()

def test_home_page(client):
    """Test if the homepage returns the correct response"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json == {"message": "Welcome to the Notebook API"}