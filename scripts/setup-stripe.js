
const fs = require('fs');
const path = require('path');

console.log('🛠️  Setting up Stripe integration...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Found existing .env file');
} else {
  console.log('⚠️  No .env file found, creating new one...');
}

// Parse existing environment variables
const parseEnvFile = (content) => {
  const vars = {};
  content.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      vars[key.trim()] = valueParts.join('=').trim();
    }
  });
  return vars;
};

const existingVars = parseEnvFile(envContent);

// Add Stripe environment variables if they don't exist
const stripeVars = {
  'STRIPE_SECRET_KEY': 'sk_test_your_stripe_secret_key_here',
  'STRIPE_PUBLISHABLE_KEY': 'pk_test_your_stripe_publishable_key_here',
  'STRIPE_WEBHOOK_SECRET': 'whsec_your_webhook_secret_here'
};

let hasChanges = false;
let updatedContent = envContent;

Object.entries(stripeVars).forEach(([varName, defaultValue]) => {
  if (!existingVars[varName]) {
    updatedContent += updatedContent ? `\n${varName}=${defaultValue}` : `${varName}=${defaultValue}`;
    hasChanges = true;
    console.log(`✅ Added ${varName} to .env file`);
  } else {
    console.log(`⚠️  ${varName} already exists in .env file with value: ${existingVars[varName].substring(0, 20)}...`);
  }
});

if (hasChanges) {
  fs.writeFileSync(envPath, updatedContent);
  console.log('\n📝 Updated .env file with Stripe configuration');
} else {
  console.log('\n📝 .env file already contains all Stripe configuration');
}

console.log('\n🔧 Current Stripe configuration:');
Object.keys(stripeVars).forEach(key => {
  const value = existingVars[key] || stripeVars[key];
  const displayValue = value.includes('your_') ? '❌ Not configured' : '✅ Configured';
  console.log(`${key}: ${displayValue}`);
});

console.log('\n🌐 Stripe Webhook URL:');
console.log('https://abxvtlxrjmfvachpzskz.supabase.co/functions/v1/stripe-webhook');

console.log('\n🔧 Next steps:');
console.log('1. Replace the placeholder Stripe keys in .env with your actual keys from https://dashboard.stripe.com/apikeys');
console.log('2. Set up a webhook endpoint in Stripe dashboard with the URL above');
console.log('3. Select these events in your Stripe webhook:');
console.log('   - product.created');
console.log('   - product.updated');
console.log('   - product.deleted');
console.log('   - price.created');
console.log('   - price.updated');
console.log('4. Copy the webhook signing secret and update STRIPE_WEBHOOK_SECRET in your .env file');
console.log('5. Run the deploy script: node scripts/deploy-stripe-function.js');
console.log('\n🎉 Stripe integration setup complete!');
