/**
 * Configuration Management
 * Handles API keys and settings from environment variables
 */

class Config {
    constructor() {
        this.loadFromEnvironment();
    }

    /**
     * Load configuration from environment variables
     */
    loadFromEnvironment() {
        // Load API keys from environment variables (no hardcoded fallbacks for security)
        this.elevenLabsApiKey = this.getEnvVar('ELEVENLABS_API_KEY', '');
        this.openaiApiKey = this.getEnvVar('OPENAI_API_KEY', '');
        this.googleCloudApiKey = this.getEnvVar('GOOGLE_CLOUD_API_KEY', '');
        
        // Other settings with safe defaults
        this.voiceId = this.getEnvVar('ELEVENLABS_VOICE_ID', 'BrbEfHMQu0fyclQR7lfh');
        this.speechRate = parseFloat(this.getEnvVar('SPEECH_RATE', '0.8'));
        this.stability = parseFloat(this.getEnvVar('ELEVENLABS_STABILITY', '0.5'));
        this.similarityBoost = parseFloat(this.getEnvVar('ELEVENLABS_SIMILARITY_BOOST', '0.8'));
        this.useElevenLabs = this.getEnvVar('USE_ELEVENLABS', 'true').toLowerCase() === 'true';
        
        console.log('Configuration loaded from environment variables');
        this.logConfigurationStatus();
    }

    /**
     * Get environment variable with fallback
     * @param {string} key - Environment variable name
     * @param {string} fallback - Fallback value if env var not found
     * @returns {string} Environment variable value or fallback
     */
    getEnvVar(key, fallback) {
        // In browser environment, try to get from window.env or use fallback
        if (typeof window !== 'undefined' && window.env && window.env[key]) {
            return window.env[key];
        }
        
        // For Node.js environment
        if (typeof process !== 'undefined' && process.env && process.env[key]) {
            return process.env[key];
        }
        
        return fallback;
    }

    /**
     * Log configuration status (without exposing sensitive data)
     */
    logConfigurationStatus() {
        console.log('Configuration Status:');
        console.log('- ElevenLabs API Key:', this.elevenLabsApiKey ? '✓ Configured' : '✗ Not configured');
        console.log('- OpenAI API Key:', this.openaiApiKey ? '✓ Configured' : '✗ Not configured');
        console.log('- Google Cloud API Key:', this.googleCloudApiKey ? '✓ Configured' : '✗ Not configured');
        console.log('- Voice ID:', this.voiceId);
        console.log('- Speech Rate:', this.speechRate);
        console.log('- Use ElevenLabs:', this.useElevenLabs);
    }

    /**
     * Get all settings as an object
     * @returns {Object} Settings object
     */
    getSettings() {
        return {
            speechRate: this.speechRate,
            voiceId: this.voiceId,
            elevenLabsApiKey: this.elevenLabsApiKey,
            openaiApiKey: this.openaiApiKey,
            googleCloudApiKey: this.googleCloudApiKey,
            stability: this.stability,
            similarityBoost: this.similarityBoost,
            useElevenLabs: this.useElevenLabs
        };
    }

    /**
     * Check if all required API keys are configured
     * @returns {boolean} True if all keys are configured
     */
    isFullyConfigured() {
        return !!(this.elevenLabsApiKey && this.openaiApiKey && this.googleCloudApiKey);
    }

    /**
     * Get configuration for development
     * @returns {Object} Development configuration
     */
    getDevelopmentConfig() {
        return {
            elevenLabsApiKey: this.elevenLabsApiKey,
            openaiApiKey: this.openaiApiKey,
            googleCloudApiKey: this.googleCloudApiKey,
            voiceId: this.voiceId,
            speechRate: this.speechRate,
            stability: this.stability,
            similarityBoost: this.similarityBoost,
            useElevenLabs: this.useElevenLabs
        };
    }
}

// Create global configuration instance
window.config = new Config();

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
} 