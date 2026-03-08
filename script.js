// DOM Elements
const languageScreen = document.getElementById('language-screen');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

const langButtons = document.querySelectorAll('.lang-btn');
const scoreButtons = document.querySelectorAll('.score-btn');
const choiceButtons = document.querySelectorAll('.choice-btn');
const restartBtn = document.getElementById('restart-btn');

const userScoreEl = document.getElementById('user-score');
const compScoreEl = document.getElementById('comp-score');
const maxScoreEl = document.getElementById('max-score');

const userHand = document.querySelector('.player-side .hand i');
const compHand = document.querySelector('.computer-side .hand i');
const playerHandWrapper = document.getElementById('user-hand');
const compHandWrapper = document.getElementById('comp-hand');

const roundResultText = document.getElementById('round-result');
const finalResultTitle = document.getElementById('final-result-title');
const finalResultText = document.getElementById('final-result-text');

// Game State
let currentMaxScore = 3;
let userScore = 0;
let compScore = 0;
let isAnimating = false;
let currentLang = 'en';

const translations = {
    tr: {
        title: "Taş Kağıt Makas", selectLanguage: "Dil Seçin", selectScore: "Kazanma Puanını Seçin", scoreDesc: "Puana ilk ulaşan oyunu kazanır!",
        you: "Sen", goal: "Hedef", computer: "Bilgisayar", makeMove: "Hamleni yap!", itsADraw: "Berabere!", youWinRound: "Bu turu sen kazandın!", compWinsRound: "Bu turu bilgisayar kazandı.",
        youWin: "Kazandın!", youLose: "Kaybettin!", playAgain: "Tekrar Oyna",
        youDefeated: (u, c) => `Bilgisayarı ${u} - ${c} yendin!`, compDefeated: (c, u) => `Bilgisayar seni ${c} - ${u} yendi.`
    },
    en: {
        title: "Rock Paper Scissors", selectLanguage: "Select Language", selectScore: "Select Winning Score", scoreDesc: "First to reach the score wins the game!",
        you: "You", goal: "Goal", computer: "Computer", makeMove: "Make your move!", itsADraw: "It's a draw!", youWinRound: "You win this round!", compWinsRound: "Computer wins this round.",
        youWin: "You Win!", youLose: "You Lose!", playAgain: "Play Again",
        youDefeated: (u, c) => `You defeated the computer ${u} to ${c}!`, compDefeated: (c, u) => `The computer defeated you ${c} to ${u}.`
    },
    de: {
        title: "Schere Stein Papier", selectLanguage: "Sprache wählen", selectScore: "Gewinnpunktzahl wählen", scoreDesc: "Wer zuerst die Punktzahl erreicht, gewinnt!",
        you: "Du", goal: "Ziel", computer: "Computer", makeMove: "Mach deinen Zug!", itsADraw: "Unentschieden!", youWinRound: "Du gewinnst diese Runde!", compWinsRound: "Computer gewinnt diese Runde.",
        youWin: "Du gewinnst!", youLose: "Du verlierst!", playAgain: "Nochmal spielen",
        youDefeated: (u, c) => `Du hast den Computer mit ${u} zu ${c} besiegt!`, compDefeated: (c, u) => `Der Computer hat dich mit ${c} zu ${u} besiegt.`
    },
    fr: {
        title: "Pierre Papier Ciseaux", selectLanguage: "Choisir la langue", selectScore: "Choisir le score gagnant", scoreDesc: "Le premier à atteindre le score gagne !",
        you: "Toi", goal: "But", computer: "Ordinateur", makeMove: "Joue !", itsADraw: "Égalité !", youWinRound: "Tu gagnes cette manche !", compWinsRound: "L'ordinateur gagne cette manche.",
        youWin: "Tu as gagné !", youLose: "Tu as perdu !", playAgain: "Rejouer",
        youDefeated: (u, c) => `Tu as battu l'ordinateur ${u} à ${c} !`, compDefeated: (c, u) => `L'ordinateur t'a battu ${c} à ${u}.`
    },
    it: {
        title: "Sasso Carta Forbici", selectLanguage: "Seleziona la lingua", selectScore: "Seleziona punteggio vincente", scoreDesc: "Il primo a raggiungere il punteggio vince!",
        you: "Tu", goal: "Obiettivo", computer: "Computer", makeMove: "Fai la tua mossa!", itsADraw: "Pareggio!", youWinRound: "Hai vinto questo round!", compWinsRound: "Il computer vince questo round.",
        youWin: "Hai vinto!", youLose: "Hai perso!", playAgain: "Gioca di nuovo",
        youDefeated: (u, c) => `Hai sconfitto il computer ${u} a ${c}!`, compDefeated: (c, u) => `Il computer ti ha sconfitto ${c} a ${u}.`
    },
    es: {
        title: "Piedra Papel Tijera", selectLanguage: "Seleccionar Idioma", selectScore: "Selecciona puntuación ganadora", scoreDesc: "¡El primero en alcanzar la puntuación gana!",
        you: "Tú", goal: "Meta", computer: "Computadora", makeMove: "¡Haz tu movimiento!", itsADraw: "¡Empate!", youWinRound: "¡Ganas esta ronda!", compWinsRound: "La computadora gana esta ronda.",
        youWin: "¡Tú Ganas!", youLose: "¡Tú Pierdes!", playAgain: "Jugar de nuevo",
        youDefeated: (u, c) => `¡Derrotaste a la computadora ${u} a ${c}!`, compDefeated: (c, u) => `La computadora te derrotó ${c} a ${u}.`
    },
    ar: {
        title: "حجر ورق مقص", selectLanguage: "اختر اللغة", selectScore: "اختر نتيجة الفوز", scoreDesc: "أول من يصل إلى النتيجة يفوز!",
        you: "أنت", goal: "الهدف", computer: "الكمبيوتر", makeMove: "قم بحركتك!", itsADraw: "تعادل!", youWinRound: "أنت تفوز بهذه الجولة!", compWinsRound: "الكمبيوتر يفوز بهذه الجولة.",
        youWin: "أنت الفائز!", youLose: "لقد خسرت!", playAgain: "العب مرة أخرى",
        youDefeated: (u, c) => `لقد هزمت الكمبيوتر ${u} مقابل ${c}!`, compDefeated: (c, u) => `لقد هزمك الكمبيوتر ${c} مقابل ${u}.`
    }
};

