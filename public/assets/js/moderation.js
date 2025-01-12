document.addEventListener('DOMContentLoaded', function () {
    // Verificar se os elementos existem
    const textInput = document.getElementById('moderation-input');
    const moderateButton = document.getElementById('moderation-button');
    const resultDiv = document.getElementById('moderation-result');
    const positiveWordsDiv = document.getElementById('positive-words');
    const negativeWordsDiv = document.getElementById('negative-words');

    // Log para debug dos elementos
    console.log('Elementos encontrados:', {
        textInput,
        moderateButton,
        resultDiv,
        positiveWordsDiv,
        negativeWordsDiv
    });

    if (!textInput || !moderateButton || !resultDiv || !positiveWordsDiv || !negativeWordsDiv) {
        console.error('Alguns elementos não foram encontrados no DOM');
        return;
    }

    moderateButton.addEventListener('click', async function () {
        console.log('Botão clicado'); // Debug

        if (!textInput.value.trim()) {
            alert('Por favor, insira um texto para moderação.');
            return;
        }

        // Limpar resultados anteriores
        resultDiv.innerHTML = 'Analisando texto...';
        moderateButton.disabled = true;
        resultDiv.style.borderLeft = 'none';
        positiveWordsDiv.innerHTML = '';
        negativeWordsDiv.innerHTML = '';

        try {
            console.log('Enviando requisição...'); // Debug
            const response = await fetch('https://backend-llms.azurewebsites.net/api/moderations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: textInput.value.trim()
                })
            });

            if (!response.ok) {
                throw new Error(`Erro na resposta da API: ${response.status}`);
            }

            const data = await response.json();
            console.log('Resposta da API:', data);

            if (data && Array.isArray(data) && data[0]) {
                let positiveScore = 0;
                let negativeScore = 0;

                data[0].forEach(item => {
                    if (typeof item === 'object' && item.label) {
                        if (item.label === 'POSITIVE') {
                            positiveScore = item.score;
                        } else if (item.label === 'NEGATIVE') {
                            negativeScore = item.score;
                        }
                    }
                });

                const positivePercentage = (positiveScore * 100).toFixed(2);
                const negativePercentage = (negativeScore * 100).toFixed(2);

                console.log('Scores calculados:', { positivePercentage, negativePercentage }); // Debug

                // Limpar o div de resultado
                resultDiv.innerHTML = '';

                // Atualizar divs com os resultados
                const positiveHTML = `
                    <h4>Positivo:</h4>
                    <p>${positivePercentage}%</p>
                `;
                positiveWordsDiv.innerHTML = positiveHTML;
                console.log('HTML positivo:', positiveHTML); // Debug

                const negativeHTML = `
                    <h4>Negativo:</h4>
                    <p>${negativePercentage}%</p>
                `;
                negativeWordsDiv.innerHTML = negativeHTML;
                console.log('HTML negativo:', negativeHTML); // Debug

                // Adicionar borda indicativa
                if (positiveScore > negativeScore) {
                    resultDiv.style.borderLeft = '4px solid #4CAF50';
                } else {
                    resultDiv.style.borderLeft = '4px solid #F44336';
                }
            } else {
                throw new Error('Formato de resposta inválido');
            }

        } catch (error) {
            console.error('Erro completo:', error);
            resultDiv.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Erro ao analisar texto. Por favor, tente novamente. (${error.message})
                </div>
            `;
        } finally {
            moderateButton.disabled = false;
        }
    });

    textInput.addEventListener('input', function () {
        resultDiv.innerHTML = '';
        resultDiv.style.borderLeft = 'none';
        positiveWordsDiv.innerHTML = '';
        negativeWordsDiv.innerHTML = '';
    });

    // Log inicial para confirmar que o script foi carregado
    console.log('Script de moderação inicializado');
});