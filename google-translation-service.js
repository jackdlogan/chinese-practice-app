/**
 * Google Cloud Translation Service
 * Handles API calls to Google Cloud Translation API for Chinese to English translation
 */

class GoogleTranslationService {
    constructor() {
        // Get API key from configuration
        this.apiKey = window.config ? window.config.googleCloudApiKey : '';
        this.baseUrl = 'https://translation.googleapis.com/language/translate/v2';
    }

    /**
     * Initialize the service with API key
     * @param {string} apiKey - Google Cloud API key
     */
    init(apiKey) {
        this.apiKey = apiKey;
        console.log('Google Translation service initialized');
    }

    /**
     * Translate Chinese text to English using Google Cloud Translation API
     * @param {string} chineseText - Chinese text to translate
     * @returns {Promise<string>} Promise that resolves to English translation
     */
    async translateToEnglish(chineseText) {
        if (!this.apiKey || this.apiKey === 'YOUR_GOOGLE_CLOUD_API_KEY') {
            throw new Error('Google Cloud API key not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: chineseText,
                    source: 'zh',
                    target: 'en',
                    format: 'text'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Google Translation API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            
            if (data.data && data.data.translations && data.data.translations.length > 0) {
                const translation = data.data.translations[0].translatedText;
                console.log('Google Translation completed:', translation);
                return translation;
            } else {
                throw new Error('No translation returned from Google API');
            }

        } catch (error) {
            console.error('Google Translation request failed:', error);
            throw error;
        }
    }

    /**
     * Test the Google Cloud Translation API connection
     * @returns {Promise<boolean>} Promise that resolves to true if connection works
     */
    async testConnection() {
        try {
            const testText = "你好";
            const translation = await this.translateToEnglish(testText);
            console.log('Google Translation connection test successful:', translation);
            return true;
        } catch (error) {
            console.error('Google Translation connection test failed:', error);
            return false;
        }
    }

    /**
     * Check if service is ready
     * @returns {boolean} True if ready to use
     */
    isReady() {
        return !!this.apiKey && this.apiKey !== 'YOUR_GOOGLE_CLOUD_API_KEY';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleTranslationService;
} 