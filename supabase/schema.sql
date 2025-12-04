-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Services Table
create table if not exists public.services (
  id text primary key, -- 'lane', 'epoxy', 'paint'
  title text not null,
  background_image text not null,
  portfolio_link text not null,
  quote_link text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Materials/Options Table (for dynamic pricing)
create table if not exists public.materials (
  id uuid primary key default uuid_generate_v4(),
  service_id text references public.services(id),
  name text not null,
  price_per_unit numeric not null, 
  unit text not null, -- 'm2', 'ea', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Quotes Table
create table if not exists public.quotes (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  service_type text references public.services(id),
  area numeric not null,
  surface_condition text not null, -- 'good', 'normal', 'bad'
  options jsonb, -- Store selected options as JSON or array of IDs
  contact_name text not null,
  contact_phone text not null,
  contact_email text,
  notes text,
  
  -- Calculated results snapshots
  base_cost numeric not null,
  option_cost numeric not null,
  surcharge numeric not null,
  total_cost numeric not null,
  is_minimum_applied boolean default false
);

-- Enable Row Level Security (RLS)
alter table public.quotes enable row level security;
alter table public.services enable row level security;
alter table public.materials enable row level security;

-- Policies
-- Public can view services and materials
create policy "Allow public read services" on public.services for select to anon using (true);
create policy "Allow public read materials" on public.materials for select to anon using (true);

-- Public can insert quotes
create policy "Allow public insert quotes" on public.quotes for insert to anon with check (true);

-- Only authenticated (admin) can view quotes (Assuming admin auth will be set up later)
-- create policy "Allow admin read quotes" on public.quotes for select to authenticated using (true);
