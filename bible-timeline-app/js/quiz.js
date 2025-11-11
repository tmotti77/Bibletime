// Quiz System

class QuizManager {
    constructor() {
        this.currentDifficulty = 'easy';
        this.currentQuestion = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 5;
        this.questions = [];
        this.answers = [];

        this.quizContent = document.getElementById('quizContent');
        this.quizScore = document.getElementById('quizScore');
        this.quizStats = document.getElementById('quizStats');

        this.init();
    }

    init() {
        this.loadScore();
        this.setupEventListeners();
        this.updateScoreDisplay();
    }

    setupEventListeners() {
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentDifficulty = e.target.getAttribute('data-difficulty');
            });
        });

        const startBtn = document.getElementById('startQuiz');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startQuiz());
        }

        // Language change
        window.addEventListener('languageChange', () => {
            if (this.currentQuestion) {
                this.displayQuestion();
            }
        });
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.questions = this.getQuestions(this.currentDifficulty);
        this.displayQuestion();
    }

    getQuestions(difficulty) {
        const questions = biblicalData.quizQuestions[difficulty] || biblicalData.quizQuestions.easy;
        // Shuffle and take required number
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(this.totalQuestions, shuffled.length));
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        const questionText = languageManager.getText(question.question);
        const options = languageManager.getCurrentLang() === 'en' ? question.options.en : question.options.he;

        let html = `
            <div class="quiz-question" style="background: white; padding: 2rem; border-radius: 8px; border: 3px solid var(--vintage-gold);">
                <h3 style="color: var(--vintage-burgundy); margin-bottom: 1.5rem; font-family: Georgia;">
                    ${languageManager.currentLang === 'en' ? 'Question' : 'שאלה'} ${this.currentQuestionIndex + 1} ${languageManager.currentLang === 'en' ? 'of' : 'מתוך'} ${this.questions.length}
                </h3>
                <p style="font-size: 1.2rem; margin-bottom: 2rem; font-weight: 500;">${questionText}</p>
                <div class="quiz-options" style="display: flex; flex-direction: column; gap: 1rem;">
        `;

        options.forEach((option, index) => {
            html += `
                <button
                    class="quiz-option-btn"
                    onclick="window.quizManager.selectAnswer(${index})"
                    style="
                        background: var(--vintage-paper);
                        border: 3px solid var(--vintage-brown);
                        padding: 1rem 1.5rem;
                        border-radius: 8px;
                        font-size: 1rem;
                        text-align: left;
                        cursor: pointer;
                        transition: all 0.3s;
                    "
                    onmouseover="this.style.background='var(--vintage-tan)'; this.style.transform='translateX(5px)'"
                    onmouseout="this.style.background='var(--vintage-paper)'; this.style.transform='translateX(0)'"
                >
                    ${String.fromCharCode(65 + index)}. ${option}
                </button>
            `;
        });

        html += `
                </div>
            </div>
        `;

        this.quizContent.innerHTML = html;
    }

    selectAnswer(selectedIndex) {
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correctIndex;

        this.answers.push({
            question: question,
            selectedIndex: selectedIndex,
            isCorrect: isCorrect
        });

        if (isCorrect) {
            this.score += this.getDifficultyPoints();
        }

        this.showAnswerFeedback(isCorrect, question);
    }

    getDifficultyPoints() {
        const points = {
            'easy': 10,
            'medium': 20,
            'hard': 30
        };
        return points[this.currentDifficulty] || 10;
    }

    showAnswerFeedback(isCorrect, question) {
        const explanation = languageManager.getText(question.explanation);
        const correctText = languageManager.currentLang === 'en' ? 'Correct!' : '!נכון';
        const incorrectText = languageManager.currentLang === 'en' ? 'Incorrect' : 'לא נכון';
        const nextText = languageManager.currentLang === 'en' ? 'Next Question' : 'שאלה הבאה';

        const html = `
            <div style="background: ${isCorrect ? '#d4edda' : '#f8d7da'}; padding: 2rem; border-radius: 8px; border: 3px solid ${isCorrect ? '#28a745' : '#dc3545'}; text-align: center;">
                <h2 style="color: ${isCorrect ? '#28a745' : '#dc3545'}; margin-bottom: 1rem;">
                    ${isCorrect ? correctText : incorrectText}
                </h2>
                <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 1.5rem;">${explanation}</p>
                <button
                    class="start-quiz-btn"
                    onclick="window.quizManager.nextQuestion()"
                >
                    ${nextText}
                </button>
            </div>
        `;

        this.quizContent.innerHTML = html;
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.displayQuestion();
    }

    showResults() {
        this.saveScore();
        this.updateScoreDisplay();

        const totalPossible = this.questions.length * this.getDifficultyPoints();
        const percentage = Math.round((this.answers.filter(a => a.isCorrect).length / this.questions.length) * 100);

        const correctCount = this.answers.filter(a => a.isCorrect).length;
        const title = languageManager.currentLang === 'en' ? 'Quiz Complete!' : '!החידון הסתיים';
        const yourScore = languageManager.currentLang === 'en' ? 'Your Score:' : ':הניקוד שלך';
        const correct = languageManager.currentLang === 'en' ? 'Correct' : 'נכון';
        const tryAgain = languageManager.currentLang === 'en' ? 'Try Again' : 'נסה שוב';

        let html = `
            <div style="background: var(--vintage-cream); padding: 2rem; border-radius: 8px; border: 4px solid var(--vintage-gold); text-align: center;">
                <h2 style="color: var(--vintage-burgundy); margin-bottom: 2rem; font-size: 2rem;">${title}</h2>
                <div style="background: white; padding: 2rem; border-radius: 8px; margin-bottom: 2rem; border: 2px solid var(--vintage-tan);">
                    <p style="font-size: 1.3rem; margin-bottom: 0.5rem;">${yourScore}</p>
                    <p style="font-size: 3rem; font-weight: bold; color: var(--vintage-burgundy);">${percentage}%</p>
                    <p style="font-size: 1.1rem; color: var(--text-secondary);">${correctCount}/${this.questions.length} ${correct}</p>
                </div>
                <button class="start-quiz-btn" onclick="window.quizManager.startQuiz()">${tryAgain}</button>
            </div>
        `;

        this.quizContent.innerHTML = html;

        // Update progress
        if (window.progressManager) {
            window.progressManager.updateProgress();
        }

        this.updateStats();
    }

    loadScore() {
        const saved = localStorage.getItem('biblicalTimelineQuizScore');
        this.score = saved ? parseInt(saved) : 0;
    }

    saveScore() {
        const currentScore = parseInt(localStorage.getItem('biblicalTimelineQuizScore') || '0');
        const newScore = currentScore + this.answers.filter(a => a.isCorrect).length * this.getDifficultyPoints();
        localStorage.setItem('biblicalTimelineQuizScore', newScore.toString());
        this.score = newScore;
    }

    updateScoreDisplay() {
        if (this.quizScore) {
            this.quizScore.textContent = this.score;
        }
    }

    updateStats() {
        const stats = this.getQuizStats();
        if (!this.quizStats) return;

        const totalText = languageManager.currentLang === 'en' ? 'Total Quizzes Taken:' : ':סך כל החידונים שנעשו';
        const avgText = languageManager.currentLang === 'en' ? 'Average Score:' : ':ציון ממוצע';

        this.quizStats.innerHTML = `
            <div style="margin-top: 2rem; padding: 1rem; background: var(--vintage-paper); border-radius: 6px;">
                <p><strong>${totalText}</strong> ${stats.totalQuizzes}</p>
                <p><strong>${avgText}</strong> ${stats.averageScore}%</p>
            </div>
        `;
    }

    getQuizStats() {
        const saved = localStorage.getItem('biblicalTimelineQuizStats');
        return saved ? JSON.parse(saved) : { totalQuizzes: 0, averageScore: 0 };
    }
}

// Initialize quiz manager
window.quizManager = null;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.quizManager = new QuizManager();
    });
} else {
    window.quizManager = new QuizManager();
}
