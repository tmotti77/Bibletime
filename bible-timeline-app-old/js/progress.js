// Progress Tracking System

class ProgressManager {
    constructor() {
        this.progressFill = document.getElementById('progressFill');
        this.progressPercent = document.getElementById('progressPercent');

        this.init();
    }

    init() {
        this.updateProgress();

        // Listen for events that affect progress
        window.addEventListener('favoritesChange', () => this.updateProgress());
        window.addEventListener('languageChange', () => this.updateProgress());

        // Update progress periodically
        setInterval(() => this.updateProgress(), 5000);
    }

    updateProgress() {
        const progress = this.calculateProgress();
        this.displayProgress(progress);
    }

    calculateProgress() {
        let totalItems = 0;
        let completedItems = 0;

        // Count completed learning topics
        const completedTopics = window.learnManager ? window.learnManager.completedTopics.length : 0;
        const totalTopics = 6; // Total number of topics
        totalItems += totalTopics;
        completedItems += completedTopics;

        // Count quiz participation
        const quizScore = parseInt(localStorage.getItem('biblicalTimelineQuizScore') || '0');
        const quizProgress = Math.min(quizScore / 100, 10); // Max 10 points for quizzes
        totalItems += 10;
        completedItems += quizProgress;

        // Count favorites (engagement metric)
        const favorites = window.favoritesManager ? window.favoritesManager.favorites.length : 0;
        const favoritesProgress = Math.min(favorites, 10); // Max 10 points for favorites
        totalItems += 10;
        completedItems += favoritesProgress;

        // Count visited periods (timeline exploration)
        const visitedPeriods = this.getVisitedPeriods();
        const totalPeriods = biblicalData.periods.length;
        totalItems += totalPeriods;
        completedItems += visitedPeriods;

        // Count map exploration
        const visitedMaps = this.getVisitedMaps();
        const totalMaps = 6; // Total number of map types
        totalItems += totalMaps;
        completedItems += visitedMaps;

        const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        return {
            percentage: percentage,
            completedItems: Math.round(completedItems),
            totalItems: totalItems
        };
    }

    getVisitedPeriods() {
        const visited = localStorage.getItem('biblicalTimelineVisitedPeriods');
        return visited ? JSON.parse(visited).length : 0;
    }

    getVisitedMaps() {
        const visited = localStorage.getItem('biblicalTimelineVisitedMaps');
        return visited ? JSON.parse(visited).length : 0;
    }

    trackPeriodVisit(periodId) {
        let visited = localStorage.getItem('biblicalTimelineVisitedPeriods');
        visited = visited ? JSON.parse(visited) : [];

        if (!visited.includes(periodId)) {
            visited.push(periodId);
            localStorage.setItem('biblicalTimelineVisitedPeriods', JSON.stringify(visited));
            this.updateProgress();
        }
    }

    trackMapVisit(mapType) {
        let visited = localStorage.getItem('biblicalTimelineVisitedMaps');
        visited = visited ? JSON.parse(visited) : [];

        if (!visited.includes(mapType)) {
            visited.push(mapType);
            localStorage.setItem('biblicalTimelineVisitedMaps', JSON.stringify(visited));
            this.updateProgress();
        }
    }

    displayProgress(progress) {
        if (this.progressFill) {
            this.progressFill.style.width = progress.percentage + '%';
        }

        if (this.progressPercent) {
            this.progressPercent.textContent = progress.percentage + '%';
        }

        // Store in localStorage for persistence
        localStorage.setItem('biblicalTimelineProgress', JSON.stringify(progress));
    }

    getProgressReport() {
        const progress = this.calculateProgress();

        return {
            overall: progress.percentage,
            learning: window.learnManager ? window.learnManager.completedTopics.length : 0,
            quizScore: parseInt(localStorage.getItem('biblicalTimelineQuizScore') || '0'),
            favorites: window.favoritesManager ? window.favoritesManager.favorites.length : 0,
            periodsExplored: this.getVisitedPeriods(),
            mapsExplored: this.getVisitedMaps()
        };
    }

    resetProgress() {
        if (confirm(languageManager.currentLang === 'en'
            ? 'Are you sure you want to reset all progress?'
            : '?האם אתה בטוח שברצונך לאפס את כל ההתקדמות')) {

            localStorage.removeItem('biblicalTimelineCompletedTopics');
            localStorage.removeItem('biblicalTimelineQuizScore');
            localStorage.removeItem('biblicalTimelineVisitedPeriods');
            localStorage.removeItem('biblicalTimelineVisitedMaps');
            localStorage.removeItem('biblicalTimelineProgress');

            this.updateProgress();

            if (window.learnManager) {
                window.learnManager.completedTopics = [];
            }

            if (window.quizManager) {
                window.quizManager.score = 0;
                window.quizManager.updateScoreDisplay();
            }
        }
    }
}

// Initialize progress manager
window.progressManager = null;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.progressManager = new ProgressManager();
    });
} else {
    window.progressManager = new ProgressManager();
}
