/**
 * OpenAI Service for ChatGPT Evaluation
 * Handles API calls to OpenAI for answer evaluation
 */

class OpenAIService {
    constructor() {
        // Get API key from configuration
        this.apiKey = window.config ? window.config.openaiApiKey : '';
        this.baseUrl = 'https://api.openai.com/v1';
        this.model = 'gpt-4'; // Using GPT-4 for better evaluation
    }

    /**
     * Initialize the service with API key
     * @param {string} apiKey - OpenAI API key
     */
    init(apiKey) {
        this.apiKey = apiKey;
        console.log('OpenAI service initialized');
    }

    /**
     * Evaluate a Chinese answer using ChatGPT
     * @param {string} question - The Chinese question
     * @param {string} answer - The user's Chinese answer
     * @returns {Promise<Object>} Promise that resolves to evaluation result
     */
    async evaluateAnswer(question, answer) {
        if (!this.apiKey || this.apiKey === 'sk-proj-your-openai-api-key-here') {
            throw new Error('OpenAI API key not configured');
        }

        const prompt = this.createEvaluationPrompt(question, answer);
        
        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a Chinese language teacher evaluating student answers. Provide constructive feedback in English.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            const evaluation = this.parseEvaluationResponse(data.choices[0].message.content);
            
            console.log('OpenAI evaluation completed:', evaluation);
            return evaluation;

        } catch (error) {
            console.error('OpenAI API request failed:', error);
            throw error;
        }
    }

    /**
     * Create evaluation prompt for ChatGPT
     * @param {string} question - The Chinese question
     * @param {string} answer - The user's Chinese answer
     * @returns {string} Formatted prompt
     */
    createEvaluationPrompt(question, answer) {
        return `Please evaluate this Chinese language answer:

Question: "${question}"
Student's Answer: "${answer}"

Please provide an evaluation in the following JSON format:
{
    "type": "good|partial|poor",
    "feedback": "Detailed feedback in English explaining what was good and what could be improved",
    "example": "A good example answer in Chinese",
    "score": 1-10,
    "grammar_score": 1-10,
    "pronunciation_tips": "Tips for pronunciation if applicable"
}

Evaluation criteria:
- "good": Correct grammar, appropriate vocabulary, complete answer
- "partial": Mostly correct but has some issues
- "poor": Significant grammar/vocabulary issues or incomplete answer

Focus on:
1. Grammar accuracy
2. Vocabulary appropriateness
3. Answer completeness
4. Cultural appropriateness
5. Pronunciation guidance

Respond only with the JSON object, no additional text.`;
    }

    /**
     * Parse the evaluation response from ChatGPT
     * @param {string} response - Raw response from ChatGPT
     * @returns {Object} Parsed evaluation object
     */
    parseEvaluationResponse(response) {
        try {
            // Try to extract JSON from the response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const evaluation = JSON.parse(jsonMatch[0]);
                
                // Ensure required fields exist
                return {
                    type: evaluation.type || 'partial',
                    feedback: evaluation.feedback || 'Evaluation completed.',
                    example: evaluation.example || '这是一个很好的回答示例。',
                    score: evaluation.score || 5,
                    grammar_score: evaluation.grammar_score || 5,
                    pronunciation_tips: evaluation.pronunciation_tips || ''
                };
            } else {
                // Fallback if JSON parsing fails
                return {
                    type: 'partial',
                    feedback: response || 'Evaluation completed.',
                    example: '这是一个很好的回答示例。',
                    score: 5,
                    grammar_score: 5,
                    pronunciation_tips: ''
                };
            }
        } catch (error) {
            console.error('Error parsing OpenAI response:', error);
            // Fallback response
            return {
                type: 'partial',
                feedback: 'Evaluation completed. Please practice more.',
                example: '这是一个很好的回答示例。',
                score: 5,
                grammar_score: 5,
                pronunciation_tips: ''
            };
        }
    }

    /**
     * Translate Chinese text to English (Fallback method)
     * @param {string} chineseText - Chinese text to translate
     * @returns {Promise<string>} Promise that resolves to English translation
     */
    async translateToEnglish(chineseText) {
        if (!this.apiKey || this.apiKey === 'sk-proj-your-openai-api-key-here') {
            throw new Error('OpenAI API key not configured');
        }

        const prompt = `Please translate this Chinese text to English. Provide only the English translation, no additional text or explanations:

"${chineseText}"`;

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional Chinese to English translator. Provide accurate and natural translations.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 100
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            const translation = data.choices[0].message.content.trim();
            
            console.log('OpenAI fallback translation completed:', translation);
            return translation;

        } catch (error) {
            console.error('OpenAI fallback translation request failed:', error);
            throw error;
        }
    }

    /**
     * Test the OpenAI API connection
     * @returns {Promise<boolean>} Promise that resolves to true if connection works
     */
    async testConnection() {
        try {
            const testQuestion = "你叫什么名字？";
            const testAnswer = "我叫小明。";
            
            await this.evaluateAnswer(testQuestion, testAnswer);
            console.log('OpenAI connection test successful');
            return true;
        } catch (error) {
            console.error('OpenAI connection test failed:', error);
            return false;
        }
    }

    /**
     * Check if service is ready
     * @returns {boolean} True if ready to use
     */
    isReady() {
        return !!this.apiKey && this.apiKey !== 'sk-proj-your-openai-api-key-here';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OpenAIService;
} 