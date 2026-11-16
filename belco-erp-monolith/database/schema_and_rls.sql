-- ============================================================================
-- Belco ERP - PostgreSQL / Supabase Schema & RLS Policies (Monolith)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    governorate VARCHAR(100),
    monthly_contract_value NUMERIC(12, 2) DEFAULT 0.00,
    petty_cash_non_receipt_limit_pct NUMERIC(5, 2) DEFAULT 10.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM (
    'it_admin', 'executive_board', 'general_ops_manager',
    'site_manager', 'hr_department', 'insurance_contracts',
    'finance_accounts', 'procurement'
);

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    role user_role NOT NULL,
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(150) NOT NULL,
    department VARCHAR(100),
    phone VARCHAR(30),
    national_id VARCHAR(20) UNIQUE NOT NULL,
    salary_type VARCHAR(50) DEFAULT 'monthly_days',
    base_salary NUMERIC(10, 2) DEFAULT 0.00,
    shift_rate NUMERIC(10, 2) DEFAULT 0.00,
    social_insurance_number VARCHAR(50),
    insurance_status VARCHAR(50) DEFAULT 'pending',
    contract_end_date DATE,
    docs_complete BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    qr_code VARCHAR(150) UNIQUE NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- facility, medical_equipment
    sub_category VARCHAR(100),
    location_in_hospital VARCHAR(255),
    status VARCHAR(50) DEFAULT 'operational'
);

CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity_available INT NOT NULL DEFAULT 0,
    unit_cost NUMERIC(10, 2) DEFAULT 0.00
);

CREATE TABLE fault_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    department_location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(30) DEFAULT 'normal',
    status VARCHAR(50) DEFAULT 'open',
    reported_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE purchase_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    item_description VARCHAR(255) NOT NULL,
    quantity_requested INT NOT NULL,
    estimated_cost NUMERIC(12, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'pending_procurement',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE petty_cash_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    expense_date DATE DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    has_receipt BOOLEAN NOT NULL DEFAULT TRUE,
    non_receipt_justification TEXT,
    status VARCHAR(50) DEFAULT 'مسجل بالموقع'
);

CREATE TABLE external_support_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    system_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    visit_date DATE NOT NULL,
    attended BOOLEAN DEFAULT TRUE,
    report_attached BOOLEAN DEFAULT TRUE
);
