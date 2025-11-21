// --- Step 2: Interactive Quiz Logic ---

const questions = [
    {
        question: "What does CSS stand for?",
        answers: { a: "Computer Style Sheets", b: "Cascading Style Sheets", c: "Creative Style System" },
        correct: "b"
    },
    {
        question: "Which HTML tag is used for JavaScript?",
        answers: { a: "<js>", b: "<script>", c: "<javascript>" },
        correct: "b"
    },
    {
        question: "Which symbol is used for IDs in CSS?",
        answers: { a: ".", b: "#", c: "@" },
        correct: "b"
    }
];

let currentQuestionIndex = 0;

function loadQuiz() {
    const q = questions[currentQuestionIndex];
    const options = document.querySelectorAll(".option-btn");
    
    document.getElementById("question-text").innerText = q.question;
    document.getElementById("quiz-result").innerText = "";
    document.getElementById("next-btn").style.display = "none";
    
    // Reset buttons and remove classes
    options.forEach(btn => {
        btn.classList.remove("correct", "incorrect");
        btn.disabled = false; // Enable buttons
    });
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.querySelector(".progress-bar").style.width = progress + "%";
    
    // Set options
    options[0].innerText = "A) " + q.answers.a;
    options[1].innerText = "B) " + q.answers.b;
    options[2].innerText = "C) " + q.answers.c;
    options[3].style.display = "none"; // Hide 4th button
}

function checkAnswer(answer) {
    const q = questions[currentQuestionIndex];
    const resultText = document.getElementById("quiz-result");
    const options = document.querySelectorAll(".option-btn");
    
    // Disable buttons after selection
    options.forEach(btn => btn.disabled = true);
    
    if (answer === q.correct) {
        resultText.innerText = "Correct! ✅";
        resultText.style.color = "#28a745";
        // Add class for animation
        document.querySelector(`[onclick="checkAnswer('${answer}')"]`).classList.add("correct");
    } else {
        resultText.innerText = "Wrong! ❌ The correct answer is " + q.correct.toUpperCase();
        resultText.style.color = "#dc3545";
        document.querySelector(`[onclick="checkAnswer('${answer}')"]`).classList.add("incorrect");
        document.querySelector(`[onclick="checkAnswer('${q.correct}')"]`).classList.add("correct");
    }
    
    // Auto-advance after 2 seconds for better flow
    setTimeout(() => {
        loadNextQuestion();
    }, 2000);
}

function loadNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuiz();
    } else {
        document.getElementById("quiz").innerHTML = "<h3>Quiz Completed! 🎉</h3><p>Great job!</p>";
        document.getElementById("next-btn").style.display = "none";
        document.querySelector(".progress-bar").style.width = "100%";
    }
}

// Initial load
loadQuiz();

// --- Step 3: Fetch Data from API ---

document.getElementById("fetch-btn").addEventListener("click", () => {
    const display = document.getElementById("user-display");
    const nameEl = document.getElementById("user-name");
    const emailEl = document.getElementById("user-email");
    const cityEl = document.getElementById("user-city");
    const spinner = document.querySelector(".spinner");
    
    // Show spinner and hide display
    spinner.style.display = "block";
    display.style.display = "none";
    
    const randomId = Math.floor(Math.random() * 10) + 1;
    const url = `https://jsonplaceholder.typicode.com/users/${randomId}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Hide spinner and update display
            spinner.style.display = "none";
            nameEl.innerText = "Name: " + data.name;
            emailEl.innerText = "Email: " + data.email;
            cityEl.innerText = "City: " + data.address.city;
            
            display.style.display = "block";
            display.classList.add("fadeIn"); // Trigger animation
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            spinner.style.display = "none";
            alert("Failed to load data. Check your internet connection.");
        });
});