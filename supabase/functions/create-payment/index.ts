
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const { proofId } = await req.json()
    
    // Get the proof details
    const { data: proof, error: proofError } = await supabaseClient
      .from('payment_proofs')
      .select('*')
      .eq('id', proofId)
      .eq('user_id', user.id)
      .single()

    if (proofError || !proof) {
      return new Response('Proof not found', { status: 404, headers: corsHeaders })
    }

    // Generate transaction reference
    const txRef = `proof_${proofId}_${Date.now()}`
    
    // Create Flutterwave payment link
    const flutterwaveSecretKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY')
    if (!flutterwaveSecretKey) {
      throw new Error('Flutterwave secret key not configured')
    }

    const paymentData = {
      tx_ref: txRef,
      amount: 3, // $3 fee for proof generation
      currency: "USD",
      redirect_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-callback`,
      customer: {
        email: user.email,
        name: proof.payer_name || user.email,
      },
      customizations: {
        title: "ProofStack Payment Proof",
        description: `Payment proof for ${proof.purpose || 'transaction'}`,
      },
      meta: {
        proof_id: proofId,
        user_id: user.id,
      }
    }

    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${flutterwaveSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })

    const paymentResponse = await response.json()
    
    if (paymentResponse.status === 'success') {
      // Update proof with transaction reference
      await supabaseClient
        .from('payment_proofs')
        .update({ 
          flutterwave_tx_ref: txRef,
          payment_status: 'pending'
        })
        .eq('id', proofId)

      return new Response(
        JSON.stringify({ 
          success: true, 
          payment_link: paymentResponse.data.link,
          tx_ref: txRef 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(paymentResponse.message || 'Payment creation failed')
    }

  } catch (error) {
    console.error('Payment creation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
