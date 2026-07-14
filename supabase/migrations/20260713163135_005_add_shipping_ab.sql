-- Shipping surcharge A/B: arm label + charged shipping, mirrored from the Shopify order.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_variant TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_amount NUMERIC;
