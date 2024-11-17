CREATE TABLE IF NOT EXISTS process (
        process_id INTEGER PRIMARY KEY,
        user_id TEXT NOT NULL,
        project_id INTEGER NOT NULL,
        process_status INTEGER,
        process_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE
      )