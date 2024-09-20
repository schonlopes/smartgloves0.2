var ws = new WebSocket("ws://192.168.0.200:81/");
var statusElement = document.getElementById("status");
var messageElement = document.getElementById("message");
var voiceSelect = document.getElementById("voice");
var toggleSoundButton = document.getElementById("toggle-sound");

var soundEnabled = false; // O som começa desativado
var activeMessages = [];

// Função para tocar o som correspondente
function playSound(sensor) {
  if (soundEnabled) { // Verifica se o som está ativado
    var selectedVoice = voiceSelect.value;
    var soundPath = `Sons/${selectedVoice}/${sensor}.mp3`;
    var audio = new Audio(soundPath);
    audio.play();
  }
}

// Função para mostrar a mensagem por 10 segundos
function showMessage(sensor, text) {
  if (!activeMessages.includes(sensor)) {
    activeMessages.push(sensor);
    messageElement.innerText = text;
    playSound(sensor);

    setTimeout(function() {
      messageElement.innerText = '';
      activeMessages = activeMessages.filter(function(item) { return item !== sensor; });
    }, 10000);
  }
}

// Lógica para o botão de Ativar/Desativar som
toggleSoundButton.addEventListener("click", function() {
  soundEnabled = !soundEnabled; // Alterna o estado do som

  // Atualiza o texto do botão
  toggleSoundButton.innerText = soundEnabled ? "Desativar Som" : "Ativar Som";
});

// Quando a conexão for estabelecida
ws.onopen = function() {
  statusElement.innerText = "Conectado";
  statusElement.classList.remove("disconnected");
  statusElement.classList.add("connected");
};

// Quando a conexão for encerrada
ws.onclose = function() {
  statusElement.innerText = "Desconectado";
  statusElement.classList.remove("connected");
  statusElement.classList.add("disconnected");
};

// Quando receber dados do servidor
ws.onmessage = function(event) {
  var sensorValues = event.data.split(",");
  document.getElementById("sensor1").innerText = "Sensor 1: " + sensorValues[0];
  document.getElementById("sensor2").innerText = "Sensor 2: " + sensorValues[1];
  document.getElementById("sensor3").innerText = "Sensor 3: " + sensorValues[2];
  document.getElementById("sensor4").innerText = "Sensor 4: " + sensorValues[3];
  document.getElementById("sensor5").innerText = "Sensor 5: " + sensorValues[4];

  // Exibe as mensagens baseadas nos valores dos sensores
  if (parseInt(sensorValues[0]) < 400) {
    showMessage("1", "Estou com SEDE");
  }
  if (parseInt(sensorValues[1]) < 400) {
    showMessage("2", "Estou com FOME");
  }
  if (parseInt(sensorValues[2]) < 400) {
    showMessage("3", "Preciso ir ao BANHEIRO");
  }
  if (parseInt(sensorValues[3]) < 400) {
    showMessage("4", "Sinto DOR");
  }
  if (parseInt(sensorValues[4]) < 400) {
    showMessage("5", "EU TE AMO");
  }
};

// Se houver erro
ws.onerror = function(error) {
  console.log("Erro de WebSocket: ", error);
};
