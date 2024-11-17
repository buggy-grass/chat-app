CREATE TABLE IF NOT EXISTS project (
        project_id INTEGER PRIMARY KEY,
        user_alias TEXT NOT NULL,
        project_task_id TEXT NOT NULL UNIQUE,
        project_name TEXT NOT NULL UNIQUE,
        project_ncfg_file TEXT NOT NULL,
        project_path TEXT NOT NULL,
        project_raster_path TEXT NOT NULL,
        project_raster_properties TEXT NOT NULL,
        project_task_level INTEGER NOT NULL,
        process_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )