/**
 * Manual Netlify Deployment Helper
 * Guides through web interface deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Manual Netlify Deployment Guide');
console.log('===================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found!');
    console.log('Please run "npm run setup" first.');
    process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');

console.log('✅ Project is ready for deployment!\n');

console.log('📋 Step-by-Step Deployment Instructions:');
console.log('=========================================\n');

console.log('1️⃣  Prepare Your Repository:');
console.log('   - Make sure your code is pushed to GitHub');
console.log('   - Your repository should be public or connected to Netlify\n');

console.log('2️⃣  Deploy via Netlify Web Interface:');
console.log('   - Go to: https://app.netlify.com');
console.log('   - Click "New site from Git"');
console.log('   - Choose "GitHub" and authorize Netlify');
console.log('   - Select your repository: Chinese-Practice-App-Clean\n');

console.log('3️⃣  Configure Build Settings:');
console.log('   - Build command: (leave empty - this is a static site)');
console.log('   - Publish directory: . (root directory)');
console.log('   - Click "Deploy site"\n');

console.log('4️⃣  Set Environment Variables:');
console.log('   - After deployment, go to Site settings > Environment variables');
console.log('   - Add the following variables:\n');

// Parse and display environment variables
const envVars = envContent.split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
        const [key, value] = line.split('=');
        return { key: key.trim(), value: value.trim() };
    });

envVars.forEach(({ key, value }) => {
    console.log(`   ${key} = ${value}`);
});

console.log('\n5️⃣  Test Your Deployment:');
console.log('   - Visit your Netlify URL');
console.log('   - Test all features: speech recognition, TTS, AI evaluation');
console.log('   - Check browser console for any errors\n');

console.log('🔧 Alternative: Drag & Drop Deployment');
console.log('=====================================');
console.log('If you prefer, you can also:');
console.log('1. Go to https://app.netlify.com');
console.log('2. Drag and drop your project folder to the deployment area');
console.log('3. Set environment variables as shown above\n');

console.log('📚 For detailed instructions, see DEPLOYMENT.md');
console.log('🎉 Your Chinese Practice App will be live on Netlify!');

// Check if we can help with GitHub push
console.log('\n🔍 Checking Git status...');
try {
    const { execSync } = require('child_process');
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.trim()) {
        console.log('⚠️  You have uncommitted changes. Consider pushing them first:');
        console.log('   git add .');
        console.log('   git commit -m "Ready for deployment"');
        console.log('   git push');
    } else {
        console.log('✅ All changes are committed and ready for deployment');
    }
} catch (error) {
    console.log('ℹ️  Could not check Git status');
} 