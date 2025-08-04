-- Location: supabase/migrations/20250804195834_ecommerce_with_auth.sql
-- Schema Analysis: Fresh project - implementing complete e-commerce system
-- Integration Type: Complete new schema with authentication
-- Dependencies: auth.users (Supabase managed)

-- 1. Types and Core Tables
CREATE TYPE public.user_role AS ENUM ('admin', 'customer');
CREATE TYPE public.product_status AS ENUM ('active', 'inactive', 'out_of_stock');

-- User profiles table (intermediary between auth.users and business logic)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'customer'::public.user_role,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Brands table
CREATE TABLE public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    image_url TEXT,
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 0,
    features TEXT[],
    status public.product_status DEFAULT 'active'::public.product_status,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Essential Indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(id);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_products_brand_id ON public.products(brand_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_created_by ON public.products(created_by);

-- 3. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies - Using Pattern System

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public read, private write for categories
CREATE POLICY "public_can_read_categories"
ON public.categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "admin_manage_categories"
ON public.categories
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
));

-- Pattern 4: Public read, private write for brands
CREATE POLICY "public_can_read_brands"
ON public.brands
FOR SELECT
TO public
USING (true);

CREATE POLICY "admin_manage_brands"
ON public.brands
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
));

-- Pattern 4: Public read, admin write for products
CREATE POLICY "public_can_read_products"
ON public.products
FOR SELECT
TO public
USING (status = 'active'::public.product_status);

CREATE POLICY "admin_manage_products"
ON public.products
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
));

-- 5. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    customer_uuid UUID := gen_random_uuid();
    -- Category UUIDs
    watches_cat_id UUID := gen_random_uuid();
    hoodies_cat_id UUID := gen_random_uuid();
    cologne_cat_id UUID := gen_random_uuid();
    gadgets_cat_id UUID := gen_random_uuid();
    airpods_cat_id UUID := gen_random_uuid();
    airpods_max_cat_id UUID := gen_random_uuid();
    -- Brand UUIDs
    apple_brand_id UUID := gen_random_uuid();
    samsung_brand_id UUID := gen_random_uuid();
    nike_brand_id UUID := gen_random_uuid();
    champion_brand_id UUID := gen_random_uuid();
    tom_ford_brand_id UUID := gen_random_uuid();
    dior_brand_id UUID := gen_random_uuid();
    rolex_brand_id UUID := gen_random_uuid();
    sony_brand_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@watchhub.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (customer_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'customer@watchhub.com', crypt('customer123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Customer User", "role": "customer"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Insert categories
    INSERT INTO public.categories (id, name, slug, icon) VALUES
        (watches_cat_id, 'Watches', 'watches', 'Watch'),
        (hoodies_cat_id, 'Hoodies', 'hoodies', 'Shirt'),
        (cologne_cat_id, 'Cologne', 'cologne', 'Sparkles'),
        (gadgets_cat_id, 'Gadgets', 'gadgets', 'Smartphone'),
        (airpods_cat_id, 'AirPods', 'airpods', 'Headphones'),
        (airpods_max_cat_id, 'AirPods Max', 'airpods-max', 'Headphones');

    -- Insert brands
    INSERT INTO public.brands (id, name, slug) VALUES
        (apple_brand_id, 'Apple', 'apple'),
        (samsung_brand_id, 'Samsung', 'samsung'),
        (nike_brand_id, 'Nike', 'nike'),
        (champion_brand_id, 'Champion', 'champion'),
        (tom_ford_brand_id, 'Tom Ford', 'tom-ford'),
        (dior_brand_id, 'Dior', 'dior'),
        (rolex_brand_id, 'Rolex', 'rolex'),
        (sony_brand_id, 'Sony', 'sony');

    -- Insert products
    INSERT INTO public.products (name, brand_id, category_id, price, original_price, image_url, rating, review_count, stock, features, created_by) VALUES
        ('Apple Watch Series 9 GPS + Cellular 45mm', apple_brand_id, watches_cat_id, 529.00, 599.00, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop', 4.8, 2847, 15, '{"GPS", "Cellular", "Health"}', admin_uuid),
        ('Samsung Galaxy Watch6 Classic 47mm', samsung_brand_id, watches_cat_id, 429.00, 479.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 4.6, 1923, 8, '{"Bluetooth", "Health", "GPS"}', admin_uuid),
        ('Nike Tech Fleece Hoodie', nike_brand_id, hoodies_cat_id, 120.00, 150.00, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', 4.5, 856, 25, '{"Cotton", "Fleece", "Comfort"}', admin_uuid),
        ('Tom Ford Oud Wood Cologne 50ml', tom_ford_brand_id, cologne_cat_id, 285.00, 320.00, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', 4.9, 432, 12, '{"Luxury", "Long-lasting", "Woody"}', admin_uuid),
        ('iPhone 15 Pro Max 256GB', apple_brand_id, gadgets_cat_id, 1199.00, 1299.00, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', 4.7, 3421, 5, '{"5G", "Pro Camera", "Titanium"}', admin_uuid),
        ('AirPods Pro (2nd Generation)', apple_brand_id, airpods_cat_id, 249.00, 279.00, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop', 4.8, 5672, 18, '{"ANC", "Spatial Audio", "MagSafe"}', admin_uuid),
        ('AirPods Max - Space Gray', apple_brand_id, airpods_max_cat_id, 549.00, 599.00, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop', 4.6, 1234, 7, '{"Premium", "ANC", "Hi-Fi"}', admin_uuid),
        ('Champion Reverse Weave Hoodie', champion_brand_id, hoodies_cat_id, 85.00, 95.00, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', 4.3, 678, 32, '{"Cotton", "Classic", "Durable"}', admin_uuid),
        ('Rolex Submariner Date', rolex_brand_id, watches_cat_id, 8950.00, 9500.00, 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=400&fit=crop', 4.9, 234, 2, '{"Luxury", "Waterproof", "Swiss"}', admin_uuid),
        ('Dior Sauvage Eau de Toilette 100ml', dior_brand_id, cologne_cat_id, 165.00, 185.00, 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=400&fit=crop', 4.7, 1876, 22, '{"Fresh", "Woody", "Spicy"}', admin_uuid),
        ('MacBook Pro 16-inch M3 Pro', apple_brand_id, gadgets_cat_id, 2499.00, 2699.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', 4.8, 892, 9, '{"M3 Pro", "16GB RAM", "512GB SSD"}', admin_uuid),
        ('Sony WH-1000XM5 Headphones', sony_brand_id, gadgets_cat_id, 399.00, 449.00, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop', 4.6, 2341, 14, '{"ANC", "30hr Battery", "Hi-Res"}', admin_uuid);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;