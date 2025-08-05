
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🛠️  Setting up Stripe integration...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Add Stripe environment variables if they don't exist
const stripeVars = [
  'STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here',
  'STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here',
  'STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here'
];

let hasChanges = false;

stripeVars.forEach(varLine => {
  const [varName] = varLine.split('=');
  if (!envContent.includes(varName)) {
    envContent += envContent ? '\n' + varLine : varLine;
    hasChanges = true;
    console.log(`✅ Added ${varName} to .env file`);
  } else {
    console.log(`⚠️  ${varName} already exists in .env file`);
  }
});

if (hasChanges) {
  fs.writeFileSync(envPath, envContent);
  console.log('\n📝 Updated .env file with Stripe configuration');
} else {
  console.log('\n📝 .env file already contains Stripe configuration');
}

console.log('\n🔧 Next steps:');
console.log('1. Replace the placeholder Stripe keys in .env with your actual keys from https://dashboard.stripe.com/apikeys');
console.log('2. Set up a webhook endpoint in Stripe dashboard pointing to your Supabase Edge Function');
console.log('3. Deploy the Stripe webhook Edge Function to Supabase');
console.log('\n🎉 Stripe integration setup complete!');
