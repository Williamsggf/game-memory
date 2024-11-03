const state = {
    view: {
        game: document.querySelector('.game'),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector('#score'),
        level: document.querySelector('#level'),
    },
    values: {
        currentTime: 180,
        score: 0,
        level: 1,
        pontAcert: 1,
        timer: null
    }
};

const allEmojis = [
    "😘", "😃", "😎", "😨", "😡", "🤢", "🤪", "😵", "😇", "🥳",
    "😋", "😐", "😴", "🥶", "😤", "😈", "💩", "🤡", "😷", "🤑",
    "🤥", "🤧", "🤯", "🤫", "😪", "🤔", "🤖", "👻", "🎃", "😺",
    "❤️", "😍", "😁", "🤩", "👽", "🙀", "🙊", "🦝", "🦒", "🐺",
    "🐰", "🐨", "🐼", "🐼", "🦄", "🐲", "🐻‍❄️", "🦧", "🐘", "🦏",
    "🦥", "🐊", "🍕", "🌭", "🍔", "🍦", "🥐", "🍘", "🍙", "🍲",
];

// Função para criar e exibir o modal de início
function createStartModal() {
    // Remove o modal anterior, se existir
    const existingModal = document.getElementById('start-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Cria o modal
    const modal = document.createElement('div');
    modal.id = 'start-modal';
    modal.className = 'modal';

    // Cria o conteúdo do modal
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Define a mensagem personalizada para cada nível
    const title = document.createElement('h2');
    const paragraph = document.createElement('p');
    title.textContent = `Você está no Nível ${state.values.level}`;
    paragraph.textContent = `Você tem ${(Math.max(30, 180 - (state.values.level - 1) * 30))} segundos para completar este nível.`;

    // Botão para iniciar o jogo
    const startButton = document.createElement('button');
    startButton.id = 'start-button';
    startButton.textContent = `Iniciar partida`;

    // Adiciona os elementos ao modalContent
    modalContent.appendChild(title);
    modalContent.appendChild(paragraph);
    modalContent.appendChild(startButton);

    // Adiciona o modalContent ao modal principal
    modal.appendChild(modalContent);

    // Adiciona o modal ao body do documento
    document.body.appendChild(modal);

    // Associa o clique do botão de iniciar
    startButton.onclick = () => {
        modal.style.display = "none"; // Esconde o modal
        startTimer();
    };
    resetGame();
}

// Função para iniciar o jogo com modal
function startGame() {
    createStartModal(); // Cria e exibe o modal
}

// Função para resetar o jogo
function resetGame() {
    state.values.currentTime = Math.max(30, 180 - (state.values.level - 1) * 30);
    state.values.pontAcert = 1 + state.values.level;
    state.view.level.textContent = state.values.level;
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = Math.floor(state.values.score); // Garantir números inteiros
    state.view.game.innerHTML = ''; // Limpa o jogo para reiniciar
    sortEmojis();
}

// Contador de tempo regressivo
function startTimer() {
    state.values.timer = setInterval(countDown, 1000);
}

function countDown() {
    if (state.values.currentTime > 0) {
        state.values.currentTime--;
        state.view.timeLeft.textContent = state.values.currentTime;
    } else {
        clearInterval(state.values.timer);
        modalGameOver()
    }
}

// Função para embaralhar o array de emojis
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Seleciona 8 emojis aleatórios e duplica-os para criar pares
function sortEmojis() {
    let selectedEmojis = shuffleArray(allEmojis).slice(0, 8);
    let gameEmojis = shuffleArray([...selectedEmojis, ...selectedEmojis]);

    if (state.view.game) {
        gameEmojis.forEach(emoji => {
            let box = document.createElement("div");
            box.className = "item";
            box.innerHTML = emoji;
            box.onclick = handleClick;
            state.view.game.appendChild(box);
        });
    }
}

// Array para armazenar os cartões abertos atualmente
let openCards = [];

// Função de clique para abrir os cartões
function handleClick() {
    if (this.classList.contains("boxOpen") || this.classList.contains("boxMatch")) {
        return;
    }

    if (openCards.length < 2) {
        this.classList.add("boxOpen");
        openCards.push(this);
    }

    if (openCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

// Função para verificar se os cartões abertos correspondem
function checkMatch() {
    if (openCards[0].innerHTML === openCards[1].innerHTML) {
        openCards[0].classList.add("boxMatch");
        openCards[1].classList.add("boxMatch");

        state.values.score += state.values.pontAcert;
        state.values.pontAcert++;
        state.view.score.textContent = Math.floor(state.values.score);

    } else {
        openCards[0].classList.remove("boxOpen");
        openCards[1].classList.remove("boxOpen");
    }
    openCards = [];

    if (document.querySelectorAll(".boxMatch").length === document.querySelectorAll(".item").length) {
        clearInterval(state.values.timer);
        //alert(`Nível ${state.values.level} concluído em ${180 - state.values.currentTime} segundos!`);
        state.values.level++;
        startGame();
    }
}


// Função para exibir modal ao término do jogo e solicitar o nome do jogador
function modalGameOver() {
    const modal = document.createElement('div');
    modal.id = 'game-over-modal';
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const title = document.createElement('h2');
    title.textContent = 'Seu tempo acabou';

    const paragraph = document.createElement('p');
    paragraph.textContent = `Você chegou ao Nível ${state.values.level} e conseguiu ${Math.floor(state.values.score)} pontos!`;

    const inputLabel = document.createElement('label');
    inputLabel.textContent = "Digite seu nome para salvar sua pontuação:";

    const playerNameInput = document.createElement('input');
    playerNameInput.type = 'text';
    playerNameInput.id = 'player-name-input';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Salvar Pontuação';
    saveButton.onclick = () => {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            saveScore(playerName, state.values.level, state.values.score);
            modal.style.display = "none"; // Fecha o modal
        }
    };

    modalContent.appendChild(title);
    modalContent.appendChild(paragraph);
    modalContent.appendChild(inputLabel);
    modalContent.appendChild(playerNameInput);
    modalContent.appendChild(saveButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}


// Função para salvar a pontuação do jogador
function saveScore(nome, level, score) {
    const scoreData = { nome, level, score };

    fetch('https://app-gestao-backend.vercel.app/auth/RscoresGM', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao salvar a pontuação');
        return response.json();
    })
    .then(data => {
        alert("Pontuação salva com sucesso!");
        displayScores(); // Atualiza a lista de pontuações
    })
    .catch(error => console.error('Erro ao salvar a pontuação:', error));
}


// Exibe a lista de pontuações
function displayScores() {
    fetch('https://app-gestao-backend.vercel.app/auth/CscoresGM')
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro na resposta da rede.");
            }
            return response.json();
        })
        .then(data => {
            const scoresTableBody = document.getElementById("scores-table").querySelector("tbody");
            scoresTableBody.innerHTML = ""; // Limpa o conteúdo atual do tbody

            // Verifica se a resposta contém uma lista de pontuações
            if (Array.isArray(data.scores) && data.scores.length > 0) {
                data.scores.forEach(score => {
                    // Cria uma nova linha de tabela
                    const row = document.createElement("tr");

                    // Cria e insere as células de nome, nível e pontuação
                    const nameCell = document.createElement("td");
                    nameCell.textContent = score.nome;

                    const levelCell = document.createElement("td");
                    levelCell.textContent = score.level;

                    const scoreCell = document.createElement("td");
                    scoreCell.textContent = score.score;

                    // Adiciona as células à linha
                    row.appendChild(nameCell);
                    row.appendChild(levelCell);
                    row.appendChild(scoreCell);

                    // Adiciona a linha ao corpo da tabela
                    scoresTableBody.appendChild(row);
                });
            } else {
                console.error("Nenhuma pontuação disponível:", data);
                scoresTableBody.innerHTML = "<tr><td colspan='3'>Nenhuma pontuação encontrada.</td></tr>";
            }
        })
        .catch(error => console.error('Erro ao carregar as pontuações:', error));
}

