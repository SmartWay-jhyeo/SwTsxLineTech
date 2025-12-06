-- 1. Create pricing_rules table
create table if not exists pricing_rules (
  id uuid default gen_random_uuid() primary key,
  service_type text not null, -- 'epoxy', 'lane', 'common'
  category text not null, -- 'material', 'option', 'tier', 'area_base'
  key text not null, -- machine readable key (e.g., 'transparent_epoxy', 'tier_20')
  name text not null, -- human readable name
  value numeric not null, -- price
  unit text, -- 'm2', 'pyeong', 'set', 'fixed'
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Insert initial data (Epoxy)
insert into pricing_rules (service_type, category, key, name, value, unit, description) values
-- Area Base Prices (Epoxy)
('epoxy', 'area_base', 'area_under_100', '100㎡ 미만 기본단가', 65000, 'm2', '100㎡ 미만 시 적용되는 ㎡당 단가'),
('epoxy', 'area_base', 'area_101_299', '101~299㎡ 기본단가', 45000, 'm2', '101㎡ 이상 300㎡ 미만 시 적용되는 ㎡당 단가'),
('epoxy', 'area_base', 'area_300_499', '300~499㎡ 기본단가', 40000, 'm2', '300㎡ 이상 500㎡ 미만 시 적용되는 ㎡당 단가'),
('epoxy', 'area_base', 'area_over_500', '500㎡ 이상 기본단가', 35000, 'm2', '500㎡ 이상 시 적용되는 ㎡당 단가'),

-- Options (Epoxy)
('epoxy', 'option', 'quality_poor', '바닥 상태 불량 추가금', 15000, 'm2', '바닥 상태 불량 시 추가되는 ㎡당 비용'),
('epoxy', 'option', 'crack_severe', '심각한 균열 보수', 30000, 'm2', '심각한 균열 보수 시 추가되는 ㎡당 비용'),
('epoxy', 'option', 'anti_slip', '미끄럼 방지 처리', 7500, 'm2', '미끄럼 방지(규사/엠보) 처리 비용'),
('epoxy', 'option', 'surface_protection', '표면 보호막 코팅', 7500, 'm2', '표면 보호막(상도) 코팅 비용'),
('epoxy', 'option', 'self_leveling', '셀프레벨링', 30000, 'm2', '셀프레벨링(자동수평몰탈) 시공 비용'),
('epoxy', 'option', 'color_mixing', '조색비', 50000, 'fixed', '기본 색상 외 조색 비용 (건당)'),
('epoxy', 'option', 'min_fee', '최소 출장비', 300000, 'fixed', '최소 시공/출장 비용');

-- 3. Insert initial data (Lane/Parking)
insert into pricing_rules (service_type, category, key, name, value, unit, description) values
-- Tiers (Lane)
('lane', 'tier', 'tier_20', '20대 이하 구간 정액', 800000, 'fixed', '주차면 20대 이하 구간의 정액 시공비'),
('lane', 'tier', 'tier_100', '100대 이하 구간 정액', 1250000, 'fixed', '주차면 21~100대 구간의 정액 시공비'),
('lane', 'tier', 'tier_200', '200대 이하 구간 정액', 2400000, 'fixed', '주차면 101~200대 구간의 정액 시공비'),

-- Options (Lane)
('lane', 'option', 'special_spot', '특수 주차면(장애인/전기차)', 250000, 'spot', '장애인 또는 전기차 주차면 도색 비용 (면당)');


-- 4. Enable RLS on pricing_rules
alter table pricing_rules enable row level security;

-- Allow public read access to pricing_rules
create policy "Public can view pricing rules"
on pricing_rules for select
to public
using (true);

-- Allow authenticated (admin) users to update pricing_rules
-- Note: Assuming you have an auth system. If 'admin' role exists, use it. 
-- For now, allowing authenticated users to update (adjust as needed for your auth setup).
create policy "Admins can update pricing rules"
on pricing_rules for update
to authenticated
using (true)
with check (true);

create policy "Admins can insert pricing rules"
on pricing_rules for insert
to authenticated
with check (true);


-- 5. Storage Bucket & Policies for 'quotes'
-- Create bucket if not exists (Note: SQL for creating bucket is specific to Supabase extension, usually done via UI or API, but we can try inserting into storage.buckets)
insert into storage.buckets (id, name, public)
values ('quotes', 'quotes', true)
on conflict (id) do nothing;

-- Policy: Public can view images
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'quotes' );

-- Policy: Public can upload images (Anonymous uploads for quotes)
create policy "Public Upload"
on storage.objects for insert
to public
with check ( bucket_id = 'quotes' );

-- Policy: Public can update/delete (Optional: usually we don't want anon users deleting files, but needed if they remove from preview? No, preview is local usually. 
-- Let's restrict delete to owners or admins if possible, or just leave it for now. 
-- For quote form, usually just Insert is enough. But sometimes multipart upload might need update? Assuming simple upload.)
