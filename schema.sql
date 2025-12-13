-- SQL schema for the GyP Consultoría web application

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User table for administrators
CREATE TABLE app_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Surveys table
CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT false
);

-- Possible question types: 'text', 'single_choice', 'multiple_choice'
CREATE TYPE question_type AS ENUM ('text', 'single_choice', 'multiple_choice');

-- Questions table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    type question_type NOT NULL,
    display_order INT NOT NULL
);

-- Options for single_choice or multiple_choice questions
CREATE TABLE question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    text VARCHAR(255) NOT NULL,
    display_order INT NOT NULL
);

-- Submissions table to record each time a survey is completed
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    participant_name VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Answers table for each specific answer in a submission
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    -- For 'text' type questions
    text_value TEXT,
    -- For 'single_choice' or 'multiple_choice', stores the selected option id.
    -- For multiple_choice, multiple rows will be created for the same question_id.
    selected_option_id UUID REFERENCES question_options(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX ON surveys (created_by);
CREATE INDEX ON questions (survey_id);
CREATE INDEX ON question_options (question_id);
CREATE INDEX ON submissions (survey_id);
CREATE INDEX ON answers (submission_id);
CREATE INDEX ON answers (question_id);
CREATE INDEX ON answers (selected_option_id);

-- Insert a sample admin user for initial login.
-- IMPORTANT: The password is 'admin123'. The hash is a bcrypt hash for this password.
-- You should change this in a real production environment.
INSERT INTO app_users (name, email, password_hash, role) VALUES
('Admin', 'admin@gypconsultoria.com', '$2b$10$D9Zt4B4Z.g2Z7d.Pf7v.r.CrGk8r5V5Y.E3g3Q.i8R3g2s5Y.O1iO', 'admin');
