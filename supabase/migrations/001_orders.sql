-- Litsaber orders mirror (Phase 5c)
-- Populated by the Shopify orders/create webhook. One row per order.
-- Source of truth for purchases remains Shopify; this is the queryable mirror
-- for the Phase 6 production agent + the North Star completion-rate diagnostic.

create table public.orders (
  id                uuid primary key default gen_random_uuid(),
  shopify_order_id  text not null unique,        -- dedupe key: Shopify can retry orders/create
  order_number      text,                        -- order "name", e.g. "#1042"
  order_value       numeric(10,2) not null,      -- total_price
  item_count        integer not null default 0,  -- sum of line quantities
  currency          text not null default 'USD',
  distinct_id       text,                         -- stitched PostHog id (from cart attribute); nullable if stitch missing
  has_promo_code    boolean not null default false,
  discount_code     text,
  discount_amount   numeric(10,2) not null default 0,  -- total_discounts
  email             text,                          -- customer email (own DB, not analytics stream)
  raw               jsonb,                         -- full order payload — Phase 6 escape hatch
  created_at        timestamptz not null default now()
);

-- Indexes for the queries the agent will actually run:
create index orders_created_at_idx   on public.orders (created_at desc);   -- weekly windows
create index orders_distinct_id_idx  on public.orders (distinct_id);       -- stitch joins / funnel completion
create index orders_has_promo_idx    on public.orders (has_promo_code);    -- promo-lever analysis

-- Row-level security: lock it down. Only the service_role (server webhook) writes;
-- nothing client-side ever reads this table directly.
alter table public.orders enable row level security;
-- No policies created = no anon/authenticated access. service_role bypasses RLS,
-- so the webhook still writes. This is deliberate: the orders table is server-only.
