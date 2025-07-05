/**
 * Netlify Deployment Helper Script
 * Helps prepare and deploy the app to Netlify
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Netlify Deployment Helper');
console.log('============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found!');
    console.log('Please run "npm run setup" first to create the .env file.');
    process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');

// Extract API keys
const apiKeys = {
    ELEVENLABS_API_KEY: envContent.match(/ELEVENLABS_API_KEY=(.+)/)?.[1] || '',
    OPENAI_API_KEY: envContent.match(/OPENAI_API_KEY=(.+)/)?.[1] || '',
    GOOGLE_CLOUD_API_KEY: envContent.match(/GOOGLE_CLOUD_API_KEY=(.+)/)?.[1] || ''
};

console.log('✅ .env file found');
console.log('📋 API Keys Status:');
console.log(`   ElevenLabs: ${apiKeys.ELEVENLABS_API_KEY ? '✓ Configured' : '✗ Missing'}`);
console.log(`   OpenAI: ${apiKeys.OPENAI_API_KEY ? '✓ Configured' : '✗ Missing'}`);
console.log(`   Google Cloud: ${apiKeys.GOOGLE_CLOUD_API_KEY ? '✓ Configured' : '✗ Missing'}`);

// Check for missing keys
const missingKeys = Object.entries(apiKeys).filter(([key, value]) => !value);
if (missingKeys.length > 0) {
    console.log('\n⚠️  Missing API Keys:');
    missingKeys.forEach(([key]) => console.log(`   - ${key}`));
    console.log('\nPlease update your .env file with the missing API keys.');
}

console.log('\n📁 Files ready for deployment:');
const requiredFiles = [
    'index.html',
    'styles.css',
    'app.js',
    'config.js',
    'elevenlabs-service.js',
    'openai-service.js',
    'google-translation-service.js',
    'netlify.toml',
    '.gitignore'
];

requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n🚀 Deployment Steps:');
console.log('1. Push your code to GitHub');
console.log('2. Go to https://app.netlify.com');
console.log('3. Click "New site from Git"');
console.log('4. Choose your GitHub repository');
console.log('5. Configure build settings:');
console.log('   - Build command: (leave empty)');
console.log('   - Publish directory: .');
console.log('6. Click "Deploy site"');
console.log('7. Go to Site settings > Environment variables');
console.log('8. Add the following environment variables:');

console.log('\n🔑 Environment Variables to Set in Netlify:');
console.log('===========================================');

// Parse all environment variables from .env
const envVars = envContent.split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
        const [key, value] = line.split('=');
        return { key: key.trim(), value: value.trim() };
    });

envVars.forEach(({ key, value }) => {
    console.log(`${key}=${value}`);
});

console.log('\n💡 Tips:');
console.log('- Make sure your .env file is in .gitignore');
console.log('- Test locally with "npm start" before deploying');
console.log('- Check browser console for any errors after deployment');
console.log('- Monitor API usage in respective dashboards');

console.log('\n📚 For detailed instructions, see DEPLOYMENT.md');
console.log('🎉 Happy deploying!'); 