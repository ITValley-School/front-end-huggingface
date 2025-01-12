// import BASE_API_URL from "./config.js";

// const embedButton = document.getElementById("embed-button");
// const textInput = document.getElementById("text-input");
// const embeddingResult = document.getElementById("embedding-result");

// embedButton.addEventListener("click", async () => {
//   const text = textInput.value;

//   if (!text.trim()) {
//     alert("Por favor, insira um texto.");
//     return;
//   }

//   embeddingResult.innerHTML = "Carregando...";

//   try {
//     const response = await fetch(`${BASE_API_URL}/api/embeddings`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text }),
//     });

//     if (!response.ok) throw new Error("Erro ao obter embeddings.");

//     const data = await response.json();
//     embeddingResult.innerHTML = `<strong>Embeddings:</strong> ${JSON.stringify(data.embeddings, null, 2)}`;
//   } catch (error) {
//     embeddingResult.innerHTML = `<span class="text-danger">${error.message}</span>`;
//   }
// });

const textInput = document.getElementById('text-input');
        const embedButton = document.getElementById('embed-button');
        const resultContainer = document.getElementById('embedding-result');
        const loading = document.getElementById('loading');

        embedButton.addEventListener('click', async () => {
            const text = textInput.value.trim();
            if (!text) return;

            // Mostrar loading
            loading.style.display = 'block';
            resultContainer.style.display = 'none';

            // Aqui você faria a chamada para sua API de embeddings
            // Simulando uma resposta
            setTimeout(() => {
                loading.style.display = 'none';
                resultContainer.style.display = 'block';
                
                // Exemplo de resultado formatado
                const mockEmbedding = Array(5).fill(0).map(() => Math.random().toFixed(6));
                resultContainer.querySelector('pre').textContent = 
                    JSON.stringify({ embedding: mockEmbedding }, null, 2);
            }, 1500);
        });