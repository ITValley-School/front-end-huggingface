document.addEventListener('DOMContentLoaded', function () {
  const textInput = document.getElementById('tts-input');
  const srcLangSelect = document.getElementById('src-lang');
  const tgtLangSelect = document.getElementById('tgt-lang');
  const translateButton = document.getElementById('tts-button');
  const responseBox = document.getElementById('audio-player');

  translateButton.addEventListener('click', async function () {
    // Verificar se há texto para traduzir
    if (!textInput.value.trim()) {
      alert('Por favor, insira um texto para traduzir.');
      return;
    }

    // Mostrar loading
    responseBox.innerHTML = 'Traduzindo...';
    translateButton.disabled = true;

    try {
      const response = await fetch('https://backend-llms.azurewebsites.net/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textInput.value.trim(),
          src_lang: srcLangSelect.value,
          tgt_lang: tgtLangSelect.value
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Verificar se a resposta contém a tradução
      if (data && data[0] && data[0].translation_text) {
        responseBox.innerHTML = `
                    <div class="mt-3">
                        <h4>Tradução:</h4>
                        <p>${data[0].translation_text}</p>
                    </div>
                `;
      } else {
        throw new Error('Formato de resposta inválido');
      }

    } catch (error) {
      console.error('Erro:', error);
      responseBox.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Erro ao traduzir texto. Por favor, tente novamente.
                </div>
            `;
    } finally {
      translateButton.disabled = false;
    }
  });

  // Limpar a resposta quando o texto de entrada for alterado
  textInput.addEventListener('input', function () {
    responseBox.innerHTML = '';
  });

  // Limpar a resposta quando mudar o idioma
  srcLangSelect.addEventListener('change', function () {
    responseBox.innerHTML = '';
  });

  tgtLangSelect.addEventListener('change', function () {
    responseBox.innerHTML = '';
  });
});