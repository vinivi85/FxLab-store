-- FXLabs Store — initial schema
-- Categories, Products, Orders, Loyalty/Rewards, Payment config abstraction

-- ============ CATEGORIES ============
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ============ PRODUCTS ============
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  sku text unique,
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  price_cents int not null check (price_cents >= 0),
  compare_at_price_cents int,
  stock_quantity int default 0,
  is_active boolean default true,
  requires_disclaimer boolean default true, -- "for research use only" etc.
  image_urls text[] default '{}',
  metadata jsonb default '{}', -- dosage, concentration, code (e.g. RT-30), etc.
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_products_category on products(category_id);
create index idx_products_active on products(is_active);

-- ============ CUSTOMERS ============
-- Assumes auth.users from Supabase Auth; this extends with store-specific data
create table customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  date_of_birth date, -- age verification if required
  created_at timestamptz default now()
);

-- ============ ADDRESSES ============
create table addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete cascade,
  label text default 'shipping',
  full_name text,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'US',
  is_default boolean default false,
  created_at timestamptz default now()
);

-- ============ ORDERS ============
create type order_status as enum (
  'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete set null,
  order_number text unique not null default ('FX-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6)),
  status order_status default 'pending',
  subtotal_cents int not null default 0,
  discount_cents int not null default 0,
  points_credit_cents int not null default 0, -- redeemed reward value applied
  shipping_cents int not null default 0,
  tax_cents int not null default 0,
  total_cents int not null default 0,
  currency text default 'usd',
  shipping_address_id uuid references addresses(id),
  points_earned int default 0, -- computed on payment success, credited via trigger
  payment_provider text, -- e.g. 'stripe', 'nmi', 'authorize_net'
  payment_reference text, -- external transaction/charge id
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_orders_customer on orders(customer_id);
create index idx_orders_status on orders(status);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null, -- snapshot at time of order
  unit_price_cents int not null,
  quantity int not null check (quantity > 0),
  line_total_cents int not null
);

create index idx_order_items_order on order_items(order_id);

-- ============ PAYMENT CONFIG (abstraction, left open) ============
-- Holds which gateway is active + its config keys (secrets stay in env vars,
-- this table only stores which provider is active and non-secret settings).
create table payment_config (
  id int primary key default 1,
  active_provider text default null, -- null = not configured yet
  settings jsonb default '{}', -- non-secret settings only (e.g. capture mode)
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);
insert into payment_config (id, active_provider) values (1, null);

-- ============ LOYALTY / REWARDS ============
create table reward_rules (
  id int primary key default 1,
  points_per_dollar numeric default 0.1, -- 1 point per $10 = 0.1 points/$1
  redemption_rate_cents_per_point numeric default 10, -- how many cents 1 point is worth on redemption
  min_points_to_redeem int default 100,
  points_expire_after_days int, -- null = never expire
  constraint single_row check (id = 1)
);
insert into reward_rules (id) values (1);

create table loyalty_accounts (
  customer_id uuid primary key references auth.users(id) on delete cascade,
  points_balance int not null default 0,
  lifetime_points int not null default 0,
  updated_at timestamptz default now()
);

create type point_transaction_type as enum ('earn', 'redeem', 'expire', 'adjustment');

create table point_transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete cascade,
  order_id uuid references orders(id) on delete set null,
  type point_transaction_type not null,
  points int not null, -- positive for earn, negative for redeem/expire
  note text,
  created_at timestamptz default now()
);

create index idx_point_tx_customer on point_transactions(customer_id);

-- ============ TRIGGER: credit points when order is paid ============
create or replace function credit_loyalty_points()
returns trigger as $$
declare
  rule record;
  earned int;
begin
  if new.status = 'paid' and (old.status is distinct from 'paid') then
    select * into rule from reward_rules where id = 1;

    earned := floor((new.total_cents - new.points_credit_cents) / 100.0 * rule.points_per_dollar);

    if earned > 0 and new.customer_id is not null then
      insert into loyalty_accounts (customer_id, points_balance, lifetime_points)
      values (new.customer_id, earned, earned)
      on conflict (customer_id) do update
        set points_balance = loyalty_accounts.points_balance + earned,
            lifetime_points = loyalty_accounts.lifetime_points + earned,
            updated_at = now();

      insert into point_transactions (customer_id, order_id, type, points, note)
      values (new.customer_id, new.id, 'earn', earned, 'Order ' || new.order_number);

      update orders set points_earned = earned where id = new.id;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_credit_loyalty_points
after update on orders
for each row execute function credit_loyalty_points();

-- ============ ROW LEVEL SECURITY ============
alter table categories enable row level security;
alter table products enable row level security;
alter table customer_profiles enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table loyalty_accounts enable row level security;
alter table point_transactions enable row level security;
alter table payment_config enable row level security;
alter table reward_rules enable row level security;

-- Public read for storefront catalog
create policy "Public can view active categories" on categories for select using (true);
create policy "Public can view active products" on products for select using (is_active = true);

-- Customers manage their own data
create policy "Users manage own profile" on customer_profiles for all using (auth.uid() = id);
create policy "Users manage own addresses" on addresses for all using (auth.uid() = customer_id);
create policy "Users view own orders" on orders for select using (auth.uid() = customer_id);
create policy "Users view own order items" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.customer_id = auth.uid())
);
create policy "Users view own loyalty account" on loyalty_accounts for select using (auth.uid() = customer_id);
create policy "Users view own point transactions" on point_transactions for select using (auth.uid() = customer_id);

-- Admin-only tables (no public policy = only service_role key can access)
-- payment_config and reward_rules intentionally have no public policies.
