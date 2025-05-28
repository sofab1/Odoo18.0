/** @odoo-module **/

import { Component, useState, onMounted, useRef } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

export class AIAssistant extends Component {
    static template = "AIAssistant";

    setup() {
        this.orm = useService("orm");
        this.chatContainer = useRef("chatContainer");
        this.messageInput = useRef("messageInput");

        this.state = useState({
            messages: [],
            inputText: "",
            isTyping: false
        });

        onMounted(() => {
            this.initializeChat();
        });
    }

    initializeChat() {
        // Welcome message
        this.addMessage({
            type: 'ai',
            text: '👋 Hello! I\'m your AI Dashboard Assistant. I can help you analyze your business data, generate insights, and answer questions about your dashboards.',
            time: this.getCurrentTime(),
            suggestions: [
                'Show me sales summary',
                'What are my top products?',
                'Analyze my performance',
                'Generate insights'
            ]
        });
    }

    addMessage(message) {
        this.state.messages.push(message);
        setTimeout(() => {
            this.scrollToBottom();
        }, 100);
    }

    scrollToBottom() {
        if (this.chatContainer.el) {
            this.chatContainer.el.scrollTop = this.chatContainer.el.scrollHeight;
        }
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    onKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendUserMessage();
        }
    }

    sendUserMessage() {
        if (!this.state.inputText.trim() || this.state.isTyping) return;

        const userMessage = this.state.inputText.trim();
        this.sendMessage(userMessage);
    }

    async sendMessage(message) {
        // Add user message
        this.addMessage({
            type: 'user',
            text: message,
            time: this.getCurrentTime()
        });

        this.state.inputText = "";
        this.state.isTyping = true;

        try {
            // Simulate AI processing
            await this.processAIResponse(message);
        } catch (error) {
            console.error('Error processing AI response:', error);
            this.addMessage({
                type: 'ai',
                text: '❌ Sorry, I encountered an error processing your request. Please try again.',
                time: this.getCurrentTime()
            });
        } finally {
            this.state.isTyping = false;
        }
    }

    async processAIResponse(userMessage) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        let response = '';
        let suggestions = [];

        // Simple AI logic based on keywords
        const message = userMessage.toLowerCase();

        if (message.includes('sales') || message.includes('revenue')) {
            response = '📊 Based on your current data:\n\n• Total Revenue: €125,430.50 (+15% vs last month)\n• Orders: 47 (+8 new orders)\n• Average Order Value: €2,668.31\n• Top performing day: Thursday\n\nYour sales are trending upward! Consider focusing on Thursday\'s successful strategies.';
            suggestions = ['Show sales by product', 'Analyze sales trends', 'Export sales report'];

        } else if (message.includes('product') || message.includes('top')) {
            response = '🏆 Your top performing products:\n\n1. Electronics Product 1 - 45 units sold\n2. Clothing Product 2 - 32 units sold\n3. Books Product 3 - 28 units sold\n4. Home & Garden Product 1 - 22 units sold\n5. Sports Product 2 - 18 units sold\n\nElectronics are your best sellers! Consider expanding this category.';
            suggestions = ['Analyze product trends', 'Show inventory levels', 'Suggest reorders'];

        } else if (message.includes('performance') || message.includes('analyze')) {
            response = '📈 Performance Analysis:\n\n• Sales Performance: 85% (Excellent)\n• Product Diversity: 78% (Good)\n• Stock Management: 92% (Outstanding)\n• Order Processing: 65% (Needs improvement)\n• Quality Score: 88% (Very good)\n• Customer Satisfaction: 94% (Excellent)\n\nRecommendation: Focus on improving order processing efficiency.';
            suggestions = ['Improve order processing', 'Show detailed metrics', 'Generate action plan'];

        } else if (message.includes('insight') || message.includes('generate')) {
            response = '💡 AI-Generated Insights:\n\n🔍 Key Findings:\n• Your sales peak on Thursdays - consider special Thursday promotions\n• Electronics category has 40% higher profit margins\n• Stock turnover is optimal for 80% of products\n• Customer retention rate is above industry average\n\n🎯 Recommendations:\n• Increase electronics inventory by 20%\n• Implement Thursday flash sales\n• Review slow-moving stock in Toys category';
            suggestions = ['Implement recommendations', 'Show detailed analysis', 'Export insights'];

        } else {
            response = '🤔 I understand you\'re asking about: "' + userMessage + '"\n\nI can help you with:\n• Sales and revenue analysis\n• Product performance insights\n• Business performance metrics\n• Data-driven recommendations\n\nCould you be more specific about what you\'d like to know?';
            suggestions = ['Show sales data', 'Analyze products', 'Performance metrics', 'Generate insights'];
        }

        this.addMessage({
            type: 'ai',
            text: response,
            time: this.getCurrentTime(),
            suggestions: suggestions
        });
    }

    clearChat() {
        this.state.messages = [];
        this.initializeChat();
    }

    showHelp() {
        this.addMessage({
            type: 'ai',
            text: '❓ How to use the AI Assistant:\n\n• Ask questions about your business data\n• Request sales summaries and insights\n• Get product performance analysis\n• Generate recommendations\n• Use quick action buttons for common queries\n\nExample questions:\n• "How are my sales performing?"\n• "What are my best selling products?"\n• "Give me business insights"\n• "Analyze my dashboard data"',
            time: this.getCurrentTime(),
            suggestions: ['Show sales summary', 'Analyze performance', 'Generate insights']
        });
    }
}

registry.category("actions").add("analytics_ai_assistant", AIAssistant);