// Audio Context setup
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playWinSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const duration = 1.0;

    // Play an uplifting major chord sequence
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5

    notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (index * 0.1));

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime + (index * 0.1));
        gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + (index * 0.1) + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + (index * 0.1));
        osc.stop(audioCtx.currentTime + duration);
    });
}

function playLoseSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const duration = 1.0;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + duration);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime + duration - 0.2);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// Icon mappings for FontAwesome
const icons = {
    rock: 'fa-hand-back-fist',
    paper: 'fa-hand',
    scissors: 'fa-hand-scissors'
};

const choices = ['rock', 'paper', 'scissors'];

// Event Listeners
langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        currentLang = btn.getAttribute('data-lang');
        updateLanguageUI();
        languageScreen.classList.remove('active');
        startScreen.classList.add('active');
    });
});

scoreButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        currentMaxScore = parseInt(btn.getAttribute('data-score'));
        startGame();
    });
});

choiceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isAnimating) return;
        playRound(btn.id);
    });
});

restartBtn.addEventListener('click', () => {
    endScreen.classList.add('hidden');
    languageScreen.classList.add('active'); // Return all the way to language selection
    gameScreen.classList.remove('active');
});

// Functions
function updateLanguageUI() {
    const t = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    if (currentLang === 'ar') {
        document.body.style.direction = 'rtl';
    } else {
        document.body.style.direction = 'ltr';
    }
}

