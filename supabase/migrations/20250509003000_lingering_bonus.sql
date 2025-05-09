/*
  # Initial database schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `phone` (text)
      - `type` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `producers`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `business_name` (text)
      - `description` (text)
      - `address` (text)
      - `delivery_available` (boolean)
      - `pickup_available` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `producer_id` (uuid, references producers)
      - `category_id` (uuid, references categories)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `stock` (integer)
      - `image_url` (text)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `status` (text)
      - `delivery_type` (text)
      - `delivery_address` (text)
      - `subtotal` (numeric)
      - `shipping` (numeric)
      - `total` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, references orders)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `price` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  type text NOT NULL CHECK (type IN ('buyer', 'producer')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE producers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles NOT NULL,
  business_name text NOT NULL,
  description text,
  address text NOT NULL,
  delivery_available boolean DEFAULT false,
  pickup_available boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id uuid REFERENCES producers NOT NULL,
  category_id uuid REFERENCES categories NOT NULL,
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  delivery_type text NOT NULL CHECK (delivery_type IN ('delivery', 'pickup')),
  delivery_address text,
  subtotal numeric NOT NULL CHECK (subtotal >= 0),
  shipping numeric NOT NULL DEFAULT 0 CHECK (shipping >= 0),
  total numeric NOT NULL CHECK (total >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders NOT NULL,
  product_id uuid REFERENCES products NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public producers are viewable by everyone"
  ON producers FOR SELECT
  USING (true);

CREATE POLICY "Producers can update own record"
  ON producers FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = profile_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = profile_id
  ));

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Producers can manage own products"
  ON products FOR ALL
  USING (auth.uid() IN (
    SELECT p.user_id FROM profiles p
    JOIN producers pr ON p.id = pr.profile_id
    WHERE pr.id = producer_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT p.user_id FROM profiles p
    JOIN producers pr ON p.id = pr.profile_id
    WHERE pr.id = producer_id
  ));

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = profile_id
  ));

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = profile_id
  ));

CREATE POLICY "Order items are viewable by order owner"
  ON order_items FOR SELECT
  USING (auth.uid() IN (
    SELECT p.user_id FROM profiles p
    JOIN orders o ON p.id = o.profile_id
    WHERE o.id = order_id
  ));

-- Insert default categories
INSERT INTO categories (name, description) VALUES
  ('Frutas', 'Frutas frescas de produtores locais'),
  ('Legumes', 'Legumes frescos de produtores locais'),
  ('Verduras', 'Verduras frescas de produtores locais'),
  ('Orgânicos', 'Produtos orgânicos certificados'),
  ('Processados', 'Produtos processados artesanalmente'),
  ('Outros', 'Outros produtos locais');

-- Create function to handle profile updates
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER producers_updated_at
  BEFORE UPDATE ON producers
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();