/**
 * Chinese Question Practice App
 * Main Application Controller
 */

class ChinesePracticeApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.isListening = false;
        this.isProcessing = false;
        this.recognition = null;
        this.synthesis = null;
        this.elevenLabsService = null;
        this.openaiService = null;
        this.googleTranslationService = null;
        
        // Load settings from configuration
        this.settings = window.config ? window.config.getSettings() : {
            speechRate: 0.8,
            voiceId: 'BrbEfHMQu0fyclQR7lfh',
            elevenLabsApiKey: '', // Must be set via environment variable
            openaiApiKey: '', // Must be set via environment variable
            googleCloudApiKey: '', // Must be set via environment variable
            stability: 0.5,
            similarityBoost: 0.8,
            useElevenLabs: true
        };
        
        this.init();
    }

    init() {
        this.initializeSpeechRecognition();
        this.initializeSpeechSynthesis();
        this.initializeElevenLabs();
        this.initializeOpenAI();
        this.initializeGoogleTranslation();
        this.bindEvents();
        this.loadSettings();
        this.updateUI();
    }

    // Speech Recognition Initialization
    initializeSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            this.showError('Your browser does not support speech recognition. Please use Chrome, Edge, or Safari browser.');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'zh-CN';
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateListeningUI();
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.handleAnswer(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.updateListeningUI();
            
            if (event.error === 'no-speech') {
                this.showError('No speech detected, please try again.');
            } else if (event.error === 'network') {
                this.showError('Network error, please check your connection.');
            } else {
                this.showError(`Speech recognition error: ${event.error}`);
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateListeningUI();
        };
    }

    // Speech Synthesis Initialization
    initializeSpeechSynthesis() {
        if (!window.speechSynthesis) {
            this.showError('Your browser does not support speech synthesis.');
            return;
        }

        this.synthesis = window.speechSynthesis;
    }

    // ElevenLabs Service Initialization
    initializeElevenLabs() {
        if (typeof ElevenLabsService !== 'undefined') {
            this.elevenLabsService = new ElevenLabsService();
            this.elevenLabsService.setCallbacks(
                () => {
                    console.log('ElevenLabs audio ready');
                    // You can add additional logic here when audio is ready
                },
                (error) => {
                    console.error('ElevenLabs error:', error);
                    this.showError(`ElevenLabs error: ${error}`);
                }
            );
            console.log('ElevenLabs service initialized');
            
            // Test the connection
            this.elevenLabsService.testConnection().then(success => {
                if (success) {
                    console.log('ElevenLabs connection test passed');
                } else {
                    console.warn('ElevenLabs connection test failed');
                }
            });
        } else {
            console.warn('ElevenLabs service not available');
        }
    }

    // OpenAI Service Initialization
    initializeOpenAI() {
        if (typeof OpenAIService !== 'undefined') {
            this.openaiService = new OpenAIService();
            this.openaiService.init(this.settings.openaiApiKey);
            console.log('OpenAI service initialized');
            
            // Test the connection
            this.openaiService.testConnection().then(success => {
                if (success) {
                    console.log('OpenAI connection test passed');
                } else {
                    console.warn('OpenAI connection test failed - check API key');
                }
            });
        } else {
            console.warn('OpenAI service not available');
        }
    }

    // Google Translation Service Initialization
    initializeGoogleTranslation() {
        if (typeof GoogleTranslationService !== 'undefined') {
            this.googleTranslationService = new GoogleTranslationService();
            this.googleTranslationService.init(this.settings.googleCloudApiKey);
            console.log('Google Translation service initialized');
            
            // Test the connection
            this.googleTranslationService.testConnection().then(success => {
                if (success) {
                    console.log('Google Translation connection test passed');
                } else {
                    console.warn('Google Translation connection test failed - check API key');
                }
            });
        } else {
            console.warn('Google Translation service not available');
        }
    }

    // Event Binding
    bindEvents() {
        // Setup phase events
        document.getElementById('questions-input').addEventListener('input', (e) => {
            this.validateQuestions(e.target.value);
        });

        document.getElementById('start-practice').addEventListener('click', () => {
            this.startPractice();
        });

        document.getElementById('clear-questions').addEventListener('click', () => {
            this.clearQuestions();
        });

        // Practice phase events
        document.getElementById('play-question').addEventListener('click', () => {
            this.playCurrentQuestion();
        });

        document.getElementById('translate-question').addEventListener('click', () => {
            this.translateCurrentQuestion();
        });

        document.getElementById('next-question').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('start-listening').addEventListener('click', () => {
            this.startListening();
        });

        document.getElementById('stop-listening').addEventListener('click', () => {
            this.stopListening();
        });

        // Evaluation events
        document.getElementById('try-again').addEventListener('click', () => {
            this.tryAgain();
        });

        document.getElementById('continue-practice').addEventListener('click', () => {
            this.continuePractice();
        });



        // Error handling
        document.getElementById('close-error').addEventListener('click', () => {
            this.hideError();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    // Question Management
    validateQuestions(input) {
        const lines = input.trim().split('\n').filter(line => line.trim());
        const startButton = document.getElementById('start-practice');
        
        if (lines.length >= 1) {
            this.questions = lines;
            startButton.disabled = false;
        } else {
            this.questions = [];
            startButton.disabled = true;
        }
    }

    clearQuestions() {
        document.getElementById('questions-input').value = '';
        this.questions = [];
        document.getElementById('start-practice').disabled = true;
    }

    startPractice() {
        if (this.questions.length === 0) {
            this.showError('Please enter at least one question first.');
            return;
        }

        // Fisher-Yates shuffle implementation
        this.shuffleQuestions();
        
        this.currentQuestionIndex = 0;
        this.showPracticeSection();
        this.displayCurrentQuestion();
        this.updateProgress();
    }

    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    displayCurrentQuestion() {
        const questionElement = document.getElementById('current-question');
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        questionElement.textContent = currentQuestion;
        
        // Hide any previous translation
        document.getElementById('translation-display').classList.add('hidden');
        
        // Auto-play the question with ElevenLabs
        setTimeout(async () => {
            await this.playCurrentQuestion();
        }, 1000); // Slightly longer delay to ensure ElevenLabs is ready
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayCurrentQuestion();
            this.updateProgress();
            this.resetAnswerSection();
        } else {
            this.showPracticeComplete();
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const currentNumber = document.getElementById('current-question-number');
        const totalNumber = document.getElementById('total-questions');
        
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        progressFill.style.width = `${progress}%`;
        currentNumber.textContent = this.currentQuestionIndex + 1;
        totalNumber.textContent = this.questions.length;
    }

    // Speech Functions
    async playCurrentQuestion() {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        // Always try ElevenLabs first since we have the API key
        if (this.elevenLabsService && this.settings.elevenLabsApiKey) {
            try {
                console.log('Playing question with ElevenLabs:', currentQuestion);
                await this.playWithElevenLabs(currentQuestion);
                return;
            } catch (error) {
                console.error('ElevenLabs failed, falling back to browser TTS:', error);
                this.showError('ElevenLabs TTS failed, using browser TTS instead.');
                // Fall back to browser TTS
            }
        }
        
        // Fallback to browser speech synthesis
        console.log('Playing question with browser TTS:', currentQuestion);
        this.playWithBrowserTTS(currentQuestion);
    }

    async playWithElevenLabs(text) {
        if (!this.elevenLabsService || !this.settings.elevenLabsApiKey) {
            throw new Error('ElevenLabs not configured');
        }

        try {
            // Initialize ElevenLabs service
            this.elevenLabsService.init(this.settings.elevenLabsApiKey, this.settings.voiceId);
            
            // Speak using REST API
            await this.elevenLabsService.speak(text, {
                stability: this.settings.stability,
                similarity_boost: this.settings.similarityBoost
            });
            
            console.log('ElevenLabs TTS completed successfully');
        } catch (error) {
            console.error('ElevenLabs TTS error:', error);
            throw error;
        }
    }

    playWithBrowserTTS(text) {
        if (!this.synthesis) {
            this.showError('Speech synthesis is not available.');
            return;
        }

        // Stop any ongoing speech
        this.synthesis.cancel();

        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = this.settings.speechRate;
        
        // Use browser's default Chinese voice
        const voices = this.synthesis.getVoices();
        const chineseVoice = voices.find(voice => 
            voice.lang.includes('zh') || voice.lang.includes('cmn')
        );
        
        if (chineseVoice) {
            utterance.voice = chineseVoice;
        }

        this.synthesis.speak(utterance);
    }

    async translateCurrentQuestion() {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const translationDisplay = document.getElementById('translation-display');
        const questionTranslation = document.getElementById('question-translation');
        
        // Show loading state
        questionTranslation.textContent = 'Translating...';
        translationDisplay.classList.remove('hidden');
        
        try {
            if (this.googleTranslationService && this.googleTranslationService.isReady()) {
                console.log('Translating question with Google Cloud Translation:', currentQuestion);
                const translation = await this.googleTranslationService.translateToEnglish(currentQuestion);
                questionTranslation.textContent = translation;
            } else if (this.openaiService && this.openaiService.isReady()) {
                // Fallback to OpenAI if Google Translation is not available
                console.log('Falling back to OpenAI translation:', currentQuestion);
                const translation = await this.openaiService.translateToEnglish(currentQuestion);
                questionTranslation.textContent = translation;
            } else {
                // Fallback translation using simple mapping
                const fallbackTranslation = this.fallbackTranslation(currentQuestion);
                questionTranslation.textContent = fallbackTranslation;
            }
        } catch (error) {
            console.error('Translation failed:', error);
            this.showError('Translation failed. Please try again.');
            // Hide translation display on error
            translationDisplay.classList.add('hidden');
        }
    }

    fallbackTranslation(chineseText) {
        // Simple fallback translation for common questions
        const translations = {
            '你叫什么名字？': 'What is your name?',
            '你住在哪里？': 'Where do you live?',
            '你喜欢什么运动？': 'What sports do you like?',
            '今天天气怎么样？': 'How is the weather today?',
            '你几岁了？': 'How old are you?',
            '你是做什么工作的？': 'What do you do for work?',
            '你会说中文吗？': 'Do you speak Chinese?',
            '你来自哪里？': 'Where are you from?',
            '你喜欢吃什么？': 'What do you like to eat?',
            '你周末做什么？': 'What do you do on weekends?'
        };
        
        return translations[chineseText] || 'Translation not available';
    }

    startListening() {
        if (!this.recognition) {
            this.showError('Speech recognition is not available.');
            return;
        }

        if (this.isListening) {
            return;
        }

        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.showError('Error starting speech recognition.');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    // Answer Processing
    async handleAnswer(transcript) {
        this.isProcessing = true;
        this.updateProcessingUI();
        
        // Display the user's answer
        this.showUserAnswer(transcript);
        
        try {
            // Evaluate the answer using ChatGPT
            const evaluation = await this.evaluateAnswer(transcript);
            this.showEvaluation(evaluation);
        } catch (error) {
            console.error('Evaluation error:', error);
            this.showError('Error during evaluation, please try again.');
            this.isProcessing = false;
            this.updateProcessingUI();
        }
    }

    async evaluateAnswer(userAnswer) {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        // Use real OpenAI ChatGPT evaluation
        if (this.openaiService && this.openaiService.isReady()) {
            try {
                console.log('Evaluating answer with OpenAI:', {
                    question: currentQuestion,
                    answer: userAnswer
                });
                
                const evaluation = await this.openaiService.evaluateAnswer(currentQuestion, userAnswer);
                return evaluation;
            } catch (error) {
                console.error('OpenAI evaluation failed:', error);
                this.showError('AI evaluation failed, using fallback evaluation.');
                // Fall back to simple evaluation
                return this.fallbackEvaluation(currentQuestion, userAnswer);
            }
        } else {
            console.warn('OpenAI service not available, using fallback evaluation');
            return this.fallbackEvaluation(currentQuestion, userAnswer);
        }
    }

    fallbackEvaluation(question, answer) {
        // Simple fallback evaluation when OpenAI is not available
        const answerLength = answer.length;
        const hasKeywords = this.checkKeywords(question, answer);
        const isComplete = answerLength > 5;
        
        let evaluation;
        
        if (isComplete && hasKeywords) {
            evaluation = {
                type: 'good',
                feedback: 'Good answer! Your grammar and vocabulary are appropriate.',
                example: this.generateExampleAnswer(question),
                score: 8,
                grammar_score: 8,
                pronunciation_tips: 'Practice speaking slowly and clearly.'
            };
        } else if (isComplete || hasKeywords) {
            evaluation = {
                type: 'partial',
                feedback: 'Your answer is mostly correct. Try to use more complete sentences.',
                example: this.generateExampleAnswer(question),
                score: 6,
                grammar_score: 6,
                pronunciation_tips: 'Focus on pronunciation of key words.'
            };
        } else {
            evaluation = {
                type: 'poor',
                feedback: 'Keep practicing! Try to answer with complete sentences.',
                example: this.generateExampleAnswer(question),
                score: 4,
                grammar_score: 4,
                pronunciation_tips: 'Practice basic vocabulary and sentence structure.'
            };
        }
        
        return evaluation;
    }

    checkKeywords(question, answer) {
        // Simple keyword matching for fallback
        const questionKeywords = this.extractKeywords(question);
        const answerKeywords = this.extractKeywords(answer);
        
        return questionKeywords.some(keyword => 
            answerKeywords.includes(keyword)
        );
    }

    extractKeywords(text) {
        // Simple keyword extraction for fallback
        const commonKeywords = ['什么', '哪里', '怎么', '为什么', '什么时候', '谁', '哪个'];
        return commonKeywords.filter(keyword => text.includes(keyword));
    }

    generateExampleAnswer(question) {
        // Generate example answers based on question patterns
        const examples = {
            '你叫什么名字': '我叫张三。',
            '你住在哪里': '我住在北京。',
            '你喜欢什么': '我喜欢运动。',
            '今天天气怎么样': '今天天气很好。',
            '你几岁了': '我25岁了。',
            '你是做什么工作的': '我是学生。'
        };
        
        for (const [pattern, example] of Object.entries(examples)) {
            if (question.includes(pattern)) {
                return example;
            }
        }
        
        return '这是一个很好的回答示例。';
    }

    // UI Updates
    showPracticeSection() {
        document.getElementById('setup-section').classList.add('hidden');
        document.getElementById('practice-section').classList.remove('hidden');
    }

    showUserAnswer(answer) {
        const answerDisplay = document.getElementById('answer-display');
        const userAnswer = document.getElementById('user-answer');
        
        userAnswer.textContent = answer;
        answerDisplay.classList.remove('hidden');
    }

    showEvaluation(evaluation) {
        this.isProcessing = false;
        this.updateProcessingUI();
        
        const evaluationSection = document.getElementById('evaluation-section');
        const evaluationBadge = document.getElementById('evaluation-badge');
        const evaluationFeedback = document.getElementById('evaluation-feedback');
        const exampleAnswer = document.getElementById('example-answer');
        const exampleText = document.getElementById('example-text');
        
        // Set badge with score if available
        let badgeText = evaluation.type === 'good' ? '✓ Excellent' : 
                       evaluation.type === 'partial' ? '⚠ Good' : '✗ Needs Work';
        
        if (evaluation.score) {
            badgeText += ` (${evaluation.score}/10)`;
        }
        
        evaluationBadge.textContent = badgeText;
        evaluationBadge.className = `evaluation-badge ${evaluation.type}`;
        
        // Set feedback with additional details
        let feedbackText = evaluation.feedback;
        
        if (evaluation.grammar_score) {
            feedbackText += `\n\nGrammar Score: ${evaluation.grammar_score}/10`;
        }
        
        if (evaluation.pronunciation_tips) {
            feedbackText += `\n\nPronunciation Tips: ${evaluation.pronunciation_tips}`;
        }
        
        evaluationFeedback.textContent = feedbackText;
        
        // Set example answer
        if (evaluation.example) {
            exampleText.textContent = evaluation.example;
            exampleAnswer.classList.remove('hidden');
        } else {
            exampleAnswer.classList.add('hidden');
        }
        
        evaluationSection.classList.remove('hidden');
    }

    resetAnswerSection() {
        document.getElementById('answer-display').classList.add('hidden');
        document.getElementById('evaluation-section').classList.add('hidden');
        document.getElementById('user-answer').textContent = '';
    }

    updateListeningUI() {
        const listeningIndicator = document.getElementById('listening-indicator');
        const startButton = document.getElementById('start-listening');
        const stopButton = document.getElementById('stop-listening');
        
        if (this.isListening) {
            listeningIndicator.classList.remove('hidden');
            startButton.classList.add('hidden');
            stopButton.classList.remove('hidden');
        } else {
            listeningIndicator.classList.add('hidden');
            startButton.classList.remove('hidden');
            stopButton.classList.add('hidden');
        }
    }

    updateProcessingUI() {
        const processingIndicator = document.getElementById('processing-indicator');
        
        if (this.isProcessing) {
            processingIndicator.classList.remove('hidden');
        } else {
            processingIndicator.classList.add('hidden');
        }
    }

    tryAgain() {
        this.resetAnswerSection();
        this.startListening();
    }

    continuePractice() {
        this.nextQuestion();
    }

    showPracticeComplete() {
        this.showError('Congratulations! You have completed all practice questions.');
        setTimeout(() => {
            this.showSetupSection();
        }, 3000);
    }

    showSetupSection() {
        document.getElementById('practice-section').classList.add('hidden');
        document.getElementById('setup-section').classList.remove('hidden');
    }



    loadSettings() {
        // Use default settings - no need to load from localStorage
        console.log('Using default settings:', {
            useElevenLabs: this.settings.useElevenLabs,
            hasElevenLabsApiKey: !!this.settings.elevenLabsApiKey,
            hasOpenAIApiKey: !!this.settings.openaiApiKey && this.settings.openaiApiKey !== 'sk-proj-your-openai-api-key-here',
            voiceId: this.settings.voiceId
        });
    }

    // Error Handling
    showError(message) {
        const errorContainer = document.getElementById('error-container');
        const errorText = document.getElementById('error-text');
        
        errorText.textContent = message;
        errorContainer.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        document.getElementById('error-container').classList.add('hidden');
    }

    // Keyboard Shortcuts
    handleKeyboardShortcuts(event) {
        // Only handle shortcuts when in practice mode
        if (document.getElementById('practice-section').classList.contains('hidden')) {
            return;
        }

        switch (event.key) {
            case ' ': // Spacebar to start/stop listening
                event.preventDefault();
                if (this.isListening) {
                    this.stopListening();
                } else {
                    this.startListening();
                }
                break;
            case 'ArrowRight': // Right arrow for next question
                event.preventDefault();
                this.nextQuestion();
                break;
            case 'p': // 'p' key to play question
            case 'P':
                event.preventDefault();
                this.playCurrentQuestion();
                break;
        }
    }

    // Utility Functions
    updateUI() {
        // Initial UI state
        document.getElementById('start-practice').disabled = true;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChinesePracticeApp();
});

// Handle speech synthesis voices loading
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        // Voices are now available
        console.log('Speech synthesis voices loaded');
    };
} 