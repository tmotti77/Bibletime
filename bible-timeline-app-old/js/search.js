// Search Functionality

class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchResults = [];

        this.init();
    }

    init() {
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.performSearch());
        }

        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });

            // Real-time search suggestions (debounced)
            let timeout;
            this.searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (e.target.value.length >= 2) {
                        this.showSuggestions(e.target.value);
                    } else {
                        this.hideSuggestions();
                    }
                }, 300);
            });
        }
    }

    performSearch() {
        const query = this.searchInput.value.trim().toLowerCase();

        if (!query) return;

        this.searchResults = this.search(query);
        this.displayResults();
    }

    search(query) {
        const results = {
            events: [],
            people: [],
            periods: [],
            locations: []
        };

        // Search events
        biblicalData.events.forEach(event => {
            const nameEn = event.name.en.toLowerCase();
            const nameHe = event.name.he.toLowerCase();
            const descEn = event.description.en.toLowerCase();
            const descHe = event.description.he.toLowerCase();

            if (nameEn.includes(query) || nameHe.includes(query) ||
                descEn.includes(query) || descHe.includes(query) ||
                event.tags.some(tag => tag.toLowerCase().includes(query))) {
                results.events.push(event);
            }
        });

        // Search people
        biblicalData.people.forEach(person => {
            const nameEn = person.name.en.toLowerCase();
            const nameHe = person.name.he.toLowerCase();
            const roleEn = person.role.en.toLowerCase();
            const roleHe = person.role.he.toLowerCase();

            if (nameEn.includes(query) || nameHe.includes(query) ||
                roleEn.includes(query) || roleHe.includes(query)) {
                results.people.push(person);
            }
        });

        // Search periods
        biblicalData.periods.forEach(period => {
            const nameEn = period.name.en.toLowerCase();
            const nameHe = period.name.he.toLowerCase();
            const descEn = period.description.en.toLowerCase();
            const descHe = period.description.he.toLowerCase();

            if (nameEn.includes(query) || nameHe.includes(query) ||
                descEn.includes(query) || descHe.includes(query)) {
                results.periods.push(period);
            }
        });

        return results;
    }

    displayResults() {
        const modal = document.getElementById('detailModal');
        const modalBody = document.getElementById('modalBody');

        const totalResults = this.searchResults.events.length +
                           this.searchResults.people.length +
                           this.searchResults.periods.length;

        const title = languageManager.currentLang === 'en'
            ? `Search Results (${totalResults} found)`
            : `תוצאות חיפוש (${totalResults} נמצאו)`;

        let html = `<h2>${title}</h2>`;

        if (totalResults === 0) {
            html += `
                <p style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    ${languageManager.currentLang === 'en'
                        ? 'No results found. Try a different search term.'
                        : 'לא נמצאו תוצאות. נסה מונח חיפוש אחר.'}
                </p>
            `;
        } else {
            // Events
            if (this.searchResults.events.length > 0) {
                html += `
                    <h3 style="color: var(--vintage-burgundy); margin-top: 1.5rem; margin-bottom: 1rem;">
                        ${languageManager.currentLang === 'en' ? 'Events' : 'אירועים'}
                    </h3>
                `;

                this.searchResults.events.forEach(event => {
                    const name = languageManager.getText(event.name);
                    const desc = languageManager.getText(event.description);

                    html += `
                        <div class="event-card" onclick="window.searchManager.viewEvent('${event.id}')">
                            <h4>${name}</h4>
                            <div class="event-date">${Math.abs(event.year)} BCE</div>
                            <div class="event-description">${desc.substring(0, 100)}...</div>
                        </div>
                    `;
                });
            }

            // People
            if (this.searchResults.people.length > 0) {
                html += `
                    <h3 style="color: var(--vintage-burgundy); margin-top: 1.5rem; margin-bottom: 1rem;">
                        ${languageManager.currentLang === 'en' ? 'People' : 'אנשים'}
                    </h3>
                `;

                this.searchResults.people.forEach(person => {
                    const name = languageManager.getText(person.name);
                    const role = languageManager.getText(person.role);

                    html += `
                        <div class="event-card" onclick="window.searchManager.viewPerson('${person.id}')">
                            <h4>${name}</h4>
                            <div class="event-date">${role}</div>
                        </div>
                    `;
                });
            }

            // Periods
            if (this.searchResults.periods.length > 0) {
                html += `
                    <h3 style="color: var(--vintage-burgundy); margin-top: 1.5rem; margin-bottom: 1rem;">
                        ${languageManager.currentLang === 'en' ? 'Periods' : 'תקופות'}
                    </h3>
                `;

                this.searchResults.periods.forEach(period => {
                    const name = languageManager.getText(period.name);
                    const desc = languageManager.getText(period.description);

                    html += `
                        <div class="event-card" onclick="window.searchManager.viewPeriod('${period.id}')">
                            <h4>${name}</h4>
                            <div class="event-description">${desc}</div>
                        </div>
                    `;
                });
            }
        }

        modalBody.innerHTML = html;
        modal.classList.add('active');
    }

    viewEvent(eventId) {
        const event = biblicalData.events.find(e => e.id === eventId);
        if (event && window.timelineManager) {
            document.getElementById('detailModal').classList.remove('active');
            document.querySelector('[data-page="timeline"]').click();
            setTimeout(() => {
                window.timelineManager.showEventDetails(event);
            }, 300);
        }
    }

    viewPerson(personId) {
        const person = biblicalData.people.find(p => p.id === personId);
        if (person && window.favoritesManager) {
            window.favoritesManager.showPersonDetails(person);
        }
    }

    viewPeriod(periodId) {
        document.getElementById('detailModal').classList.remove('active');
        document.querySelector('[data-page="timeline"]').click();
        setTimeout(() => {
            const periodBtn = document.querySelector(`[data-period="${periodId}"]`);
            if (periodBtn) {
                periodBtn.click();
            }
        }, 300);
    }

    showSuggestions(query) {
        // TODO: Implement autocomplete suggestions
        // This could show a dropdown with quick suggestions
    }

    hideSuggestions() {
        // TODO: Hide autocomplete suggestions
    }
}

// Initialize search manager
window.searchManager = null;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.searchManager = new SearchManager();
    });
} else {
    window.searchManager = new SearchManager();
}
