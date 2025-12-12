-- 20251212_add_material_base_pricing.sql
-- 마감재별 기본 단가 규칙 추가

INSERT INTO pricing_rules (service_type, category, key, name, value, unit, description)
VALUES
  ('epoxy', 'material_base', 'transparent_epoxy', '투명 에폭시 기본단가', 45000, '원/m²', '투명 에폭시 시공의 기본 m²당 단가'),
  ('epoxy', 'material_base', 'solid_epoxy', '칼라 에폭시 기본단가', 45000, '원/m²', '칼라 에폭시 시공의 기본 m²당 단가'),
  ('epoxy', 'material_base', 'bean_gravel', '콩자갈 바닥 기본단가', 55000, '원/m²', '콩자갈 바닥 시공의 기본 m²당 단가'),
  ('epoxy', 'material_base', 'urethane_waterproof', '우레탄 방수 기본단가', 35000, '원/m²', '우레탄 방수 시공의 기본 m²당 단가')
ON CONFLICT (service_type, category, key) DO NOTHING;
