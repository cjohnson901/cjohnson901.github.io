// Quiz elements and settings
const form = document.getElementById("quiz-form");
const results = document.getElementById("quiz-results");
const timerDisplay = document.getElementById("timer");
const resetButton = document.getElementById("reset-quiz");

const timeLimit = 10; // 10 minutes in seconds
let timeLeft = timeLimit;
let timer;
let finished = false;

// Correct answers for all ten questions
const answers = {
    q1: ["html"],
    q2: ["css"],
    q3: ["Blink"],
    q4: ["b"],
    q5: ["Firefox"],
    q6: ["b"],
    q7: ["a"],
    q8: ["HTML", "CSS", "JavaScript"],
    q9: ["Sandboxing", "HTTPS", "Site Isolation"],
    q10: ["a", "c"]
};

// Answer descriptions displayed after submission
const answerText = [
    "HTML",
    "CSS",
    "Blink",
    "Displays webpage content",
    "Firefox",
    "Restrict potentially harmful processes",
    "A webpage's document structure",
    "HTML, CSS, and JavaScript",
    "Sandboxing, HTTPS, and Site Isolation",
    "Limits locally saved history; websites may still track activity"
];

// Display the remaining time as minutes and seconds
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = String(timeLeft % 60).padStart(2, "0");

    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Start the countdown when the page loads
function startTimer() {
    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft = Math.max(0, timeLeft - 1);
        updateTimer();

        if (timeLeft === 0) {
            submitQuiz();
        }
    }, 1000);
}

// Collect the selected answers for a question
function getAnswers(question) {
    return Array.from(
        form.querySelectorAll(`[name="${question}"]:checked`)
    ).map(input => input.value);
}

// Check answers and display detailed results
function submitQuiz() {
    if (finished) return;

    finished = true;
    clearInterval(timer);

    let score = 0;
    let feedback = "";

    for (let i = 1; i <= 10; i++) {
        const question = `q${i}`;
        let userAnswers;

        if (i <= 2) {
            const input = document.getElementById(question);
            userAnswers = [input.value.trim().toLowerCase()];
        } else {
            userAnswers = getAnswers(question);
        }

        const correctAnswers = answers[question];

        // Compare answers without depending on selection order
        const correct =
            userAnswers.length === correctAnswers.length &&
            userAnswers.every(answer => correctAnswers.includes(answer));

        if (correct) score++;

        feedback += `
            <p class="${correct ? "correct" : "incorrect"}">
                <strong>Question ${i}:</strong>
                ${correct ? "Correct" : "Incorrect"} ( ${correct ? 1 : 0}/1 )
                <br>
                Correct answer: ${answerText[i - 1]}
            </p>
        `;
    }

    // Determine whether the user passed or ran out of time.
    const passed = score >= 7;
    const timedOut = timeLeft === 0;
    const elapsed = timeLimit - timeLeft;
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    // Show overall score, time spent, and question feedback
    results.innerHTML = `
        <h2>Quiz Results</h2>
        ${timedOut ? "<p><strong>Time's up! Your quiz was submitted automatically.</strong></p>" : ""}
        <h3 class="${passed ? "correct" : "incorrect"}">
            ${passed ? "Passed!" : "Not Passed"}
        </h3>
        <p><strong>Total Score:</strong> ${score}/10 (${score * 10}%)</p>
        <p><strong>Time Spent:</strong> ${minutes}m ${seconds}s</p>
        <h3>Question Feedback</h3>
        ${feedback}
    `;

    results.hidden = false;

    // Prevent answers from changing after submission
    form.querySelectorAll("input").forEach(input => {
        input.disabled = true;
    });

    results.scrollIntoView({ behavior: "smooth" });
}

// Submit without refreshing the webpage
form.addEventListener("submit", event => {
    event.preventDefault();
    submitQuiz();
});

// Reset answers, results, and the countdown
resetButton.addEventListener("click", () => {
    clearInterval(timer);

    form.reset();
    finished = false;
    timeLeft = timeLimit;

    form.querySelectorAll("input").forEach(input => {
        input.disabled = false;
    });

    results.innerHTML = "";
    results.hidden = true;

    updateTimer();
    startTimer();

    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Initialize the quiz
updateTimer();
startTimer();
