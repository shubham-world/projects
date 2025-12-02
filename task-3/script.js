// ============================================
// GLOBAL VARIABLES & INITIALIZATION
// ============================================

// Quiz Configuration
const quizQuestions = [
    {
        question: "What does CSS stand for?",
        answers: {
            a: "Computer Style Sheets",
            b: "Cascading Style Sheets",
            c: "Creative Style System",
            d: "Colorful Style Sheets"
        },
        correct: "b",
        hint: "Think about how styles cascade in web design"
    },
    {
        question: "Which HTML tag is used for JavaScript?",
        answers: {
            a: "<js>",
            b: "<script>",
            c: "<javascript>",
            d: "<code>"
        },
        correct: "b",
        hint: "Look for the tag that contains scripts"
    },
    {
        question: "Which symbol is used for IDs in CSS?",
        answers: {
            a: ".",
            b: "#",
            c: "@",
            d: "$"
        },
        correct: "b",
        hint: "It's also called a hash or pound symbol"
    },
    {
        question: "Which of these is NOT a JavaScript framework?",
        answers: {
            a: "React",
            b: "Angular",
            c: "Laravel",
            d: "Vue"
        },
        correct: "c",
        hint: "One of these is a PHP framework"
    },
    {
        question: "What does API stand for?",
        answers: {
            a: "Application Programming Interface",
            b: "Advanced Programming Interface",
            c: "Application Process Integration",
            d: "Automated Programming Interface"
        },
        correct: "a",
        hint: "Think about interfaces between applications"
    },
    {
        question: "Which method converts JSON string to object?",
        answers: {
            a: "JSON.parse()",
            b: "JSON.stringify()",
            c: "JSON.toObject()",
            d: "JSON.convert()"
        },
        correct: "a",
        hint: "You parse strings to understand them"
    },
    {
        question: "What is the result of: typeof null?",
        answers: {
            a: "null",
            b: "undefined",
            c: "object",
            d: "string"
        },
        correct: "c",
        hint: "This is a famous JavaScript quirk"
    }
];

// Joke API Configuration
const JOKE_API_URL = "https://v2.jokeapi.dev/joke/";
const categories = {
    'Any': 'Any',
    'Programming': 'Programming',
    'Pun': 'Pun',
    'Dark': 'Dark',
    'Misc': 'Misc',
    'Spooky': 'Spooky',
    'Christmas': 'Christmas'
};

// App State
let currentQuestionIndex = 0;
let quizScore = 0;
let correctStreak = 0;
let timer = null;
let timeLeft = 30;
let jokeCount = 0;
let savedJokes = [];
let currentJoke = null;
let currentCategory = 'Any';
let isAutoJokeEnabled = false;
let autoJokeInterval = null;
let jokeRatings = {};

// DOM Elements
const quizTimer = document.getElementById('quiz-timer');
const timeLeftElement = document.getElementById('time-left');
const currentScoreElement = document.getElementById('current-score');
const totalQuestionsElement = document.getElementById('total-questions');
const jokeCountElement = document.getElementById('joke-count');
const streakElement = document.getElementById('streak');

// Sound Elements
const laughSound = document.getElementById('laugh-sound');
const correctSound = document.getElementById('correct-sound');
const clickSound = document.getElementById('click-sound');

// ============================================
// QUIZ FUNCTIONALITY
// ============================================

function initQuiz() {
    totalQuestionsElement.textContent = quizQuestions.length;
    currentScoreElement.textContent = quizScore;
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        showQuizResults();
        return;
    }

    const question = quizQuestions[currentQuestionIndex];
    
    // Update UI
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('option-a').textContent = question.answers.a;
    document.getElementById('option-b').textContent = question.answers.b;
    document.getElementById('option-c').textContent = question.answers.c;
    document.getElementById('option-d').textContent = question.answers.d;
    document.getElementById('hint-text').textContent = question.hint;
    
    // Update progress
    const progressPercentage = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('quiz-progress').style.width = `${progressPercentage}%`;
    
    // Reset button states
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
        btn.disabled = false;
    });
    
    // Reset result display
    document.getElementById('quiz-result').textContent = '';
    document.getElementById('next-btn').style.display = 'none';
    
    // Reset timer
    resetTimer();
    
    // Update question counter
    document.querySelector('#current-question').textContent = currentQuestionIndex + 1;
}

