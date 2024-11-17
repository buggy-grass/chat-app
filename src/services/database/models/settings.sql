CREATE TABLE IF NOT EXISTS settings (
        setting_id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        data TEXT NOT NULL,
        settings_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        settings_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
    )