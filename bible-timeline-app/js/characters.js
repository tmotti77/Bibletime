// Characters Manager - Shows character bubbles with lifespans, relationships, and contemporaries

class CharactersManager {
    constructor() {
        this.charactersGrid = document.getElementById('charactersGrid');
        this.charactersTimelineView = document.getElementById('charactersTimelineView');
        this.currentFilter = 'all';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCharacters();
        this.renderTimelineView();
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.getAttribute('data-filter');
                this.renderCharacters();
                this.renderTimelineView();
            });
        });

        // Language change
        window.addEventListener('languageChange', () => {
            this.renderCharacters();
            this.renderTimelineView();
        });
    }

    getFilteredCharacters() {
        let characters = [...biblicalData.people];

        if (this.currentFilter !== 'all') {
            characters = characters.filter(char => {
                const category = this.getCharacterCategory(char);
                return category === this.currentFilter;
            });
        }

        return characters;
    }

    getCharacterCategory(character) {
        // Categorize based on period and role
        if (['abraham', 'isaac', 'jacob'].includes(character.id)) {
            return 'patriarchs';
        } else if (['moses', 'joshua', 'samuel'].includes(character.id)) {
            return 'leaders';
        } else if (['saul', 'david', 'solomon'].includes(character.id)) {
            return 'kings';
        } else if (['elijah', 'elisha', 'isaiah'].includes(character.id)) {
            return 'prophets';
        }
        return 'leaders';
    }

    renderCharacters() {
        if (!this.charactersGrid) return;

        const characters = this.getFilteredCharacters();

        let html = '';

        characters.forEach(character => {
            const name = languageManager.getText(character.name);
            const role = languageManager.getText(character.role);
            const desc = languageManager.getText(character.description);
            const yearsLived = character.lifespan ?
                Math.abs(character.lifespan.born - character.lifespan.died) : 0;

            // Find contemporaries
            const contemporaries = this.findContemporaries(character);
            const contemporariesText = contemporaries.length > 0 ?
                contemporaries.map(c => languageManager.getText(c.name)).join(', ') :
                (languageManager.currentLang === 'en' ? 'None recorded' : 'לא נרשם');

            html += `
                <div class="character-card" onclick="window.charactersManager.showCharacterDetails('${character.id}')">
                    <div class="character-card-header">
                        <h3>${name}</h3>
                        <div class="character-role">${role}</div>
                    </div>

                    <div class="character-lifespan-badge">
                        <div class="lifespan-years">${yearsLived} ${languageManager.currentLang === 'en' ? 'years' : 'שנים'}</div>
                        <div class="lifespan-dates">
                            ${character.lifespan ? `${Math.abs(character.lifespan.born)} - ${Math.abs(character.lifespan.died)} BCE` : 'Dates unknown'}
                        </div>
                    </div>

                    <p class="character-description">${desc.substring(0, 120)}...</p>

                    <div class="character-contemporaries">
                        <strong>${languageManager.currentLang === 'en' ? 'Lived with:' : ':חי עם'}</strong>
                        <p>${contemporariesText}</p>
                    </div>

                    <div class="character-period-tag">
                        ${languageManager.getText(biblicalData.periods.find(p => p.id === character.period)?.name || { en: '', he: '' })}
                    </div>
                </div>
            `;
        });

        if (html === '') {
            html = `
                <p style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    ${languageManager.currentLang === 'en' ? 'No characters found in this category' : 'לא נמצאו דמויות בקטגוריה זו'}
                </p>
            `;
        }

        this.charactersGrid.innerHTML = html;
    }

    renderTimelineView() {
        if (!this.charactersTimelineView) return;

        const characters = this.getFilteredCharacters();

        // Sort by birth year
        const sortedCharacters = characters.sort((a, b) => {
            const aYear = a.lifespan ? a.lifespan.born : -4000;
            const bYear = b.lifespan ? b.lifespan.born : -4000;
            return aYear - bYear;
        });

        let html = `
            <div class="timeline-view-container">
                <div class="timeline-axis"></div>
        `;

        sortedCharacters.forEach((character, index) => {
            if (!character.lifespan) return;

            const name = languageManager.getText(character.name);
            const yearsLived = Math.abs(character.lifespan.born - character.lifespan.died);

            // Calculate position on timeline
            const minYear = -4004;
            const maxYear = -400;
            const totalYears = maxYear - minYear;
            const startPercent = ((character.lifespan.born - minYear) / totalYears) * 100;
            const widthPercent = (yearsLived / totalYears) * 100;

            // Alternate top/bottom for better visibility
            const topPosition = (index % 2 === 0) ? '10%' : '60%';

            html += `
                <div class="timeline-character-bubble"
                     style="left: ${startPercent}%; width: ${widthPercent}%; top: ${topPosition};"
                     onclick="window.charactersManager.showCharacterDetails('${character.id}')">
                    <div class="bubble-name">${name}</div>
                    <div class="bubble-years">${yearsLived} ${languageManager.currentLang === 'en' ? 'yrs' : 'שנים'}</div>
                    <div class="bubble-dates">${Math.abs(character.lifespan.born)}-${Math.abs(character.lifespan.died)} BCE</div>
                </div>
            `;
        });

        html += `</div>`;

        this.charactersTimelineView.innerHTML = html;
    }

    findContemporaries(character) {
        if (!character.lifespan) return [];

        const contemporaries = biblicalData.people.filter(other => {
            if (other.id === character.id || !other.lifespan) return false;

            // Check if lifespans overlap
            const charStart = character.lifespan.born;
            const charEnd = character.lifespan.died;
            const otherStart = other.lifespan.born;
            const otherEnd = other.lifespan.died;

            return (otherStart <= charEnd && otherEnd >= charStart);
        });

        return contemporaries;
    }

    showCharacterDetails(characterId) {
        const character = biblicalData.people.find(p => p.id === characterId);
        if (!character) return;

        const modal = document.getElementById('characterModal');
        const modalBody = document.getElementById('characterModalBody');

        const name = languageManager.getText(character.name);
        const role = languageManager.getText(character.role);
        const desc = languageManager.getText(character.description);
        const yearsLived = character.lifespan ?
            Math.abs(character.lifespan.born - character.lifespan.died) : 0;

        // Find contemporaries
        const contemporaries = this.findContemporaries(character);

        // Find major events during their lifetime
        const lifeEvents = character.lifespan ?
            biblicalData.events.filter(event => {
                return event.year >= character.lifespan.born && event.year <= character.lifespan.died;
            }).slice(0, 5) : [];

        let html = `
            <div class="character-detail-header">
                <h1>${name}</h1>
                <div class="character-detail-role">${role}</div>
            </div>

            <div class="character-lifespan-section">
                <h3>${languageManager.currentLang === 'en' ? 'Lifespan' : 'תקופת חיים'}</h3>
                <div class="lifespan-info-large">
                    <div class="lifespan-years-large">
                        ${yearsLived} ${languageManager.currentLang === 'en' ? 'years' : 'שנים'}
                    </div>
                    ${character.lifespan ? `
                        <div class="lifespan-range">
                            <div class="lifespan-birth">
                                <strong>${languageManager.currentLang === 'en' ? 'Born:' : ':נולד'}</strong>
                                ${Math.abs(character.lifespan.born)} BCE
                            </div>
                            <div class="lifespan-death">
                                <strong>${languageManager.currentLang === 'en' ? 'Died:' : ':נפטר'}</strong>
                                ${Math.abs(character.lifespan.died)} BCE
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="character-description-section">
                <h3>${languageManager.currentLang === 'en' ? 'About' : 'אודות'}</h3>
                <p>${desc}</p>
            </div>

            ${contemporaries.length > 0 ? `
                <div class="character-contemporaries-section">
                    <h3>${languageManager.currentLang === 'en' ? 'Contemporaries' : 'בני תקופה'}</h3>
                    <p style="margin-bottom: 1rem; color: var(--text-secondary);">
                        ${languageManager.currentLang === 'en' ? 'People who lived during the same time:' : ':אנשים שחיו באותו זמן'}
                    </p>
                    <div class="contemporaries-grid">
                        ${contemporaries.map(contemp => {
                            const contempName = languageManager.getText(contemp.name);
                            const contempRole = languageManager.getText(contemp.role);
                            return `
                                <div class="contemporary-card" onclick="window.charactersManager.showCharacterDetails('${contemp.id}')">
                                    <strong>${contempName}</strong>
                                    <div style="font-size: 0.85rem; color: var(--text-secondary);">${contempRole}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}

            ${lifeEvents.length > 0 ? `
                <div class="character-events-section">
                    <h3>${languageManager.currentLang === 'en' ? 'Events During Lifetime' : 'אירועים בתקופת חייו'}</h3>
                    <div class="events-list">
                        ${lifeEvents.map(event => {
                            const eventName = languageManager.getText(event.name);
                            const eventDesc = languageManager.getText(event.description);
                            return `
                                <div class="life-event">
                                    <div class="event-year">${Math.abs(event.year)} BCE</div>
                                    <div class="event-info">
                                        <strong>${eventName}</strong>
                                        <p>${eventDesc}</p>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}
        `;

        modalBody.innerHTML = html;
        modal.classList.add('active');

        // Set up favorite button
        const favoriteBtn = document.getElementById('characterFavorite');
        if (window.favoritesManager) {
            const isFavorited = window.favoritesManager.isFavorite(character.id);
            favoriteBtn.classList.toggle('favorited', isFavorited);
            favoriteBtn.onclick = () => {
                window.favoritesManager.toggleFavorite({
                    id: character.id,
                    type: 'person',
                    name: character.name,
                    data: character
                });
                favoriteBtn.classList.toggle('favorited');
            };
        }
    }
}

// Initialize characters manager
window.charactersManager = null;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.charactersManager = new CharactersManager();
    });
} else {
    window.charactersManager = new CharactersManager();
}
