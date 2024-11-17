CREATE TABLE IF NOT EXISTS user (
        user_id INTEGER PRIMARY KEY,
        user_alias TEXT NOT NULL,
        user_full_name TEXT NOT NULL,
        user_company TEXT NOT NULL,
        user_email TEXT NOT NULL,
        next_token TEXT DEFAULT NULL,
        jwttoken TEXT DEFAULT NULL,
        user_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )