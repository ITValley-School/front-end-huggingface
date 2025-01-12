import BASE_API_URL from "./config.js";

const fineTuneButton = document.getElementById("fine-tune-button");
const datasetInput = document.getElementById("fine-tune-data");
const fineTuneResult = document.getElementById("fine-tune-result");

fineTuneButton.addEventListener("click", async () => {
  const datasetFile = datasetInput.files[0];

  if (!datasetFile) {
    alert("Por favor, selecione um arquivo de conjunto de dados.");
    return;
  }

  fineTuneResult.innerHTML = "Treinando modelo...";

  const formData = new FormData();
  formData.append("dataset", datasetFile);

  try {
    const response = await fetch(`${BASE_API_URL}/api/fine-tuning`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Erro ao ajustar o modelo.");

    const data = await response.json();
    fineTuneResult.innerHTML = `
      <strong>Status:</strong> ${data.status} <br>
      <strong>ID do Modelo:</strong> ${data.model_id || "N/A"}
    `;
  } catch (error) {
    fineTuneResult.innerHTML = `<span class="text-danger">${error.message}</span>`;
  }
});