
-- First, let's add the missing columns to the payment_proofs table
ALTER TABLE public.payment_proofs 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS purpose TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS flutterwave_tx_ref TEXT,
ADD COLUMN IF NOT EXISTS flutterwave_tx_id TEXT;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own proofs" ON public.payment_proofs;
DROP POLICY IF EXISTS "Users can create their own proofs" ON public.payment_proofs;
DROP POLICY IF EXISTS "Users can update their own proofs" ON public.payment_proofs;
DROP POLICY IF EXISTS "Users can delete their own proofs" ON public.payment_proofs;

-- Create RLS policies for payment_proofs table
CREATE POLICY "Users can view their own proofs" 
  ON public.payment_proofs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own proofs" 
  ON public.payment_proofs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own proofs" 
  ON public.payment_proofs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own proofs" 
  ON public.payment_proofs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage buckets for transaction images and proof PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('transaction-images', 'transaction-images', true),
  ('proof-pdfs', 'proof-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can upload their own transaction images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own transaction images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload proof PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own proof PDFs" ON storage.objects;

-- Create storage policies for transaction images
CREATE POLICY "Users can upload their own transaction images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'transaction-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own transaction images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'transaction-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for proof PDFs
CREATE POLICY "Users can upload proof PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'proof-pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own proof PDFs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'proof-pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);
