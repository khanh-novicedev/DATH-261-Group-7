-- Class2Life — permanent demo dataset (V4)
-- One published "MC Fundamentals" course with four lessons, so the live-classroom
-- prototype has a real lesson to attach a LiveSession to. The instructor FK is
-- resolved by email (never a hard-coded UUID), because V3 generates that id with
-- gen_random_uuid() on each fresh database.
--
-- Enum literals must match the native Postgres types created in V1:
--   course_status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN'
--   lesson_type:   'VIDEO' | 'TEXT' | 'LIVE_PRACTICE'

INSERT INTO courses (id, instructor_id, title, description, category, status) VALUES
    ('c0000000-0000-0000-0000-000000000001',
     (SELECT id FROM app_users WHERE email = 'instructor@class2life.com'),
     'MC Fundamentals: Host with Confidence',
     'Core event-hosting skills: presence, voice, flow and live practice.',
     'Soft Skills',
     'PUBLISHED');

INSERT INTO lessons (id, course_id, sequence_number, title, type, content_url) VALUES
    ('c0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000001',
     1, 'The MC Mindset — Presence, Energy & Reading the Room', 'TEXT', NULL),
    ('c0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000001',
     2, 'Voice, Tone & Body Language on Stage', 'VIDEO', 'https://example.com/mc-voice-body.mp4'),
    ('c0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000001',
     3, 'Scripting the Flow — Open, Transition, Close', 'TEXT', NULL),
    ('c0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000001',
     4, 'Live Practice — Run a 5-Minute Event Segment', 'LIVE_PRACTICE', NULL);
