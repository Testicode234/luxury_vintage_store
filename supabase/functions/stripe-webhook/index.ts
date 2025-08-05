
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    
    // Verify webhook signature (you'll need to implement this)
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    
    // For now, parse the JSON directly
    const event = JSON.parse(body)

    console.log('Received Stripe webhook:', event.type)

    switch (event.type) {
      case 'product.created':
        // Handle product creation
        const product = event.data.object
        console.log('Product created in Stripe:', product.id)
        break
        
      case 'product.updated':
        // Handle product updates
        const updatedProduct = event.data.object
        console.log('Product updated in Stripe:', updatedProduct.id)
        break
        
      case 'product.deleted':
        // Handle product deletion
        const deletedProduct = event.data.object
        console.log('Product deleted in Stripe:', deletedProduct.id)
        break
        
      case 'price.created':
        // Handle price creation
        const price = event.data.object
        console.log('Price created in Stripe:', price.id)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error handling webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
