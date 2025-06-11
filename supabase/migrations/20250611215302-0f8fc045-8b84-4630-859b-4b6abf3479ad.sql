
-- Create enum for payment methods
CREATE TYPE payment_method_enum AS ENUM (
  'Flutterwave',
  'Binance', 
  'PayPal',
  'Bank Transfer',
  'Wise',
  'Remitly',
  'WorldRemit',
  'Other'
);

-- Create enum for proof types
CREATE TYPE proof_type_enum AS ENUM (
  'Visa Application',
  'Rent Payment',
  'Tax Documentation',
  'Contract Payment',
  'Freelance Work',
  'Other'
);

-- Create payment_proofs table
CREATE TABLE public.payment_proofs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  proof_type proof_type_enum NOT NULL,
  sender_name TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_method payment_method_enum NOT NULL,
  payment_date DATE NOT NULL,
  transaction_image TEXT,
  proof_pdf TEXT,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create storage bucket for transaction images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('transaction-images', 'transaction-images', true);

-- Create storage bucket for generated PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('proof-pdfs', 'proof-pdfs', true);

-- Create storage policies for transaction images
CREATE POLICY "Users can upload their own transaction images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'transaction-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own transaction images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'transaction-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for proof PDFs
CREATE POLICY "Users can upload their own proof PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'proof-pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own proof PDFs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'proof-pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_payment_proofs_updated_at 
  BEFORE UPDATE ON public.payment_proofs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