function checkAnswer(selectedAnswer) {
    playSound(clickSound);
    const question = quizQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.option-btn');
    const resultElement = document.getElementById('quiz-result');
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    // Stop timer
    clearInterval(timer);
    
    // Highlight correct answer
    const correctButton = document.querySelector(`.option-btn[onclick="checkAnswer('${question.correct}')"]`);
    correctButton.classList.add('correct');
    
    if (selectedAnswer === question.correct) {
        // Correct answer
        quizScore++;
        correctStreak++;
        currentScoreElement.textContent = quizScore;
        streakElement.textContent = correctStreak;
        
        resultElement.textContent = "✅ Correct! Excellent work!";
        resultElement.style.color = "#4ECDC4";
        
        playSound(correctSound);
        createConfetti(50);
        
        // Add animation to correct button
        correctButton.style.animation = 'correctPulse 0.6s ease';
        
    } else {
        // Wrong answer
        correctStreak = 0;
        streakElement.textContent = correctStreak;
        
        resultElement.textContent = `❌ Incorrect. The correct answer is ${question.correct.toUpperCase()}.`;
        resultElement.style.color = "#FF6B6B";
        
        // Highlight wrong answer
        document.querySelector(`.option-btn[onclick="checkAnswer('${selectedAnswer}')"]`).classList.add('incorrect');
        
        // Shake animation for wrong answer
        document.querySelector(`.option-btn[onclick="checkAnswer('${selectedAnswer}')"]`).style.animation = 'shake 0.5s ease';
    }
    
    // Show next button
    document.getElementById('next-btn').style.display = 'flex';
    
    // Update hint
    document.getElementById('hint-text').textContent = question.hint;
}

function loadNextQuestion() {
    playSound(clickSound);
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    const quizContainer = document.getElementById('quiz');
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    
    let message, emoji, color;
    
    if (percentage >= 90) {
        message = "Perfect! You're a JavaScript Master! 🎯";
        emoji = "🏆";
        color = "#4ECDC4";
    } else if (percentage >= 70) {
        message = "Great job! You know your stuff! 💪";
        emoji = "⭐";
        color = "#FFD166";
    } else if (percentage >= 50) {
        message = "Good effort! Keep practicing! 📚";
        emoji = "👍";
        color = "#FF9F43";
    } else {
        message = "Keep learning! Every master was once a beginner. 🌱";
        emoji = "🎯";
        color = "#FF6B6B";
    }
    
    createConfetti(100);
    
    quizContainer.innerHTML = `
        <div class="card-header">
            <h2><i class="fas fa-trophy"></i> Quiz Complete!</h2>
        </div>
        <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 6rem; margin-bottom: 20px; animation: bounce 2s infinite;">${emoji}</div>
            <h3 style="font-size: 2rem; margin-bottom: 15px; color: ${color};">Your Score: ${quizScore}/${quizQuestions.length}</h3>
            <p style="font-size: 1.5rem; margin-bottom: 25px; color: #94a3b8;">${percentage}% Correct</p>
            <p style="font-size: 1.2rem; margin-bottom: 30px; line-height: 1.6;">${message}</p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="restartQuiz()" style="
                    background: linear-gradient(45deg, #4ECDC4, #2DD4BF);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 15px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                ">
                    <i class="fas fa-redo"></i> Restart Quiz
                </button>
                <button onclick="shareQuizResults()" style="
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 2px solid #4ECDC4;
                    padding: 15px 30px;
                    border-radius: 15px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                ">
                    <i class="fas fa-share-alt"></i> Share Score
                </button>
            </div>
        </div>
    `;
}

