
#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Deploying Stripe webhook Edge Function to Supabase...\n');

try {
  // Deploy the Edge Function
  execSync('supabase functions deploy stripe-webhook', { stdio: 'inherit' });
  
  console.log('\n✅ Stripe webhook Edge Function deployed successfully!');
  console.log('\n📋 Configuration steps:');
  console.log('1. Go to your Stripe Dashboard > Webhooks');
  console.log('2. Add a new webhook endpoint with the URL from the deployment output');
  console.log('3. Select the following events to listen for:');
  console.log('   - product.created');
  console.log('   - product.updated');
  console.log('   - product.deleted');
  console.log('   - price.created');
  console.log('   - price.updated');
  console.log('4. Copy the webhook signing secret and update STRIPE_WEBHOOK_SECRET in your .env file');
  
} catch (error) {
  console.error('❌ Failed to deploy Edge Function:', error.message);
  console.log('\n💡 Make sure you have:');
  console.log('1. Supabase CLI installed');
  console.log('2. Logged in to Supabase CLI');
  console.log('3. Linked to your Supabase project');
}