function startGame() {
    userScore = 0;
    compScore = 0;
    updateScoreBoard();
    maxScoreEl.textContent = currentMaxScore;

    // Reset hands to rock UI 
    userHand.className = `fa-solid ${icons.rock}`;
    compHand.className = `fa-solid ${icons.rock}`;
    roundResultText.textContent = translations[currentLang].makeMove;
    roundResultText.className = "round-result";

    startScreen.classList.remove('active');
    gameScreen.classList.add('active');
}

function updateScoreBoard() {
    userScoreEl.textContent = userScore;
    compScoreEl.textContent = compScore;
}

function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function playRound(userChoice) {
    isAnimating = true;
    const compChoice = getComputerChoice();

    // Reset hands to rock for animation
    userHand.className = `fa-solid ${icons.rock}`;
    compHand.className = `fa-solid ${icons.rock}`;
    roundResultText.textContent = "...";
    roundResultText.className = "round-result";

    // Add shake animation classes
    playerHandWrapper.classList.add('shake-player');
    compHandWrapper.classList.add('shake-computer');

    // Wait for animation to finish (1.5s as defined in CSS)
    setTimeout(() => {
        // Remove animation classes
        playerHandWrapper.classList.remove('shake-player');
        compHandWrapper.classList.remove('shake-computer');

        // Show selected hands
        userHand.className = `fa-solid ${icons[userChoice]}`;
        compHand.className = `fa-solid ${icons[compChoice]}`;

        determineWinner(userChoice, compChoice);

        isAnimating = false;

        // Check for game end
        if (userScore === currentMaxScore || compScore === currentMaxScore) {
            setTimeout(endGame, 500); // Slight delay before showing end screen
        }
    }, 1500);
}

function determineWinner(user, comp) {
    const t = translations[currentLang];
    if (user === comp) {
        roundResultText.textContent = t.itsADraw;
        roundResultText.className = "round-result draw-color";
        return;
    }

    const userWins =
        (user === 'rock' && comp === 'scissors') ||
        (user === 'paper' && comp === 'rock') ||
        (user === 'scissors' && comp === 'paper');

    if (userWins) {
        userScore++;
        roundResultText.textContent = t.youWinRound;
        roundResultText.className = "round-result win-color";
    } else {
        compScore++;
        roundResultText.textContent = t.compWinsRound;
        roundResultText.className = "round-result lose-color";
    }

    updateScoreBoard();
}

function endGame() {
    // gameScreen is hidden during this since it conflicts with z-index if end screen isn't pure overlay without issues, or we just overlay 
    // it on top anyway. But hiding gameScreen would lose context behind overlay.
    // So we just show the overlay.
    // gameScreen.classList.remove('active'); 
    endScreen.classList.remove('hidden');

    const t = translations[currentLang];

    if (userScore > compScore) {
        finalResultTitle.textContent = t.youWin;
        finalResultTitle.className = "win-color";
        finalResultText.textContent = t.youDefeated(userScore, compScore);

        // Trigger generic custom confetti explosion
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ffffff', '#ef4444', '#a855f7']
            });
        }

        playWinSound();
        const appContainer = document.querySelector('.app-container');
        const modal = document.querySelector('.modal');
        appContainer.classList.add('win-glow');
        modal.classList.add('win-glow');

        setTimeout(() => {
            appContainer.classList.remove('win-glow');
            modal.classList.remove('win-glow');
        }, 1000);
    } else {
        finalResultTitle.textContent = t.youLose;
        finalResultTitle.className = "lose-color";
        finalResultText.textContent = t.compDefeated(compScore, userScore);

        playLoseSound();
        const appContainer = document.querySelector('.app-container');
        const modal = document.querySelector('.modal');
        appContainer.classList.add('screen-shake');
        modal.classList.add('screen-shake');

        setTimeout(() => {
            appContainer.classList.remove('screen-shake');
            modal.classList.remove('screen-shake');
        }, 1000);
    }
}
