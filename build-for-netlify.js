/**
 * Build Script for Netlify Deployment
 * Injects environment variables into static HTML for frontend access
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Building for Netlify deployment...');

// Read the original index.html
const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Create environment variables script
const envScript = `
    <script>
        // Environment variables injected by build script
        window.env = {
            ELEVENLABS_API_KEY: '${process.env.ELEVENLABS_API_KEY || ''}',
            OPENAI_API_KEY: '${process.env.OPENAI_API_KEY || ''}',
            GOOGLE_CLOUD_API_KEY: '${process.env.GOOGLE_CLOUD_API_KEY || ''}',
            ELEVENLABS_VOICE_ID: '${process.env.ELEVENLABS_VOICE_ID || 'BrbEfHMQu0fyclQR7lfh'}',
            ELEVENLABS_STABILITY: '${process.env.ELEVENLABS_STABILITY || '0.5'}',
            ELEVENLABS_SIMILARITY_BOOST: '${process.env.ELEVENLABS_SIMILARITY_BOOST || '0.8'}',
            USE_ELEVENLABS: '${process.env.USE_ELEVENLABS || 'true'}',
            SPEECH_RATE: '${process.env.SPEECH_RATE || '0.8'}'
        };
    </script>
`;

// Replace the placeholder script with actual environment variables
html = html.replace(
    /<!-- Environment Variables \(can be injected by server\) -->[\s\S]*?<!-- Example: window\.env\.ELEVENLABS_API_KEY = 'your-key-here'; -->/,
    envScript
);

// If the above replacement didn't work, replace the entire script block
if (html.includes('window.env = window.env || {};')) {
    html = html.replace(
        /<script>\s*\/\/ Environment variables can be injected here by the server\s*window\.env = window\.env \|\| \{\};\s*\/\/ Example: window\.env\.ELEVENLABS_API_KEY = 'your-key-here';\s*<\/script>/,
        envScript
    );
}

// Write the modified HTML to a build directory
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

// Copy all static files to build directory
const filesToCopy = [
    'styles.css',
    'app.js',
    'config.js',
    'elevenlabs-service.js',
    'openai-service.js',
    'google-translation-service.js',
    'netlify.toml'
];

filesToCopy.forEach(file => {
    const sourcePath = path.join(__dirname, file);
    const destPath = path.join(buildDir, file);
    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copied ${file}`);
    }
});

// Write the modified index.html
const buildIndexPath = path.join(buildDir, 'index.html');
fs.writeFileSync(buildIndexPath, html);

console.log('✅ Build completed successfully!');
console.log('📁 Build files are in the "build" directory');
console.log('🔑 Environment variables have been injected into index.html');

// Check if environment variables are available
const envVars = {
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GOOGLE_CLOUD_API_KEY: process.env.GOOGLE_CLOUD_API_KEY
};

console.log('\n📋 Environment Variables Status:');
Object.entries(envVars).forEach(([key, value]) => {
    const status = value ? '✓ Configured' : '✗ Missing';
    console.log(`   ${key}: ${status}`);
});

console.log('\n🚀 To deploy to Netlify:');
console.log('1. Set your publish directory to "build" in Netlify dashboard');
console.log('2. Or run: netlify deploy --prod --dir=build'); 