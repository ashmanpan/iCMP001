// AI Chat Agent Component for Cisco CMP Portal
// Uses AWS Lambda with Anthropic Claude on Bedrock

const LAMBDA_ENDPOINT = 'YOUR_LAMBDA_API_GATEWAY_ENDPOINT'; // Will be set after deployment

class AIChatAgent {
    constructor(containerId, role, tenantId = null) {
        this.container = document.getElementById(containerId);
        this.role = role;
        this.tenantId = tenantId;
        this.messages = [];
        this.isOpen = false;

        this.init();
    }

    init() {
        // Create chat widget HTML
        const chatHTML = `
            <div class="ai-chat-widget" id="aiChatWidget">
                <button class="ai-chat-toggle" id="aiChatToggle" onclick="aiAgent.toggle()">
                    <i class="fas fa-robot"></i>
                    <span class="chat-notification" id="chatNotification" style="display: none;">1</span>
                </button>

                <div class="ai-chat-panel" id="aiChatPanel">
                    <div class="ai-chat-header">
                        <div class="ai-chat-title">
                            <i class="fas fa-robot"></i>
                            <span>Cisco AI Assistant</span>
                        </div>
                        <button class="ai-chat-minimize" onclick="aiAgent.toggle()">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>

                    <div class="ai-chat-messages" id="aiChatMessages">
                        <div class="ai-message">
                            <div class="ai-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="ai-message-content">
                                <p>Hello! I'm your Cisco CMP AI Assistant. I can help you with:</p>
                                <ul>
                                    <li>Creating and managing tenants</li>
                                    <li>Allocating and deallocating GPUs</li>
                                    <li>Enabling services</li>
                                    <li>Viewing usage and billing information</li>
                                    <li>Answering questions about the platform</li>
                                </ul>
                                <p>How can I assist you today?</p>
                            </div>
                        </div>
                    </div>

                    <div class="ai-chat-input">
                        <textarea
                            id="aiChatInput"
                            placeholder="Ask me anything or tell me what to do..."
                            rows="2"
                        ></textarea>
                        <button class="ai-chat-send" onclick="aiAgent.sendMessage()" id="aiChatSend">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>

                    <div class="ai-chat-quick-actions">
                        <button class="quick-action-btn" onclick="aiAgent.quickAction('Show me all tenants')">
                            <i class="fas fa-users"></i> Show Tenants
                        </button>
                        <button class="quick-action-btn" onclick="aiAgent.quickAction('Show GPU availability')">
                            <i class="fas fa-microchip"></i> GPU Status
                        </button>
                        <button class="quick-action-btn" onclick="aiAgent.quickAction('Show consumption rates')">
                            <i class="fas fa-chart-bar"></i> Usage Stats
                        </button>
                    </div>
                </div>
            </div>

            <style>
                .ai-chat-widget {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    z-index: 1000;
                }

                .ai-chat-toggle {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--cisco-blue-light) 0%, var(--cisco-blue) 100%);
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(4, 159, 217, 0.4);
                    transition: all 0.3s;
                    position: relative;
                }

                .ai-chat-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 16px rgba(4, 159, 217, 0.6);
                }

                .chat-notification {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: var(--accent-red);
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: bold;
                }

                .ai-chat-panel {
                    display: none;
                    position: fixed;
                    bottom: 100px;
                    right: 2rem;
                    width: 400px;
                    max-height: 600px;
                    background: var(--bg-card);
                    border: 1px solid var(--border-cisco);
                    border-radius: 16px;
                    box-shadow: var(--shadow-lg);
                    flex-direction: column;
                }

                .ai-chat-panel.open {
                    display: flex;
                }

                .ai-chat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border-bottom: 1px solid var(--border-accent);
                    background: var(--bg-elevated);
                    border-radius: 16px 16px 0 0;
                }

                .ai-chat-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--cisco-blue);
                    font-weight: 600;
                }

                .ai-chat-minimize {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 0.5rem;
                }

                .ai-chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    max-height: 400px;
                }

                .ai-message,
                .user-message {
                    display: flex;
                    gap: 0.75rem;
                    animation: slideIn 0.3s ease;
                }

                .user-message {
                    flex-direction: row-reverse;
                }

                .ai-avatar,
                .user-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .ai-avatar {
                    background: linear-gradient(135deg, var(--cisco-blue-light) 0%, var(--cisco-blue) 100%);
                    color: white;
                }

                .user-avatar {
                    background: var(--bg-elevated);
                    color: var(--text-muted);
                }

                .ai-message-content,
                .user-message-content {
                    background: var(--bg-elevated);
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    max-width: 280px;
                    line-height: 1.5;
                }

                .user-message-content {
                    background: var(--cisco-blue);
                    color: white;
                }

                .ai-message-content ul {
                    margin: 0.5rem 0;
                    padding-left: 1.5rem;
                }

                .ai-message-content li {
                    margin: 0.25rem 0;
                }

                .ai-chat-input {
                    display: flex;
                    padding: 1rem;
                    border-top: 1px solid var(--border-accent);
                    gap: 0.5rem;
                }

                #aiChatInput {
                    flex: 1;
                    background: var(--bg-elevated);
                    border: 1px solid var(--border-accent);
                    border-radius: 8px;
                    padding: 0.75rem;
                    color: var(--text-secondary);
                    resize: none;
                    font-family: inherit;
                    font-size: 0.875rem;
                }

                #aiChatInput:focus {
                    outline: none;
                    border-color: var(--cisco-blue);
                }

                .ai-chat-send {
                    background: var(--cisco-blue);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .ai-chat-send:hover {
                    background: var(--cisco-blue-dark);
                }

                .ai-chat-send:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .ai-chat-quick-actions {
                    display: flex;
                    gap: 0.5rem;
                    padding: 0 1rem 1rem;
                    flex-wrap: wrap;
                }

                .quick-action-btn {
                    background: var(--bg-elevated);
                    border: 1px solid var(--border-accent);
                    color: var(--text-secondary);
                    padding: 0.5rem 0.75rem;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .quick-action-btn:hover {
                    border-color: var(--cisco-blue);
                    color: var(--cisco-blue);
                }

                .typing-indicator {
                    display: flex;
                    gap: 0.25rem;
                    padding: 0.5rem 0;
                }

                .typing-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--cisco-blue);
                    animation: typing 1.4s infinite;
                }

                .typing-dot:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .typing-dot:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes typing {
                    0%, 60%, 100% {
                        opacity: 0.3;
                        transform: translateY(0);
                    }
                    30% {
                        opacity: 1;
                        transform: translateY(-4px);
                    }
                }

                @media (max-width: 768px) {
                    .ai-chat-panel {
                        width: calc(100vw - 2rem);
                        right: 1rem;
                    }
                }
            </style>
        `;

        this.container.innerHTML = chatHTML;

        // Add enter key handler
        document.getElementById('aiChatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById('aiChatPanel');
        panel.classList.toggle('open');

        if (this.isOpen) {
            document.getElementById('aiChatInput').focus();
            document.getElementById('chatNotification').style.display = 'none';
        }
    }

    async sendMessage() {
        const input = document.getElementById('aiChatInput');
        const message = input.value.trim();

        if (!message) return;

        // Add user message to chat
        this.addMessage('user', message);
        input.value = '';

        // Show typing indicator
        this.showTyping();

        try {
            // Call Lambda function
            const response = await this.callLambda(message);

            // Remove typing indicator
            this.hideTyping();

            // Add AI response
            this.addMessage('ai', response.response);

            // If there was an action executed, show result
            if (response.action_result) {
                this.handleActionResult(response.action_result);
            }

        } catch (error) {
            this.hideTyping();
            this.addMessage('ai', 'I apologize, but I encountered an error. Please try again.');
            console.error('Error:', error);
        }
    }

    async callLambda(message) {
        // Call the Lambda function via API Gateway
        const response = await fetch(LAMBDA_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                user_email: sessionStorage.getItem('email'),
                role: this.role,
                tenant_id: this.tenantId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to get AI response');
        }

        return await response.json();
    }

    addMessage(type, content) {
        const messagesContainer = document.getElementById('aiChatMessages');

        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'ai' ? 'ai-message' : 'user-message';

        const avatar = document.createElement('div');
        avatar.className = type === 'ai' ? 'ai-avatar' : 'user-avatar';
        avatar.innerHTML = `<i class="fas fa-${type === 'ai' ? 'robot' : 'user'}"></i>`;

        const contentDiv = document.createElement('div');
        contentDiv.className = type === 'ai' ? 'ai-message-content' : 'user-message-content';

        // Parse markdown-like content
        contentDiv.innerHTML = this.parseContent(content);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    parseContent(content) {
        // Simple parsing for lists and formatting
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    showTyping() {
        const messagesContainer = document.getElementById('aiChatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'ai-message';
        typingDiv.innerHTML = `
            <div class="ai-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="ai-message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    quickAction(message) {
        document.getElementById('aiChatInput').value = message;
        this.sendMessage();
    }

    handleActionResult(result) {
        if (result.success) {
            // Show success message
            this.addMessage('ai', '✓ Action completed successfully! The changes have been applied.');

            // Refresh the page data if needed
            if (typeof loadOverview === 'function') loadOverview();
            if (typeof loadTenantsList === 'function') loadTenantsList();
            if (typeof loadGPUs === 'function') loadGPUs();
        } else {
            this.addMessage('ai', `⚠️ There was an issue: ${result.error}`);
        }
    }
}

// Initialize AI agent (will be called from each dashboard)
let aiAgent;

function initAIAgent(role, tenantId = null) {
    // Create container if it doesn't exist
    if (!document.getElementById('aiChatContainer')) {
        const container = document.createElement('div');
        container.id = 'aiChatContainer';
        document.body.appendChild(container);
    }

    aiAgent = new AIChatAgent('aiChatContainer', role, tenantId);
}
