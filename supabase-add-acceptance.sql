-- Add acceptance tracking columns to proposals table
-- Run this in your Supabase SQL Editor

-- Add is_accepted column (default false)
alter table proposals add column if not exists is_accepted boolean default false;

-- Add accepted_at timestamp column
alter table proposals add column if not exists accepted_at timestamp with time zone;

-- Optional: Create an index for faster queries on accepted proposals
create index if not exists proposals_is_accepted_idx on proposals(is_accepted);