function restartQuiz() {
    playSound(clickSound);
    currentQuestionIndex = 0;
    quizScore = 0;
    correctStreak = 0;
    currentScoreElement.textContent = '0';
    streakElement.textContent = '0';
    
    // Reset the quiz container
    const quizContainer = document.getElementById('quiz');
    quizContainer.innerHTML = `
        <div class="card-header">
            <h2><i class="fas fa-question-circle"></i> JavaScript Quiz Challenge</h2>
            <div class="timer" id="quiz-timer">
                <i class="fas fa-clock"></i> <span id="time-left">30</span>s
            </div>
        </div>
        <div class="progress-container">
            <div class="progress-bar" id="quiz-progress"></div>
        </div>
        <p id="question-text">What does CSS stand for?</p>
        <div class="options-container">
            <button class="option-btn" onclick="checkAnswer('a')">
                <span class="option-letter">A</span>
                <span class="option-text" id="option-a">Computer Style Sheets</span>
            </button>
            <button class="option-btn" onclick="checkAnswer('b')">
                <span class="option-letter">B</span>
                <span class="option-text" id="option-b">Cascading Style Sheets</span>
            </button>
            <button class="option-btn" onclick="checkAnswer('c')">
                <span class="option-letter">C</span>
                <span class="option-text" id="option-c">Creative Style System</span>
            </button>
            <button class="option-btn" onclick="checkAnswer('d')">
                <span class="option-letter">D</span>
                <span class="option-text" id="option-d">Colorful Style Sheets</span>
            </button>
        </div>
        <div class="quiz-footer">
            <div class="result-container">
                <p id="quiz-result"></p>
                <div class="streak-counter" id="streak-counter">
                    <i class="fas fa-fire"></i> Streak: <span id="streak">0</span>
                </div>
            </div>
            <button id="next-btn" onclick="loadNextQuestion()">
                <i class="fas fa-arrow-right"></i> Next Question
            </button>
        </div>
        <div class="quiz-hint">
            <i class="fas fa-lightbulb"></i>
            <span id="hint-text">Select the best answer for each question</span>
        </div>
    `;
    
    // Re-initialize quiz
    initQuiz();
}

