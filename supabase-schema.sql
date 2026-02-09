-- OnlyYes Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Create proposals table
create table if not exists proposals (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  your_name text not null,
  partner_name text not null,
  special_date date,
  love_message text not null,
  favorite_memory text,
  future_dreams text,
  photos text[] default '{}',
  music_url text,
  is_paid boolean default false,
  views_count integer default 0,
  created_at timestamp with time zone default now()
);

-- Create index for faster slug lookups
create index if not exists proposals_slug_idx on proposals(slug);

-- Enable Row Level Security
alter table proposals enable row level security;

-- Policy: Anyone can create proposals
create policy "Anyone can create proposals"
  on proposals for insert
  with check (true);

-- Policy: Public can read paid proposals only
create policy "Public can read paid proposals"
  on proposals for select
  using (is_paid = true);

-- Policy: Allow updating is_paid and views_count (for payment and view tracking)
create policy "Allow proposal updates"
  on proposals for update
  using (true);

-- Function to increment view count
create or replace function increment_views(proposal_slug text)
returns void as $$
begin
  update proposals 
  set views_count = views_count + 1 
  where slug = proposal_slug and is_paid = true;
end;
$$ language plpgsql security definer;
