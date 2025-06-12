
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const txRef = url.searchParams.get('tx_ref')
    const transactionId = url.searchParams.get('transaction_id')

    if (status === 'successful' && txRef && transactionId) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Verify payment with Flutterwave
      const flutterwaveSecretKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY')
      const verifyResponse = await fetch(
        `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
        {
          headers: {
            'Authorization': `Bearer ${flutterwaveSecretKey}`,
          },
        }
      )

      const verificationData = await verifyResponse.json()
      
      if (verificationData.status === 'success' && verificationData.data.status === 'successful') {
        // Get proof details
        const { data: proof } = await supabaseClient
          .from('payment_proofs')
          .select('*')
          .eq('flutterwave_tx_ref', txRef)
          .single()

        if (proof) {
          // Generate PDF
          const pdfDoc = await PDFDocument.create()
          const page = pdfDoc.addPage([612, 792])
          const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
          const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

          // Add content to PDF
          page.drawText('PAYMENT PROOF CERTIFICATE', {
            x: 150,
            y: 700,
            size: 20,
            font: boldFont,
            color: rgb(0.15, 0.27, 0.91),
          })

          page.drawText('ProofStack', {
            x: 50,
            y: 750,
            size: 16,
            font: boldFont,
            color: rgb(0.15, 0.27, 0.91),
          })

          const currentDate = new Date().toLocaleDateString()
          page.drawText(`Generated on: ${currentDate}`, {
            x: 400,
            y: 750,
            size: 10,
            font: font,
          })

          // Payment details
          const details = [
            `Payer Name: ${proof.sender_name || proof.payer_name || 'N/A'}`,
            `Receiver Name: ${proof.receiver_name || 'N/A'}`,
            `Amount: ${proof.currency || 'USD'} ${proof.amount}`,
            `Payment Method: ${proof.payment_method}`,
            `Payment Date: ${new Date(proof.payment_date).toLocaleDateString()}`,
            `Purpose: ${proof.purpose || proof.proof_type}`,
            `Transaction Reference: ${txRef}`,
            `Verification ID: ${transactionId}`,
          ]

          let yPosition = 600
          details.forEach((detail) => {
            page.drawText(detail, {
              x: 50,
              y: yPosition,
              size: 12,
              font: font,
            })
            yPosition -= 30
          })

          // Add verification footer
          page.drawText('This document has been digitally verified and is authentic.', {
            x: 50,
            y: 100,
            size: 10,
            font: font,
            color: rgb(0.5, 0.5, 0.5),
          })

          page.drawText(`Certificate ID: ${proof.id}`, {
            x: 50,
            y: 80,
            size: 10,
            font: font,
            color: rgb(0.5, 0.5, 0.5),
          })

          const pdfBytes = await pdfDoc.save()

          // Upload PDF to storage
          const fileName = `${proof.user_id}/proof_${proof.id}_${Date.now()}.pdf`
          const { error: uploadError } = await supabaseClient.storage
            .from('proof-pdfs')
            .upload(fileName, pdfBytes, {
              contentType: 'application/pdf',
            })

          if (!uploadError) {
            // Update proof record
            await supabaseClient
              .from('payment_proofs')
              .update({
                is_paid: true,
                payment_status: 'completed',
                flutterwave_tx_id: transactionId,
                proof_pdf: fileName,
              })
              .eq('id', proof.id)
          }
        }
      }
    }

    // Redirect to dashboard
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: `${Deno.env.get('SUPABASE_URL').replace('supabase.co', 'lovable.app')}/dashboard`,
      },
    })

  } catch (error) {
    console.error('Payment callback error:', error)
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: `${Deno.env.get('SUPABASE_URL').replace('supabase.co', 'lovable.app')}/dashboard?error=payment_failed`,
      },
    })
  }
})