function shareQuizResults() {
    const score = quizScore;
    const total = quizQuestions.length;
    const percentage = Math.round((score / total) * 100);
    
    const shareText = `🎯 I scored ${score}/${total} (${percentage}%) on the JavaScript Quiz! Try it yourself!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'JavaScript Quiz Results',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText + '\n' + window.location.href);
        showNotification('Results copied to clipboard! 📋');
    }
}

// ============================================
// TIMER FUNCTIONS
// ============================================

function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

function resetTimer() {
    timeLeft = 30;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    timeLeftElement.textContent = timeLeft;
    
    // Change color based on time
    if (timeLeft <= 10) {
        quizTimer.style.background = 'linear-gradient(45deg, #FF6B6B, #FF4757)';
        quizTimer.style.animation = 'pulse 0.5s infinite';
    } else if (timeLeft <= 20) {
        quizTimer.style.background = 'linear-gradient(45deg, #FFD166, #FF9F43)';
        quizTimer.style.animation = 'pulse 1s infinite';
    } else {
        quizTimer.style.background = 'linear-gradient(45deg, #4ECDC4, #2DD4BF)';
        quizTimer.style.animation = 'pulse 2s infinite';
    }
}

function timeUp() {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    const resultElement = document.getElementById('quiz-result');
    resultElement.textContent = "⏰ Time's up! Moving to next question...";
    resultElement.style.color = "#FFD166";
    
    setTimeout(() => {
        loadNextQuestion();
    }, 1500);
}

// ============================================
// JOKE API FUNCTIONALITY
// ============================================

function initJokeApp() {
    // Load saved jokes from localStorage
    loadSavedJokes();
    
    // Set up category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            fetchRandomJoke();
        });
    });
    
    // Set up joke buttons
    document.getElementById('fetch-joke-btn').addEventListener('click', fetchRandomJoke);
    document.getElementById('save-joke-btn').addEventListener('click', saveCurrentJoke);
    document.getElementById('share-joke-btn').addEventListener('click', shareCurrentJoke);
    document.getElementById('clear-saved-btn').addEventListener('click', clearSavedJokes);
    
    // Set up rating stars
    document.querySelectorAll('.rating-stars i').forEach(star => {
        star.addEventListener('click', function() {
            rateJoke(parseInt(this.dataset.rating));
        });
        
        star.addEventListener('mouseover', function() {
            highlightStars(parseInt(this.dataset.rating));
        });
        
        star.addEventListener('mouseout', function() {
            resetStarHighlight();
        });
    });
    
    // Fetch first joke
    fetchRandomJoke();
}

async function fetchRandomJoke() {
    showLoading();
    hideError();
    
    try {
        let url = `${JOKE_API_URL}${currentCategory}`;
        
        // Add blacklist flags for safe content
        if (currentCategory === 'Any') {
            url += '?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';
        } else {
            url += '?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch joke: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.message || 'Joke API error');
        }
        
        currentJoke = data;
        displayJoke(data);
        jokeCount++;
        jokeCountElement.textContent = jokeCount;
        
        playSound(laughSound);
        
    } catch (error) {
        console.error('Error fetching joke:', error);
        showError('Unable to load joke. Please try again!');
        displayFallbackJoke();
    } finally {
        hideLoading();
    }
}

function displayJoke(joke) {
    // Hide single joke display
    document.getElementById('joke-single').style.display = 'none';
    document.getElementById('joke-setup').style.display = 'none';
    document.getElementById('joke-delivery').style.display = 'none';
    
    // Update joke type badge
    document.querySelector('#joke-type span').textContent = joke.category || 'Random';
    
    if (joke.type === 'twopart') {
        // Two-part joke
        document.getElementById('joke-setup').style.display = 'block';
        document.getElementById('joke-delivery').style.display = 'block';
        
        document.getElementById('joke-setup').textContent = joke.setup;
        document.getElementById('joke-delivery').textContent = joke.delivery;
        
        // Animate the punchline
        setTimeout(() => {
            document.getElementById('joke-delivery').style.animation = 'punchline 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, 500);
        
    } else {
        // Single-part joke
        document.getElementById('joke-single').style.display = 'block';
        document.getElementById('joke-single').textContent = joke.joke;
    }
    
    // Update joke stats
    updateJokeStats(joke);
    
    // Reset rating
    resetStarHighlight();
    document.getElementById('rating-text').textContent = 'Rate this joke!';
    
    // Show joke display
    document.getElementById('joke-display').style.display = 'block';
}

function displayFallbackJoke() {
    const fallbackJokes = [
        {
            type: 'twopart',
            setup: "Why don't programmers like nature?",
            delivery: "It has too many bugs!",
            category: "Programming"
        },
        {
            type: 'single',
            joke: "I told my computer I needed a break, and now it won't stop sending me Kit-Kats.",
            category: "Programming"
        },
        {
            type: 'twopart',
            setup: "Why did the JavaScript developer go broke?",
            delivery: "Because he used up all his cache!",
            category: "Programming"
        }
    ];
    
    const randomJoke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
    currentJoke = randomJoke;
    displayJoke(randomJoke);
}

function updateJokeStats(joke) {
    const text = joke.type === 'twopart' 
        ? joke.setup + ' ' + joke.delivery 
        : joke.joke;
    
    const wordCount = text.split(' ').length;
    let length = 'Short';
    
    if (wordCount > 30) length = 'Long';
    else if (wordCount > 15) length = 'Medium';
    
    document.getElementById('joke-length').textContent = length;
    
    // Increment views
    const views = jokeRatings[joke.id]?.views || 0;
    document.getElementById('joke-views').textContent = views + 1;
    
    // Update funny count based on previous ratings
    const rating = jokeRatings[joke.id]?.rating || 0;
    const funnyCount = rating >= 3 ? Math.floor(rating * 2) : 0;
    document.getElementById('joke-funny-count').textContent = funnyCount;
}

function saveCurrentJoke() {
    if (!currentJoke) return;
    
    playSound(clickSound);
    
    // Create joke object with metadata
    const jokeToSave = {
        ...currentJoke,
        savedAt: new Date().toISOString(),
        rating: jokeRatings[currentJoke.id]?.rating || 0
    };
    
    // Check if already saved
    if (!savedJokes.some(j => 
        (j.type === 'twopart' && j.setup === currentJoke.setup) ||
        (j.type === 'single' && j.joke === currentJoke.joke)
    )) {
        savedJokes.push(jokeToSave);
        saveJokesToStorage();
        updateSavedJokesList();
        showNotification('Joke saved to favorites! 💾');
    } else {
        showNotification('Joke already saved! 📁');
    }
}

function updateSavedJokesList() {
    const container = document.getElementById('saved-jokes-list');
    
    if (savedJokes.length === 0) {
        container.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 20px;">No saved jokes yet. Save your favorites!</p>';
        return;
    }
    
    container.innerHTML = savedJokes.map((joke, index) => `
        <div class="saved-joke-item" onclick="loadSavedJoke(${index})">
            <strong>${joke.category || 'Random'}</strong>
            <p style="margin: 5px 0; color: #B8B8D1;">
                ${joke.type === 'twopart' 
                    ? joke.setup.substring(0, 50) + '...' 
                    : joke.joke.substring(0, 50) + '...'}
            </p>
            <small style="color: #94a3b8;">
                ${new Date(joke.savedAt).toLocaleDateString()}
                ${joke.rating ? ' ★'.repeat(joke.rating) : ''}
            </small>
            <button class="delete-joke" onclick="deleteSavedJoke(${index}); event.stopPropagation();">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function loadSavedJoke(index) {
    playSound(clickSound);
    currentJoke = savedJokes[index];
    displayJoke(savedJokes[index]);
    showNotification('Loaded saved joke! 📖');
}

function deleteSavedJoke(index) {
    playSound(clickSound);
    savedJokes.splice(index, 1);
    saveJokesToStorage();
    updateSavedJokesList();
    showNotification('Joke removed! 🗑️');
}

function clearSavedJokes() {
    playSound(clickSound);
    if (confirm('Are you sure you want to clear all saved jokes?')) {
        savedJokes = [];
        saveJokesToStorage();
        updateSavedJokesList();
        showNotification('All jokes cleared! 🧹');
    }
}

function shareCurrentJoke() {
    if (!currentJoke) return;
    
    playSound(clickSound);
    
    let jokeText = '';
    if (currentJoke.type === 'twopart') {
        jokeText = `${currentJoke.setup}\n\n${currentJoke.delivery}`;
    } else {
        jokeText = currentJoke.joke;
    }
    
    const shareMessage = `${jokeText}\n\n🤣 Shared from JavaScript Quiz & Joke Generator`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Check out this joke!',
            text: jokeText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareMessage);
        showNotification('Joke copied to clipboard! 📋');
    }
}

