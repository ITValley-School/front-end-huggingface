// Constants
const API_URL = 'https://backend-llms.azurewebsites.net/api/image';
const promptInput = document.querySelector('.prompt-input');
const generateButton = document.querySelector('.generate-button');
const imageContainer = document.querySelector('.image-container');
const placeholderText = document.querySelector('.placeholder-text');
const loadingIndicator = document.querySelector('.loading');
const generatedImage = document.querySelector('.generated-image');

// Track generation state
let isGenerating = false;

// Event Listeners
promptInput.addEventListener('keypress', handleKeyPress);
generateButton.addEventListener('click', handleGenerateImage);

// Handle enter key press
function handleKeyPress(e) {
    if (e.key === 'Enter' && !isGenerating) {
        handleGenerateImage();
    }
}

// Show/hide UI elements
function updateUIState(state) {
    switch (state) {
        case 'loading':
            placeholderText.style.display = 'none';
            loadingIndicator.style.display = 'block';
            generatedImage.style.display = 'none';
            promptInput.disabled = true;
            generateButton.disabled = true;
            break;
        case 'success':
            placeholderText.style.display = 'none';
            loadingIndicator.style.display = 'none';
            generatedImage.style.display = 'block';
            promptInput.disabled = false;
            generateButton.disabled = false;
            break;
        case 'error':
            placeholderText.style.display = 'block';
            placeholderText.textContent = 'Erro ao gerar imagem. Por favor, tente novamente.';
            loadingIndicator.style.display = 'none';
            generatedImage.style.display = 'none';
            promptInput.disabled = false;
            generateButton.disabled = false;
            break;
        default:
            placeholderText.style.display = 'block';
            loadingIndicator.style.display = 'none';
            generatedImage.style.display = 'none';
            promptInput.disabled = false;
            generateButton.disabled = false;
    }
}

// Handle image generation
async function handleGenerateImage() {
    const prompt = promptInput.value.trim();

    if (prompt === '' || isGenerating) return;

    try {
        isGenerating = true;
        updateUIState('loading');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Resposta da API:', data); // Debug da resposta

        if (data.image_data) {
            // Verifica se é uma URL base64
            if (data.image_data.startsWith('data:image')) {
                generatedImage.src = data.image_data;
            }
            // Verifica se é uma string base64 pura
            else if (data.image_data.match(/^[A-Za-z0-9+/=]+$/)) {
                generatedImage.src = 'data:image/png;base64,' + data.image_data;
            }
            // Verifica se é uma URL
            else if (data.image_data.startsWith('http')) {
                generatedImage.src = data.image_data;
            } else {
                console.error('Formato de imagem desconhecido:', data.image_data.substring(0, 100)); // Debug do início dos dados
                throw new Error('Formato de imagem não suportado');
            }

            // Aguarda o carregamento da imagem
            await new Promise((resolve, reject) => {
                generatedImage.onload = resolve;
                generatedImage.onerror = () => {
                    console.error('Erro ao carregar imagem. Dados recebidos:', {
                        message: data.message,
                        imageDataType: typeof data.image_data,
                        imageDataLength: data.image_data ? data.image_data.length : 0,
                        imageDataPreview: data.image_data ? data.image_data.substring(0, 100) : null
                    });
                    reject(new Error('Falha ao carregar imagem'));
                };
            });

            updateUIState('success');
        } else {
            console.error('Dados da resposta:', data); // Debug dos dados completos
            throw new Error('Dados da imagem não encontrados na resposta');
        }

    } catch (error) {
        console.error('Erro completo:', error);
        updateUIState('error');
    } finally {
        isGenerating = false;
    }
}

// Reset UI on load
document.addEventListener('DOMContentLoaded', () => {
    updateUIState('initial');
    promptInput.focus();
});

// Handle image error
generatedImage.addEventListener('error', (e) => {
    console.error('Erro no elemento de imagem:', e);
    updateUIState('error');
});