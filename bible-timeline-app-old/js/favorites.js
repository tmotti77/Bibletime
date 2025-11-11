// Favorites/Bookmarks System

class FavoritesManager {
    constructor() {
        this.favorites = this.loadFavorites();
        this.favoritesContainer = document.getElementById('favoritesContainer');

        this.init();
    }

    init() {
        this.renderFavorites();

        // Language change
        window.addEventListener('languageChange', () => {
            this.renderFavorites();
        });
    }

    toggleFavorite(item) {
        const index = this.favorites.findIndex(f => f.id === item.id && f.type === item.type);

        if (index > -1) {
            // Remove from favorites
            this.favorites.splice(index, 1);
        } else {
            // Add to favorites
            this.favorites.push(item);
        }

        this.saveFavorites();
        this.renderFavorites();

        // Trigger event for other components
        window.dispatchEvent(new CustomEvent('favoritesChange', {
            detail: { favorites: this.favorites }
        }));
    }

    isFavorite(itemId) {
        return this.favorites.some(f => f.id === itemId);
    }

    loadFavorites() {
        const saved = localStorage.getItem('biblicalTimelineFavorites');
        return saved ? JSON.parse(saved) : [];
    }

    saveFavorites() {
        localStorage.setItem('biblicalTimelineFavorites', JSON.stringify(this.favorites));
    }

    renderFavorites() {
        if (!this.favoritesContainer) return;

        if (this.favorites.length === 0) {
            const emptyText = languageManager.currentLang === 'en'
                ? 'No favorites yet. Click the ⭐ icon on any item to bookmark it!'
                : 'אין מועדפים עדיין. לחץ על אייקון ⭐ על כל פריט כדי לסמן אותו!';

            this.favoritesContainer.innerHTML = `
                <p class="empty-state">${emptyText}</p>
            `;
            return;
        }

        let html = '';

        this.favorites.forEach(favorite => {
            const name = languageManager.getText(favorite.name);
            const typeLabel = this.getTypeLabel(favorite.type);

            html += `
                <div class="favorite-item">
                    <div>
                        <strong>${name}</strong>
                        <span style="
                            background: var(--vintage-tan);
                            padding: 2px 8px;
                            border-radius: 12px;
                            font-size: 0.75rem;
                            margin-left: 0.5rem;
                        ">${typeLabel}</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button
                            onclick="window.favoritesManager.viewItem('${favorite.id}', '${favorite.type}')"
                            style="
                                background: var(--vintage-navy);
                                color: white;
                                border: none;
                                padding: 0.5rem 1rem;
                                border-radius: 6px;
                                cursor: pointer;
                            "
                        >
                            ${languageManager.currentLang === 'en' ? 'View' : 'צפה'}
                        </button>
                        <button
                            onclick="window.favoritesManager.removeFavorite('${favorite.id}', '${favorite.type}')"
                            style="
                                background: var(--vintage-burgundy);
                                color: white;
                                border: none;
                                padding: 0.5rem 1rem;
                                border-radius: 6px;
                                cursor: pointer;
                            "
                        >
                            ${languageManager.currentLang === 'en' ? 'Remove' : 'הסר'}
                        </button>
                    </div>
                </div>
            `;
        });

        this.favoritesContainer.innerHTML = html;
    }

    getTypeLabel(type) {
        const labels = {
            'event': { en: 'Event', he: 'אירוע' },
            'location': { en: 'Location', he: 'מיקום' },
            'person': { en: 'Person', he: 'דמות' },
            'artifact': { en: 'Artifact', he: 'חפץ' }
        };

        return languageManager.getText(labels[type] || { en: type, he: type });
    }

    viewItem(itemId, itemType) {
        // Find the item in the data
        let item = null;

        if (itemType === 'event') {
            item = biblicalData.events.find(e => e.id === itemId);
            if (item && window.timelineManager) {
                // Switch to timeline page
                document.querySelector('[data-page="timeline"]').click();
                // Show event details
                window.timelineManager.showEventDetails(item);
            }
        } else if (itemType === 'location') {
            // Find in map locations
            const favorite = this.favorites.find(f => f.id === itemId && f.type === 'location');
            if (favorite && window.mapsManager) {
                // Switch to maps page
                document.querySelector('[data-page="maps"]').click();
                // Show location details
                window.mapsManager.showLocationDetails(favorite.data);
            }
        } else if (itemType === 'person') {
            item = biblicalData.people.find(p => p.id === itemId);
            if (item) {
                // Show person details in modal
                this.showPersonDetails(item);
            }
        }
    }

    showPersonDetails(person) {
        const modal = document.getElementById('detailModal');
        const modalBody = document.getElementById('modalBody');

        const name = languageManager.getText(person.name);
        const role = languageManager.getText(person.role);
        const desc = languageManager.getText(person.description);

        modalBody.innerHTML = `
            <h2>${name}</h2>
            <div style="color: var(--vintage-gold); font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">
                ${role}
            </div>
            <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 1rem;">${desc}</p>
            ${person.lifespan ? `
                <p style="font-style: italic; color: var(--text-secondary);">
                    ${languageManager.currentLang === 'en' ? 'Lived:' : 'חי:'}
                    ${Math.abs(person.lifespan.born)} - ${Math.abs(person.lifespan.died)} BCE
                </p>
            ` : ''}
        `;

        modal.classList.add('active');
    }

    removeFavorite(itemId, itemType) {
        const index = this.favorites.findIndex(f => f.id === itemId && f.type === itemType);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
            this.renderFavorites();
        }
    }
}

// Initialize favorites manager
window.favoritesManager = null;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.favoritesManager = new FavoritesManager();
    });
} else {
    window.favoritesManager = new FavoritesManager();
}