function rateJoke(rating) {
    if (!currentJoke) return;
    
    playSound(clickSound);
    
    // Create a simple ID for the joke
    const jokeId = currentJoke.type === 'twopart' 
        ? currentJoke.setup 
        : currentJoke.joke;
    
    // Save rating
    if (!jokeRatings[jokeId]) {
        jokeRatings[jokeId] = { rating: 0, views: 0 };
    }
    
    jokeRatings[jokeId].rating = rating;
    jokeRatings[jokeId].views = (jokeRatings[jokeId].views || 0) + 1;
    
    // Update UI
    highlightStars(rating);
    
    // Show feedback
    const feedback = [
        "Thanks for rating!",
        "Great rating!",
        "Awesome!",
        "Excellent!",
        "Perfect! You're hilarious!"
    ];
    
    document.getElementById('rating-text').textContent = feedback[rating - 1];
    
    // If rating is high, celebrate
    if (rating >= 4) {
        createConfetti(30);
        setTimeout(() => playSound(laughSound), 300);
    }
    
    // Save ratings to localStorage
    saveRatingsToStorage();
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.rating-stars i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

function resetStarHighlight() {
    if (!currentJoke) return;
    
    const jokeId = currentJoke.type === 'twopart' 
        ? currentJoke.setup 
        : currentJoke.joke;
    
    const currentRating = jokeRatings[jokeId]?.rating || 0;
    highlightStars(currentRating);
}

function toggleAutoJoke() {
    playSound(clickSound);
    const autoBtn = document.getElementById('auto-joke-btn');
    
    isAutoJokeEnabled = !isAutoJokeEnabled;
    
    if (isAutoJokeEnabled) {
        autoBtn.classList.add('active');
        autoBtn.innerHTML = '<i class="fas fa-robot"></i> Auto ON';
        startAutoJokeMode();
        showNotification('Auto-joke mode enabled! 🤖');
    } else {
        autoBtn.classList.remove('active');
        autoBtn.innerHTML = '<i class="fas fa-robot"></i> Auto';
        stopAutoJokeMode();
        showNotification('Auto-joke mode disabled! ⏹️');
    }
}

function startAutoJokeMode() {
    // Clear any existing interval
    if (autoJokeInterval) clearInterval(autoJokeInterval);
    
    // Fetch first joke immediately
    fetchRandomJoke();
    
    // Set interval for auto-fetch (every 15 seconds)
    autoJokeInterval = setInterval(fetchRandomJoke, 15000);
}

function stopAutoJokeMode() {
    if (autoJokeInterval) {
        clearInterval(autoJokeInterval);
        autoJokeInterval = null;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showLoading() {
    document.getElementById('joke-spinner').style.display = 'flex';
    document.getElementById('joke-display').style.display = 'none';
}

function hideLoading() {
    document.getElementById('joke-spinner').style.display = 'none';
}

function showError(message) {
    document.getElementById('error-text').textContent = message;
    document.getElementById('error-message').style.display = 'flex';
}

function hideError() {
    document.getElementById('error-message').style.display = 'none';
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    document.getElementById('notification-text').textContent = message;
    notification.style.display = 'flex';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function createConfetti(count) {
    const container = document.querySelector('.confetti-container');
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random properties
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        const delay = Math.random() * 5;
        const duration = Math.random() * 3 + 2;
        
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.left = `${left}%`;
        confetti.style.backgroundColor = color;
        confetti.style.animationDelay = `${delay}s`;
        confetti.style.animationDuration = `${duration}s`;
        
        container.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, (delay + duration) * 1000);
    }
}

function playSound(soundElement) {
    if (soundElement) {
        soundElement.currentTime = 0;
        soundElement.play().catch(e => console.log('Audio play failed:', e));
    }
}

// ============================================
// LOCAL STORAGE FUNCTIONS
// ============================================

function saveJokesToStorage() {
    try {
        localStorage.setItem('savedJokes', JSON.stringify(savedJokes));
        localStorage.setItem('jokeCount', jokeCount.toString());
    } catch (e) {
        console.error('Failed to save jokes to storage:', e);
    }
}

function loadSavedJokes() {
    try {
        const saved = localStorage.getItem('savedJokes');
        if (saved) {
            savedJokes = JSON.parse(saved);
            updateSavedJokesList();
        }
        
        const count = localStorage.getItem('jokeCount');
        if (count) {
            jokeCount = parseInt(count);
            jokeCountElement.textContent = jokeCount;
        }
    } catch (e) {
        console.error('Failed to load jokes from storage:', e);
    }
}

function saveRatingsToStorage() {
    try {
        localStorage.setItem('jokeRatings', JSON.stringify(jokeRatings));
    } catch (e) {
        console.error('Failed to save ratings:', e);
    }
}

function loadRatingsFromStorage() {
    try {
        const ratings = localStorage.getItem('jokeRatings');
        if (ratings) {
            jokeRatings = JSON.parse(ratings);
        }
    } catch (e) {
        console.error('Failed to load ratings:', e);
    }
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function showCredits() {
    playSound(clickSound);
    document.getElementById('credits-modal').style.display = 'flex';
}

function showInstructions() {
    playSound(clickSound);
    document.getElementById('instructions-modal').style.display = 'flex';
}

function closeModal(modalId) {
    playSound(clickSound);
    document.getElementById(modalId).style.display = 'none';
}

function toggleDarkMode() {
    playSound(clickSound);
    const root = document.documentElement;
    
    if (root.style.getPropertyValue('--dark-bg') === '#0F0F23') {
        // Switch to light mode
        root.style.setProperty('--dark-bg', '#F8F9FA');
        root.style.setProperty('--card-bg', '#FFFFFF');
        root.style.setProperty('--light-card', '#E9ECEF');
        root.style.setProperty('--text-primary', '#212529');
        root.style.setProperty('--text-secondary', '#6C757D');
        root.style.setProperty('--border-color', '#DEE2E6');
        showNotification('Light mode activated! ☀️');
    } else {
        // Switch to dark mode
        root.style.setProperty('--dark-bg', '#0F0F23');
        root.style.setProperty('--card-bg', '#16213E');
        root.style.setProperty('--light-card', '#0F3460');
        root.style.setProperty('--text-primary', '#FFFFFF');
        root.style.setProperty('--text-secondary', '#B8B8D1');
        root.style.setProperty('--border-color', '#2D3A5E');
        showNotification('Dark mode activated! 🌙');
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize both apps
    initQuiz();
    initJokeApp();
    loadRatingsFromStorage();
    
    // Add some initial confetti
    setTimeout(() => createConfetti(20), 1000);
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome to the Quiz & Joke Generator! 🎉');
    }, 500);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Number keys 1-4 for quiz answers
        if (e.key >= '1' && e.key <= '4' && !document.getElementById('next-btn').style.display === 'flex') {
            const answer = String.fromCharCode(96 + parseInt(e.key)); // Convert 1-4 to a-d
            checkAnswer(answer);
        }
        
        // Spacebar for next question
        if (e.key === ' ' && document.getElementById('next-btn').style.display === 'flex') {
            loadNextQuestion();
        }
        
        // 'N' for new joke
        if (e.key === 'n' || e.key === 'N') {
            fetchRandomJoke();
        }
        
        // 'S' to save joke
        if (e.key === 's' || e.key === 'S') {
            saveCurrentJoke();
        }
    });
});