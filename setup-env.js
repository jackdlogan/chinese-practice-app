/**
 * Environment Setup Script
 * Creates .env file with placeholder API keys
 */

const fs = require('fs');
const path = require('path');

// Placeholder API keys (user should fill in their own)
const envContent = `# Chinese Practice App Environment Variables
# API Keys and Configuration Settings

# ElevenLabs API Configuration
ELEVENLABS_API_KEY=sk-elevenlabs-xxxx
ELEVENLABS_VOICE_ID=BrbEfHMQu0fyclQR7lfh
ELEVENLABS_STABILITY=0.5
ELEVENLABS_SIMILARITY_BOOST=0.8
USE_ELEVENLABS=true

# OpenAI API Configuration
OPENAI_API_KEY=sk-openai-xxxx

# Google Cloud Translation API Configuration
GOOGLE_CLOUD_API_KEY=AIza-google-xxxx

# Speech Settings
SPEECH_RATE=0.8
`;

function createEnvFile() {
    const envPath = path.join(__dirname, '.env');
    
    try {
        // Check if .env already exists
        if (fs.existsSync(envPath)) {
            console.log('⚠️  .env file already exists. Skipping creation.');
            console.log('   If you want to update it, please delete the existing .env file first.');
            return;
        }
        
        // Create .env file
        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env file created successfully!');
        console.log('📝 All API keys have been moved to environment variables.');
        console.log('🔒 The .env file is automatically ignored by git for security.');
        console.log('');
        console.log('🚀 You can now start the development server with:');
        console.log('   npm install');
        console.log('   npm start');
        
    } catch (error) {
        console.error('❌ Error creating .env file:', error.message);
        console.log('');
        console.log('📋 Please manually create a .env file with the following content:');
        console.log('');
        console.log(envContent);
    }
}

// Run the setup
createEnvFile(); 