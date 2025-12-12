-- 20251212_add_brokerage_columns.sql
-- 견적 테이블에 배정 유형, 중개 메모, 수수료 컬럼 추가

ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS assignment_type text CHECK (assignment_type IN ('direct', 'brokerage', 'pending')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS brokerage_memo text,
ADD COLUMN IF NOT EXISTS commission integer DEFAULT 0;

COMMENT ON COLUMN quotes.assignment_type IS '배정 유형 (direct: 직영, brokerage: 중개, pending: 미정)';
COMMENT ON COLUMN quotes.brokerage_memo IS '중개 시 배정된 업체명 또는 메모';
COMMENT ON COLUMN quotes.commission IS '중개 수수료 수익';
