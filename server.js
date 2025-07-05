/**
 * Simple Development Server
 * Serves the app and injects environment variables
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Inject environment variables into HTML
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Create environment variables script
    const envScript = `
        <script>
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
    
    res.send(html);
});

app.listen(PORT, () => {
    console.log(`🚀 Development server running at http://localhost:${PORT}`);
    console.log('📝 Environment variables loaded from .env file');
    console.log('🔑 API Keys Status:');
    console.log(`   ElevenLabs: ${process.env.ELEVENLABS_API_KEY ? '✓' : '✗'}`);
    console.log(`   OpenAI: ${process.env.OPENAI_API_KEY ? '✓' : '✗'}`);
    console.log(`   Google Cloud: ${process.env.GOOGLE_CLOUD_API_KEY ? '✓' : '✗'}`);
}); 