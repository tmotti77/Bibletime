// Main Application Controller

class App {
    constructor() {
        this.currentPage = 'timeline';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupModal();
        this.setupLoadingOverlay();
        this.initializeManagers();

        // Show loading overlay initially
        this.showLoading();

        // Hide loading once everything is ready
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoading();
            }, 500);
        });

        // Handle page visibility
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.onPageVisible();
            }
        });
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');

        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateTo(e.state.page, false);
            }
        });

        // Set initial state
        history.replaceState({ page: this.currentPage }, '', '#' + this.currentPage);
    }

    navigateTo(pageName, pushState = true) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(pageName + '-page');
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;

            // Update navigation buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            const activeBtn = document.querySelector(`[data-page="${pageName}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }

            // Update browser history
            if (pushState) {
                history.pushState({ page: pageName }, '', '#' + pageName);
            }

            // Track page visit for progress
            this.trackPageVisit(pageName);

            // Page-specific initialization
            this.onPageChange(pageName);
        }
    }

    onPageChange(pageName) {
        // Perform any page-specific setup
        switch (pageName) {
            case 'timeline':
                if (window.timelineManager) {
                    window.timelineManager.renderTimeline();
                }
                break;

            case 'maps':
                if (window.mapsManager) {
                    // Maps manager handles its own initialization
                }
                break;

            case 'learn':
                // Learning page is ready
                break;

            case 'quiz':
                // Quiz page is ready
                break;

            case 'favorites':
                if (window.favoritesManager) {
                    window.favoritesManager.renderFavorites();
                }
                break;
        }
    }

    trackPageVisit(pageName) {
        // Track for analytics (could be extended)
        const visits = this.getPageVisits();
        visits[pageName] = (visits[pageName] || 0) + 1;
        localStorage.setItem('biblicalTimelinePageVisits', JSON.stringify(visits));
    }

    getPageVisits() {
        const visits = localStorage.getItem('biblicalTimelinePageVisits');
        return visits ? JSON.parse(visits) : {};
    }

    setupModal() {
        const modal = document.getElementById('detailModal');
        const closeBtn = document.getElementById('modalClose');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        // Close modal on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }

    setupLoadingOverlay() {
        // Loading overlay is set up in HTML
    }

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    initializeManagers() {
        // All managers are initialized in their respective files
        // This method can be used for any cross-manager coordination

        // Check for URL hash and navigate to that page
        const hash = window.location.hash.substring(1);
        if (hash) {
            setTimeout(() => {
                this.navigateTo(hash, false);
            }, 100);
        }
    }

    onPageVisible() {
        // Refresh data when page becomes visible
        if (window.progressManager) {
            window.progressManager.updateProgress();
        }
    }

    // Utility methods
    showNotification(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? 'var(--vintage-olive)' : 'var(--vintage-burgundy)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px var(--shadow);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Export data for offline use
    exportData() {
        const data = {
            favorites: window.favoritesManager ? window.favoritesManager.favorites : [],
            completedTopics: window.learnManager ? window.learnManager.completedTopics : [],
            quizScore: parseInt(localStorage.getItem('biblicalTimelineQuizScore') || '0'),
            progress: window.progressManager ? window.progressManager.getProgressReport() : null,
            language: languageManager.getCurrentLang(),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'biblical-timeline-data.json';
        link.click();

        URL.revokeObjectURL(url);

        this.showNotification(
            languageManager.currentLang === 'en'
                ? 'Data exported successfully!'
                : '!הנתונים יוצאו בהצלחה',
            'success'
        );
    }

    // Import data
    importData(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Import favorites
                if (data.favorites && window.favoritesManager) {
                    localStorage.setItem('biblicalTimelineFavorites', JSON.stringify(data.favorites));
                    window.favoritesManager.favorites = data.favorites;
                    window.favoritesManager.renderFavorites();
                }

                // Import completed topics
                if (data.completedTopics && window.learnManager) {
                    localStorage.setItem('biblicalTimelineCompletedTopics', JSON.stringify(data.completedTopics));
                    window.learnManager.completedTopics = data.completedTopics;
                }

                // Import quiz score
                if (data.quizScore !== undefined) {
                    localStorage.setItem('biblicalTimelineQuizScore', data.quizScore.toString());
                    if (window.quizManager) {
                        window.quizManager.score = data.quizScore;
                        window.quizManager.updateScoreDisplay();
                    }
                }

                // Update progress
                if (window.progressManager) {
                    window.progressManager.updateProgress();
                }

                this.showNotification(
                    languageManager.currentLang === 'en'
                        ? 'Data imported successfully!'
                        : '!הנתונים יובאו בהצלחה',
                    'success'
                );
            } catch (error) {
                console.error('Import error:', error);
                this.showNotification(
                    languageManager.currentLang === 'en'
                        ? 'Error importing data!'
                        : '!שגיאה בייבוא נתונים',
                    'error'
                );
            }
        };

        reader.readAsText(file);
    }

    // Get app statistics
    getStatistics() {
        return {
            totalEvents: biblicalData.events.length,
            totalPeriods: biblicalData.periods.length,
            totalPeople: biblicalData.people.length,
            userProgress: window.progressManager ? window.progressManager.getProgressReport() : null,
            pageVisits: this.getPageVisits(),
            favorites: window.favoritesManager ? window.favoritesManager.favorites.length : 0
        };
    }
}

// Initialize app when DOM is ready
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new App();
        window.biblicalTimelineApp = app;
    });
} else {
    app = new App();
    window.biblicalTimelineApp = app;
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
