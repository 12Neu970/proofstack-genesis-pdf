
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type PaymentMethod = 'Flutterwave' | 'Binance' | 'PayPal' | 'Bank Transfer' | 'Wise' | 'Remitly' | 'WorldRemit' | 'Other';
export type ProofType = 'Visa Application' | 'Rent Payment' | 'Tax Documentation' | 'Contract Payment' | 'Freelance Work' | 'Other';

export interface PaymentProof {
  id: string;
  proof_type: ProofType;
  sender_name: string;
  receiver_name: string;
  amount: number;
  currency?: string;
  purpose?: string;
  payment_method: PaymentMethod;
  payment_date: string;
  transaction_image?: string;
  proof_pdf?: string;
  is_paid: boolean;
  payment_status?: string;
  flutterwave_tx_ref?: string;
  flutterwave_tx_id?: string;
  created_at: string;
  updated_at: string;
}

export function usePaymentProofs() {
  const [proofs, setProofs] = useState<PaymentProof[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProofs = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('payment_proofs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching proofs:', error);
    } else {
      setProofs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProofs();
  }, [user]);

  const createProof = async (proofData: Omit<PaymentProof, 'id' | 'created_at' | 'updated_at' | 'is_paid' | 'payment_status' | 'flutterwave_tx_ref' | 'flutterwave_tx_id'>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('payment_proofs')
      .insert([{
        ...proofData,
        user_id: user.id,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating proof:', error);
      return null;
    }

    await fetchProofs();
    return data;
  };

  const updateProof = async (id: string, updates: Partial<PaymentProof>) => {
    const { error } = await supabase
      .from('payment_proofs')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating proof:', error);
      return false;
    }

    await fetchProofs();
    return true;
  };

  const downloadProof = async (proof: PaymentProof) => {
    if (!proof.is_paid || !proof.proof_pdf) {
      return null;
    }

    const { data, error } = await supabase.storage
      .from('proof-pdfs')
      .download(proof.proof_pdf);

    if (error) {
      console.error('Error downloading proof:', error);
      return null;
    }

    return data;
  };

  return {
    proofs,
    loading,
    fetchProofs,
    createProof,
    updateProof,
    downloadProof,
  };
}
