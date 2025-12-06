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
  is_minimum_applied boolean default false,
  status text default 'pending' not null
);

-- Portfolio Items Table
create table if not exists public.portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  category text not null, -- 'lane', 'epoxy', 'paint'
  location text not null,
  date text not null, -- '2024.11' format or date type
  area numeric not null,
  image_url text not null,
  description text
);

-- Storage Bucket for Portfolio Images
insert into storage.buckets (id, name, public) 
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Enable Row Level Security (RLS)
alter table public.quotes enable row level security;
alter table public.services enable row level security;
alter table public.materials enable row level security;
alter table public.portfolio_items enable row level security;

-- Policies

-- 1. Services & Materials (Public Read)
create policy "Allow public read services" on public.services for select to anon using (true);
create policy "Allow public read materials" on public.materials for select to anon using (true);

-- 2. Quotes (Public Insert, Admin Read/Update/Delete)
create policy "Allow public insert quotes" on public.quotes for insert to anon with check (true);
create policy "Allow authenticated read quotes" on public.quotes for select to authenticated using (true);
create policy "Allow authenticated update quotes" on public.quotes for update to authenticated using (true);
create policy "Allow authenticated delete quotes" on public.quotes for delete to authenticated using (true);

-- 3. Portfolio Items (Public Read, Admin All)
create policy "Allow public read portfolio" on public.portfolio_items for select to anon using (true);
-- create policy "Allow admin all portfolio" on public.portfolio_items for all to authenticated using (true);

-- 4. Storage Policies (Public Read, Admin Upload)
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'portfolio' );

create policy "Authenticated Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'portfolio' );

create policy "Authenticated Update"
on storage.objects for update
to authenticated
using ( bucket_id = 'portfolio' );

create policy "Authenticated Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'portfolio' );

-- Storage Bucket for Quote Photos
insert into storage.buckets (id, name, public)
values ('quotes', 'quotes', true)
on conflict (id) do nothing;

-- Storage Policies for Quotes Bucket
create policy "Public Access quotes"
on storage.objects for select
to public
using ( bucket_id = 'quotes' );

create policy "Public Upload quotes"
on storage.objects for insert
to anon
with check ( bucket_id = 'quotes' );

create policy "Authenticated Delete quotes"
on storage.objects for delete
to authenticated
using ( bucket_id = 'quotes' );