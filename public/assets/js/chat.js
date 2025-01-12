// Constants
const API_URL = 'https://backend-llms.azurewebsites.net/api/chat_completion';
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');

// Initialize chat state
let isWaitingForResponse = false;

// Event Listeners
chatInput.addEventListener('keypress', handleKeyPress);
sendButton.addEventListener('click', handleSendMessage);

// Handle enter key press
function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
}

// Create and append a message element
function createMessageElement(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;

    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';
    headerDiv.textContent = isUser ? 'Usuário' : 'Assistente';

    const contentDiv = document.createElement('div');
    contentDiv.textContent = content;

    messageDiv.appendChild(headerDiv);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Auto scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Extract message from API response
function extractMessage(data) {
    // Se for um array com pelo menos um elemento
    if (Array.isArray(data) && data.length > 0) {
        // Pega o primeiro elemento e extrai o generated_text
        return data[0].generated_text || 'Sem resposta';
    }
    return 'Formato de resposta inválido';
}

// Handle sending messages
async function handleSendMessage() {
    const message = chatInput.value.trim();

    if (message === '' || isWaitingForResponse) return;

    try {
        // Disable input while waiting for response
        isWaitingForResponse = true;
        sendButton.disabled = true;
        chatInput.disabled = true;

        // Add user message to chat
        createMessageElement(message, true);
        chatInput.value = '';

        // Prepare request
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                prompt: message,
                max_length: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get and display assistant response
        const data = await response.json();
        const messageText = extractMessage(data);
        createMessageElement(messageText);

    } catch (error) {
        console.error('Erro:', error);
        createMessageElement('Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.');
    } finally {
        // Re-enable input
        isWaitingForResponse = false;
        sendButton.disabled = false;
        chatInput.disabled = false;
        chatInput.focus();
    }
}

// Auto-resize textarea
chatInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';

    // Limit maximum height
    const maxHeight = 150;
    if (this.scrollHeight > maxHeight) {
        this.style.height = maxHeight + 'px';
        this.style.overflowY = 'auto';
    } else {
        this.style.overflowY = 'hidden';
    }
});

// Initialize chat
document.addEventListener('DOMContentLoaded', function () {
    chatInput.focus();
});