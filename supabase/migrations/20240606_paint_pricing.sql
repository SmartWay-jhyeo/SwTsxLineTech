-- Add Paint Pricing Rules
insert into pricing_rules (service_type, category, key, name, value, unit, description) values
-- Paint Options
('paint', 'option', 'waterproof', '방수 페인트 추가', 10000, 'm2', '방수 페인트 시공 추가 비용'),
('paint', 'option', 'fireproof', '내화 페인트 추가', 15000, 'm2', '내화 페인트 시공 추가 비용'),
('paint', 'option', 'putty', '퍼티 작업 (빠데)', 5000, 'm2', '벽면 평탄화 퍼티 작업 비용'),

-- Paint Base Prices (Example)
('paint', 'area_base', 'interior', '내부 도장 기본단가', 25000, 'm2', '실내 벽면/천장 도장 기본 단가'),
('paint', 'area_base', 'exterior', '외부 도장 기본단가', 35000, 'm2', '건물 외벽 도장 기본 단가');
