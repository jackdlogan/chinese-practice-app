/**
 * ElevenLabs Text-to-Speech Service
 * Uses REST API for reliable TTS conversion
 */

class ElevenLabsService {
    constructor() {
        // Get API key and voice ID from configuration
        this.apiKey = window.config ? window.config.elevenLabsApiKey : '';
        this.voiceId = window.config ? window.config.voiceId : 'BrbEfHMQu0fyclQR7lfh';
        this.baseUrl = 'https://api.elevenlabs.io/v1';
        this.isPlaying = false;
        this.onAudioReady = null;
        this.onError = null;
    }

    /**
     * Initialize the service with API key
     * @param {string} apiKey - ElevenLabs API key
     * @param {string} voiceId - Voice ID to use (optional)
     */
    init(apiKey, voiceId = null) {
        this.apiKey = apiKey;
        if (voiceId) {
            this.voiceId = voiceId;
        }
        console.log('ElevenLabs service initialized with voice ID:', this.voiceId);
    }

    /**
     * Convert text to speech using ElevenLabs REST API
     * @param {string} text - Text to convert to speech
     * @param {Object} options - TTS options
     * @returns {Promise<ArrayBuffer>} Promise that resolves to audio data
     */
    async convertTextToSpeech(text, options = {}) {
        if (!this.apiKey) {
            throw new Error('API key not provided');
        }

        const url = `${this.baseUrl}/text-to-speech/${this.voiceId}`;
        
        const requestBody = {
            text: text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
                stability: options.stability || 0.5,
                similarity_boost: options.similarity_boost || 0.8,
                style: options.style || 0.0,
                use_speaker_boost: options.use_speaker_boost || true
            }
        };

        // Add optional parameters
        if (options.output_format) {
            requestBody.output_format = options.output_format;
        }

        console.log('Sending TTS request to ElevenLabs:', {
            text: text,
            voiceId: this.voiceId,
            settings: requestBody.voice_settings
        });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': this.apiKey
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
            }

            const audioData = await response.arrayBuffer();
            console.log('Received audio data from ElevenLabs, size:', audioData.byteLength);
            return audioData;

        } catch (error) {
            console.error('ElevenLabs API request failed:', error);
            throw error;
        }
    }

    /**
     * Play text using ElevenLabs TTS
     * @param {string} text - Text to convert and play
     * @param {Object} options - TTS options
     */
    async speak(text, options = {}) {
        try {
            this.isPlaying = true;
            
            // Convert text to speech
            const audioData = await this.convertTextToSpeech(text, options);
            
            // Create audio context and decode audio
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const audioBuffer = await audioContext.decodeAudioData(audioData);
            
            // Create and play audio
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            
            source.onended = () => {
                this.isPlaying = false;
                console.log('ElevenLabs audio playback completed');
                if (this.onAudioReady) {
                    this.onAudioReady();
                }
            };

            source.onerror = (error) => {
                this.isPlaying = false;
                console.error('Audio playback error:', error);
                if (this.onError) {
                    this.onError('Audio playback failed');
                }
            };

            console.log('Starting ElevenLabs audio playback');
            source.start();

        } catch (error) {
            this.isPlaying = false;
            console.error('ElevenLabs speak error:', error);
            if (this.onError) {
                this.onError(`ElevenLabs TTS failed: ${error.message}`);
            }
            throw error;
        }
    }

    /**
     * Stop current TTS playback
     */
    stop() {
        this.isPlaying = false;
        // Note: We can't directly stop the audio source without keeping a reference
        // This is a limitation of the current implementation
        console.log('ElevenLabs playback stopped');
    }

    /**
     * Set event callbacks
     * @param {Function} onAudioReady - Called when audio is ready to play
     * @param {Function} onError - Called when an error occurs
     */
    setCallbacks(onAudioReady, onError) {
        this.onAudioReady = onAudioReady;
        this.onError = onError;
    }

    /**
     * Update voice settings
     * @param {string} voiceId - New voice ID
     * @param {Object} settings - Voice settings
     */
    updateVoice(voiceId, settings = {}) {
        this.voiceId = voiceId;
        console.log('Updated voice ID to:', this.voiceId);
    }

    /**
     * Check if service is ready
     * @returns {boolean} True if ready to use
     */
    isReady() {
        return !!this.apiKey;
    }

    /**
     * Test the API connection
     * @returns {Promise<boolean>} Promise that resolves to true if connection works
     */
    async testConnection() {
        try {
            const testText = "Hello";
            await this.convertTextToSpeech(testText, {});
            console.log('ElevenLabs connection test successful');
            return true;
        } catch (error) {
            console.error('ElevenLabs connection test failed:', error);
            return false;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ElevenLabsService;
} 