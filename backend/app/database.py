import json
from datetime import datetime, timezone
import sqlite3

from pathlib import Path
from contextlib import contextmanager

from app.config import settings, BASE_DIR


# Convert DATABASE_URL into a SQLite file path
def get_database_path():

    prefix = "sqlite:///"

    if not settings.database_url.startswith(prefix):
        raise ValueError("Only SQLite databases are supported")

    path = Path(settings.database_url[len(prefix):])

    # Resolve relative paths from the backend directory
    if not path.is_absolute():
        path = BASE_DIR / path

    return path


# Database file location
DB_PATH = get_database_path()


# Create a database connection
@contextmanager
def get_connection():

    connection = sqlite3.connect(DB_PATH, timeout=10)

    connection.row_factory = sqlite3.Row

    try:
        yield connection

        connection.commit()

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


# Initialize database and create tables
def init_db():

    # Create database directory if it does not exist
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    with get_connection() as connection:

        connection.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                metadata TEXT,
                created_at TEXT NOT NULL
            )
        """)

        connection.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY,
                system_prompt TEXT NOT NULL
            )
        """)

        connection.execute("""
            CREATE INDEX IF NOT EXISTS idx_messages_session
            ON messages(session_id, id)
        """)


# Check whether the database is reachable
def check_db():

    with get_connection() as connection:

        result = connection.execute("SELECT 1").fetchone()

        return result[0] == 1


def get_messages(session_id: str):

    with get_connection() as connection:

        rows = connection.execute(
            """
            SELECT role, content, metadata, created_at
            FROM messages
            WHERE session_id = ?
            ORDER BY id ASC
            """,
            (session_id,)
        ).fetchall()

        return [
            {
                "role": row["role"],
                "content": row["content"],
                "metadata": (
                    json.loads(row["metadata"])
                    if row["metadata"] else None
                ),
                "created_at": row["created_at"]
            }
            for row in rows
        ]


def get_system_prompt(session_id: str):

    with get_connection() as connection:

        row = connection.execute(
            """
            SELECT system_prompt
            FROM sessions
            WHERE session_id = ?
            """,
            (session_id,)
        ).fetchone()

        if row:
            return row["system_prompt"]

        return settings.default_system_prompt


def save_conversation(
    session_id: str,
    user_message: str,
    assistant_message: str,
    metadata: dict,
    system_prompt: str
):

    created_at = datetime.now(timezone.utc).isoformat()

    with get_connection() as connection:

        # Create or update the session
        connection.execute(
            """
            INSERT INTO sessions (session_id, system_prompt)
            VALUES (?, ?)
            ON CONFLICT(session_id)
            DO UPDATE SET system_prompt = excluded.system_prompt
            """,
            (session_id, system_prompt)
        )

        # Save user message
        connection.execute(
            """
            INSERT INTO messages
            (session_id, role, content, metadata, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                session_id,
                "user",
                user_message,
                None,
                created_at
            )
        )

        # Save assistant response
        connection.execute(
            """
            INSERT INTO messages
            (session_id, role, content, metadata, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                session_id,
                "assistant",
                assistant_message,
                json.dumps(metadata),
                created_at
            )
        )


def clear_session(session_id: str):

    with get_connection() as connection:

        connection.execute(
            "DELETE FROM messages WHERE session_id = ?",
            (session_id,)
        )

        connection.execute(
            "DELETE FROM sessions WHERE session_id = ?",
            (session_id,)
        )