-- SQL schema for downloadable files

CREATE TABLE downloadable_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES app_users(id) ON DELETE SET NULL
);

CREATE INDEX ON downloadable_files (created_at DESC);
CREATE INDEX ON downloadable_files (created_by);
