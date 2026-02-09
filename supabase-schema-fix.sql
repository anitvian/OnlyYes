-- OnlyYes Supabase Schema Fix
-- Run this in your Supabase SQL Editor to fix the RLS policy issue

-- First, drop existing policies if they exist
drop policy if exists "Anyone can create proposals" on proposals;
drop policy if exists "Public can read paid proposals" on proposals;
drop policy if exists "Allow proposal updates" on proposals;

-- Disable RLS temporarily to allow the new policies to be created
alter table proposals disable row level security;

-- Re-enable RLS
alter table proposals enable row level security;

-- Policy: Anyone can create proposals (including anonymous users)
create policy "Anyone can create proposals"
  on proposals for insert
  to anon, authenticated
  with check (true);

-- Policy: Public can read paid proposals only
create policy "Public can read paid proposals"
  on proposals for select
  to anon, authenticated
  using (is_paid = true);

-- Policy: Anyone can read all proposals (for admin - we'll secure this later)
create policy "Admin can read all proposals"
  on proposals for select
  to authenticated
  using (true);

-- Policy: Allow updating proposals (for payment and view tracking)
create policy "Allow proposal updates"
  on proposals for update
  to anon, authenticated
  using (true);