// Chama a função para carregar as pontuações quando a página carregar
window.addEventListener('load', displayScores);

// Função para resetar o jogo com confirmação
function createResetModal() {
    if (state.values.score > 0) {
        const modal = document.createElement('div');
        modal.id = 'reset-modal';
        modal.className = 'modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const message = document.createElement('p');
        message.textContent = "Você tem uma pontuação atual. Tem certeza de que deseja reiniciar e perder os pontos?";

        const confirmButton = document.createElement('button');
        confirmButton.textContent = "Sim";
        confirmButton.onclick = () => {
            modal.style.display = "none";
            window.location.reload(); // Reinicia o jogo
        };

        const cancelButton = document.createElement('button');
        cancelButton.textContent = "Não";
        cancelButton.onclick = () => {
            modal.style.display = "none"; // Fecha o modal
        };

        modalContent.appendChild(message);
        modalContent.appendChild(confirmButton);
        modalContent.appendChild(cancelButton);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    } else {
        window.location.reload(); // Reinicia o jogo diretamente se a pontuação for zero
    }
}

// Função para resetar o jogo
function buttonReset() {
    createResetModal();
}


// Função para iniciar o jogo com modal
function startGame() {
    createStartModal(); // Cria e exibe o modal
}

// Inicia o modal e o primeiro nível
startGame();