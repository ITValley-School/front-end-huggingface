import BASE_API_URL from "./config.js";

const uploadButton = document.getElementById("stt-button");
const audioInput = document.getElementById("audio-input");
const transcriptionResult = document.getElementById("transcription-result");

uploadButton.addEventListener("click", async () => {
  const audioFile = audioInput.files[0];

  if (!audioFile) {
    alert("Por favor, selecione um arquivo de áudio.");
    return;
  }

  transcriptionResult.innerHTML = "Transcrevendo...";

  const formData = new FormData();
  formData.append("audio", audioFile);

  try {
    const response = await fetch(`${BASE_API_URL}/api/speech-to-text`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Erro ao transcrever o áudio.");

    const data = await response.json();
    transcriptionResult.innerHTML = `<strong>Transcrição:</strong> ${data.transcription}`;
  } catch (error) {
    transcriptionResult.innerHTML = `<span class="text-danger">${error.message}</span>`;
  }
});