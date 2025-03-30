import config from './config.js';
import i18n from './i18n.js';

class AIPlayground {
    constructor() {
        this.elements = {
            chatContainer: null,
            messagesList: null,
            userInput: null,
            sendButton: null,
            processingIndicator: null
        };
        
        /* @tweakable maximum number of messages to display in the chat */
        this.maxMessagesToShow = 10;
        
        /* @tweakable speed of the typing animation in milliseconds */
        this.typingAnimationSpeed = 30;
        
        /* @tweakable the style of AI responses (helpful, creative, professional, etc.) */
        this.aiResponseStyle = "helpful"; 
        
        /* @tweakable path to the AI avatar image */
        this.aiAvatarUrl = "img/logo.svg";
        
        /* @tweakable path to the user avatar image */
        this.userAvatarUrl = "img/avatar-1.svg";
        
        /* @tweakable delay before the AI starts processing in milliseconds */
        this.typingDelay = 1000;
        
        this.conversationHistory = [];
        this.isProcessing = false;
    }

    init() {
        this.getElements();
        this.addEventListeners();
        this.displayWelcomeMessage();
    }

    getElements() {
        this.elements.chatContainer = document.getElementById('chat-container');
        this.elements.messagesList = document.getElementById('messages-list');
        this.elements.userInput = document.getElementById('user-input');
        this.elements.sendButton = document.getElementById('send-button');
        this.elements.processingIndicator = document.getElementById('processing-indicator');
    }

    addEventListeners() {
        this.elements.sendButton.addEventListener('click', () => this.sendMessage());
        this.elements.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    displayWelcomeMessage() {
        const welcomeMessage = {
            role: 'assistant',
            content: i18n.getTranslation('aiPlayground.welcomeMessage') || 'Hello! I\'m your AI assistant. How can I help you today?'
        };
        this.addMessageToUI(welcomeMessage);
    }

    sendMessage() {
        if (this.isProcessing) return;
        
        const userInput = this.elements.userInput.value.trim();
        if (!userInput) return;

        const userMessage = {
            role: 'user',
            content: userInput
        };
        this.addMessageToUI(userMessage);
        this.conversationHistory.push(userMessage);
        
        this.elements.userInput.value = '';
        
        this.isProcessing = true;
        this.elements.processingIndicator.style.display = 'block';
        
        setTimeout(() => this.processUserMessage(userInput), this.typingDelay);
    }

    async processUserMessage(userInput) {
        try {
            // Store current conversation history
            let currentHistory = [...this.conversationHistory];
            // Only send the last 10 messages to limit context size
            currentHistory = currentHistory.slice(-10);

            // Call language model
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful AI assistant that specializes in ${this.aiResponseStyle} text analysis. 
                                 Provide concise, insightful analysis of the user's text, highlighting key patterns, 
                                 tone improvements, and suggesting enhancements.`
                    },
                    ...currentHistory
                ],
            });

            const aiResponse = {
                role: 'assistant',
                content: completion.content
            };
            
            this.conversationHistory.push(aiResponse);
            
            if (this.conversationHistory.length > this.maxMessagesToShow * 2) {
                this.conversationHistory = this.conversationHistory.slice(-this.maxMessagesToShow * 2);
            }
            
            this.addMessageToUI(aiResponse, true);
        } catch (error) {
            console.error("Error processing message:", error);
            // Fallback to predefined responses if API call fails
            const aiResponses = [
                "That's an interesting text. I can identify several patterns in your writing style that could be enhanced.",
                "Based on my analysis, here are some key insights about your text.",
                "I've processed your request and here's what I found in your writing.",
                "Let me enhance that text for you. Here's an improved version with better clarity and structure.",
                "I've analyzed your input and have some suggestions for improvement."
            ];
            
            const randomIndex = Math.floor(Math.random() * aiResponses.length);
            const aiResponse = {
                role: 'assistant',
                content: aiResponses[randomIndex]
            };
            
            this.conversationHistory.push(aiResponse);
            this.addMessageToUI(aiResponse, true);
        } finally {
            this.elements.processingIndicator.style.display = 'none';
            this.isProcessing = false;
        }
    }

    addMessageToUI(message, withAnimation = false) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.role}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.innerHTML = `<img src="${message.role === 'assistant' ? this.aiAvatarUrl : this.userAvatarUrl}" alt="${message.role} avatar">`;
        
        const content = document.createElement('div');
        content.className = 'content';
        
        if (withAnimation) {
            content.textContent = '';
            this.animateTyping(content, message.content);
        } else {
            content.textContent = message.content;
        }
        
        messageEl.appendChild(avatar);
        messageEl.appendChild(content);
        
        this.elements.messagesList.appendChild(messageEl);
        this.elements.messagesList.scrollTop = this.elements.messagesList.scrollHeight;
    }

    animateTyping(element, text) {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                this.elements.messagesList.scrollTop = this.elements.messagesList.scrollHeight;
            } else {
                clearInterval(interval);
            }
        }, this.typingAnimationSpeed);
    }
}

export default new AIPlayground();