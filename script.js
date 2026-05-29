// Variáveis de Estado do Jogo
let producao = 50;
let sustentabilidade = 50;
let colheita = 0;
let gameInterval = null;
let eventInterval = null;
let activeEvent = null;
let isPlaying = false;

// Banco de Eventos Desafiadores (Equilíbrio do Agro)
const eventos = [
    {
        id: "agua",
        text: "🚨 Ondas de calor aumentando a evaporação! Acione o gotejamento precision.",
        damageProd: 3,
        damageSust: 1
    },
    {
        id: "adubo",
        text: "🚨 Solo da estufa perdendo nutrientes essenciais. Use adubação orgânica.",
        damageProd: 2,
        damageSust: 2
    },
    {
        id: "praga",
        text: "🚨 Alerta de mosca-branca detectado nos tomateiros! Use controle biológico.",
        damageProd: 4,
        damageSust: 0
    }
];

// Iniciar o Jogo
function startGame() {
    if (isPlaying) return;
    isPlaying = true;
    document.getElementById('btn-start').classList.add('hidden');
    toggleButtons(false);
    
    // Ciclo de atualização de status (Cada 1 segundo)
    gameInterval = setInterval(() => {
        // Se houver evento ativo não resolvido, causa penalidades maiores
        if (activeEvent) {
            producao -= activeEvent.damageProd;
            sustentabilidade -= activeEvent.damageSust;
        } else {
            // Desgaste natural do tempo
            producao -= 0.5;
            sustentabilidade -= 0.5;
            
            // Se estiver tudo equilibrado, gera tomates de alta qualidade!
            if (producao > 40 && sustentabilidade > 40) {
                colheita += 1.5;
            }
        }

        // Garante limites entre 0 e 100
        producao = Math.max(0, Math.min(100, producao));
        sustentabilidade = Math.max(0, Math.min(100, sustentabilidade));
        colheita = Math.min(100, colheita);

        updateUI();
        checkGameStatus();
    }, 1000);

    // Ciclo gerador de crises/eventos (Cada 5 segundos)
    eventInterval = setInterval(() => {
        if (!activeEvent) {
            const randomIndex = Math.floor(Math.random() * eventos.length);
            activeEvent = eventos[randomIndex];
            const alertBox = document.getElementById('alert-box');
            alertBox.innerText = activeEvent.text;
            alertBox.className = "alert warning";
        }
    }, 5000);
}

// Atualizar Interface de Usuário (UI)
function updateUI() {
    // Barras e Textos
    document.getElementById('prod-val').innerText = Math.floor(producao);
    document.getElementById('prod-bar').style.width = producao + "%";
    
    document.getElementById('sust-val').innerText = Math.floor(sustentabilidade);
    document.getElementById('sust-bar').style.width = sustentabilidade + "%";
    
    document.getElementById('score').innerText = Math.floor(colheita);
    document.getElementById('game-progress').style.width = colheita + "%";

    // Evolução Visual do Tomate baseado na colheita
    const tomatoStage = document.getElementById('tomato-stage');
    if (colheita < 25) {
        tomatoStage.innerText = "🌱";
    } else if (colheita < 50) {
        tomatoStage.innerText = "🌿";
    } else if (colheita < 75) {
        tomatoStage.innerText = "🌸";
    } else {
        tomatoStage.innerText = "🍅";
    }
}

// Trata os cliques de ações sustentáveis do jogador
function handleAction(actionType) {
    if (!isPlaying) return;

    if (activeEvent && activeEvent.id === actionType) {
        // Se respondeu ao evento correto: bônus de equilíbrio!
        producao += 12;
        sustentabilidade += 12;
        colheita += 5; // Bônus na colheita por manejo correto
        activeEvent = null;
        
        const alertBox = document.getElementById('alert-box');
        alertBox.innerText = "✅ Excelente escolha! Prática sustentável aplicada com sucesso.";
        alertBox.className = "alert success";
    } else {
        // Ação preventiva corriqueira (sem crise ativa)
        if (actionType === 'agua') { producao += 5; sustentabilidade += 1; }
        if (actionType === 'adubo') { producao += 4; sustentabilidade += 3; }
        if (actionType === 'praga') { producao += 3; sustentabilidade += 4; }
    }

    // Limita o teto
    producao = Math.min(100, producao);
    sustentabilidade = Math.min(100, sustentabilidade);
    updateUI();
}

// Checar Condições de Vitória ou Derrota
function checkGameStatus() {
    const modal = document.getElementById('game-over-screen');
    const title = document.getElementById('game-over-title');
    const msg = document.getElementById('game-over-msg');

    if (colheita >= 100) {
        endGame();
        title.innerText = "🏆 Vitória Sustentável!";
        msg.innerText = "Parabéns! Você alcançou a meta de 100kg de tomates de alta qualidade demonstrando que o Agro Forte anda de mãos dadas com a preservação do meio ambiente!";
        modal.classList.remove('hidden');
    } else if (producao <= 0) {
        endGame();
        title.innerText = "📉 Falha na Produção";
        msg.innerText = "A estufa perdeu eficiência produtiva e os tomateiros murcharam. Lembre-se de balancear os cuidados de manejo!";
        modal.classList.remove('hidden');
    } else if (sustentabilidade <= 0) {
        endGame();
        title.innerText = "❌ Impacto Ambiental Crítico";
        msg.innerText = "Os recursos naturais foram esgotados ou poluídos por falta de manejos sustentáveis. O futuro do agro exige equilíbrio!";
        modal.classList.remove('hidden');
    }
}

// Finalizar loops de jogo
function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(eventInterval);
    toggleButtons(true);
}

// Ligar/Desligar botões
function toggleButtons(disabledValue) {
    document.getElementById('btn-water').disabled = disabledValue;
    document.getElementById('btn-fertilize').disabled = disabledValue;
    document.getElementById('btn-pest').disabled = disabledValue;
}

// Reiniciar Tudo
function resetGame() {
    producao = 50;
    sustentabilidade = 50;
    colheita = 0;
    activeEvent = null;
    
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('btn-start').classList.remove('hidden');
    
    const alertBox = document.getElementById('alert-box');
    alertBox.innerText = "Estufa preparada. Clique em iniciar!";
    alertBox.className = "alert neutral";
    
    updateUI();
}