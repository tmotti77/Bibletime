// Chart-Based Timeline - Uses actual biblical chart images with interactive overlays

class ChartTimelineManager {
    constructor() {
        this.chartImage = document.getElementById('chartImage');
        this.chartContainer = document.getElementById('chartContainer');
        this.chartHotspots = document.getElementById('chartHotspots');
        this.chartSelector = document.getElementById('chartSelector');
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.currentChart = 'overview';

        if (this.chartImage) {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.loadChart(this.currentChart);
        this.createHotspots();
    }

    setupEventListeners() {
        // Chart selector
        if (this.chartSelector) {
            this.chartSelector.addEventListener('change', (e) => {
                this.loadChart(e.target.value);
            });
        }

        // Zoom controls
        document.getElementById('zoomIn')?.addEventListener('click', () => this.zoom(1.2));
        document.getElementById('zoomOut')?.addEventListener('click', () => this.zoom(0.8));
        document.getElementById('resetView')?.addEventListener('click', () => this.resetView());
        document.getElementById('fullscreen')?.addEventListener('click', () => this.toggleFullscreen());

        // Pan functionality
        this.chartContainer?.addEventListener('mousedown', (e) => this.startDrag(e));
        this.chartContainer?.addEventListener('mousemove', (e) => this.drag(e));
        this.chartContainer?.addEventListener('mouseup', () => this.endDrag());
        this.chartContainer?.addEventListener('mouseleave', () => this.endDrag());

        // Touch events
        this.chartContainer?.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.chartContainer?.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.chartContainer?.addEventListener('touchend', () => this.endDrag());

        // Language change
        window.addEventListener('languageChange', () => {
            this.createHotspots();
        });
    }

    loadChart(chartType) {
        this.currentChart = chartType;

        const charts = {
            'overview': 'infoimage/Screenshot 2025-11-11 074429.png',
            'detailed': 'infoimage/Screenshot 2025-11-11 074452.png',
            'people': 'infoimage/Screenshot 2025-11-11 074515.png',
            'culture': 'infoimage/Screenshot 2025-11-11 074526.png'
        };

        if (this.chartImage) {
            this.chartImage.src = charts[chartType] || charts['overview'];
            this.chartImage.onload = () => {
                this.createHotspots();
            };
        }
    }

    createHotspots() {
        if (!this.chartHotspots) return;

        this.chartHotspots.innerHTML = '';

        // Define hotspot areas based on chart type
        const hotspots = this.getHotspotsForChart(this.currentChart);

        hotspots.forEach(hotspot => {
            const hotspotEl = document.createElement('div');
            hotspotEl.className = 'chart-hotspot';
            hotspotEl.style.left = hotspot.x + '%';
            hotspotEl.style.top = hotspot.y + '%';
            hotspotEl.style.width = hotspot.width + '%';
            hotspotEl.style.height = hotspot.height + '%';
            hotspotEl.title = languageManager.getText(hotspot.name);

            hotspotEl.addEventListener('click', () => {
                this.showHotspotDetails(hotspot);
            });

            this.chartHotspots.appendChild(hotspotEl);
        });
    }

    getHotspotsForChart(chartType) {
        // These coordinates correspond to areas on the actual chart images
        const hotspotData = {
            'overview': [
                {
                    id: 'creation_area',
                    name: { en: 'Creation Period', he: 'תקופת הבריאה' },
                    x: 5, y: 15, width: 15, height: 20,
                    description: { en: 'From creation to the flood', he: 'מהבריאה עד המבול' }
                },
                {
                    id: 'patriarchs_area',
                    name: { en: 'Age of Patriarchs', he: 'תקופת האבות' },
                    x: 22, y: 15, width: 15, height: 20,
                    description: { en: 'Abraham, Isaac, and Jacob', he: 'אברהם, יצחק ויעקב' }
                },
                {
                    id: 'exodus_area',
                    name: { en: 'Exodus & Wandering', he: 'יציאת מצרים והנדודים' },
                    x: 40, y: 15, width: 12, height: 20,
                    description: { en: 'Moses leads Israel from Egypt', he: 'משה מוביל את ישראל ממצרים' }
                },
                {
                    id: 'judges_area',
                    name: { en: 'Period of Judges', he: 'תקופת השופטים' },
                    x: 54, y: 15, width: 12, height: 20,
                    description: { en: 'Deborah, Gideon, Samson', he: 'דבורה, גדעון, שמשון' }
                },
                {
                    id: 'kings_area',
                    name: { en: 'United & Divided Kingdom', he: 'הממלכה המאוחדת והמפולגת' },
                    x: 68, y: 15, width: 15, height: 20,
                    description: { en: 'David, Solomon, and the divided kingdoms', he: 'דוד, שלמה והממלכות המפולגות' }
                },
                {
                    id: 'exile_area',
                    name: { en: 'Exile & Return', he: 'גלות ושיבה' },
                    x: 85, y: 15, width: 10, height: 20,
                    description: { en: 'Babylonian exile and return', he: 'גלות בבל ושיבה' }
                }
            ],
            'people': [
                {
                    id: 'adam',
                    name: { en: 'Adam - 930 years', he: 'אדם - 930 שנה' },
                    x: 8, y: 40, width: 8, height: 8,
                    description: { en: 'First man, lived 930 years', he: 'האדם הראשון, חי 930 שנה' }
                },
                {
                    id: 'noah',
                    name: { en: 'Noah - 950 years', he: 'נח - 950 שנה' },
                    x: 18, y: 42, width: 8, height: 8,
                    description: { en: 'Ark builder, lived 950 years', he: 'בונה התיבה, חי 950 שנה' }
                },
                {
                    id: 'abraham',
                    name: { en: 'Abraham - 175 years', he: 'אברהם - 175 שנה' },
                    x: 28, y: 38, width: 8, height: 8,
                    description: { en: 'Father of faith, lived 175 years', he: 'אבי האמונה, חי 175 שנה' }
                },
                {
                    id: 'moses',
                    name: { en: 'Moses - 120 years', he: 'משה - 120 שנה' },
                    x: 45, y: 40, width: 8, height: 8,
                    description: { en: 'Lawgiver, lived 120 years', he: 'מחוקק, חי 120 שנה' }
                },
                {
                    id: 'david',
                    name: { en: 'David - 70 years', he: 'דוד - 70 שנה' },
                    x: 72, y: 42, width: 8, height: 8,
                    description: { en: 'King of Israel, lived 70 years', he: 'מלך ישראל, חי 70 שנה' }
                }
            ],
            'culture': [
                {
                    id: 'clothing',
                    name: { en: 'Biblical Clothing', he: 'לבוש מקראי' },
                    x: 15, y: 60, width: 12, height: 15,
                    description: { en: 'Tunics, cloaks, and priestly garments', he: 'כתונות, שמלות ובגדי כהונה' }
                },
                {
                    id: 'tools',
                    name: { en: 'Tools & Implements', he: 'כלים וציוד' },
                    x: 30, y: 65, width: 15, height: 12,
                    description: { en: 'Agricultural and household tools', he: 'כלי חקלאות ובית' }
                },
                {
                    id: 'tabernacle',
                    name: { en: 'The Tabernacle', he: 'המשכן' },
                    x: 50, y: 60, width: 20, height: 18,
                    description: { en: 'Portable temple in the wilderness', he: 'מקדש נייד במדבר' }
                }
            ]
        };

        return hotspotData[chartType] || hotspotData['overview'];
    }

    showHotspotDetails(hotspot) {
        const modal = document.getElementById('detailModal');
        const modalBody = document.getElementById('modalBody');

        const name = languageManager.getText(hotspot.name);
        const desc = languageManager.getText(hotspot.description);

        // Find related events/people
        let relatedContent = '';

        if (hotspot.id.includes('area')) {
            // Find events in this period
            const periodId = hotspot.id.replace('_area', '');
            const events = biblicalData.events.filter(e => e.period === periodId).slice(0, 3);

            if (events.length > 0) {
                relatedContent = `
                    <h3 style="margin-top: 1.5rem; margin-bottom: 1rem; color: var(--vintage-burgundy);">
                        ${languageManager.currentLang === 'en' ? 'Key Events' : 'אירועים מרכזיים'}
                    </h3>
                `;

                events.forEach(event => {
                    const eventName = languageManager.getText(event.name);
                    const eventDesc = languageManager.getText(event.description);
                    relatedContent += `
                        <div class="event-card" style="margin-bottom: 1rem;">
                            <h4>${eventName}</h4>
                            <div class="event-date">${Math.abs(event.year)} BCE</div>
                            <p style="margin-top: 0.5rem;">${eventDesc}</p>
                        </div>
                    `;
                });
            }
        } else if (biblicalData.people.some(p => p.id === hotspot.id)) {
            // Show person details
            const person = biblicalData.people.find(p => p.id === hotspot.id);
            if (person) {
                const yearsLived = person.lifespan ? Math.abs(person.lifespan.born - person.lifespan.died) : 0;
                relatedContent = `
                    <div style="background: var(--vintage-paper); padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem; border-left: 4px solid var(--vintage-burgundy);">
                        <h3 style="color: var(--vintage-burgundy); margin-bottom: 1rem;">
                            ${languageManager.currentLang === 'en' ? 'Lifespan' : 'תקופת חיים'}
                        </h3>
                        <p style="font-size: 1.1rem;">
                            <strong>${yearsLived} ${languageManager.currentLang === 'en' ? 'years' : 'שנים'}</strong>
                        </p>
                        <p style="margin-top: 0.5rem; color: var(--text-secondary);">
                            ${Math.abs(person.lifespan.born)} - ${Math.abs(person.lifespan.died)} BCE
                        </p>
                    </div>
                `;
            }
        }

        modalBody.innerHTML = `
            <h2>${name}</h2>
            <p style="font-size: 1.1rem; line-height: 1.8; margin-top: 1rem;">${desc}</p>
            ${relatedContent}
        `;

        modal.classList.add('active');

        // Set up favorite button
        const favoriteBtn = document.getElementById('modalFavorite');
        if (window.favoritesManager) {
            const isFavorited = window.favoritesManager.isFavorite(hotspot.id);
            favoriteBtn.classList.toggle('favorited', isFavorited);
            favoriteBtn.onclick = () => {
                window.favoritesManager.toggleFavorite({
                    id: hotspot.id,
                    type: 'hotspot',
                    name: hotspot.name,
                    data: hotspot
                });
                favoriteBtn.classList.toggle('favorited');
            };
        }
    }

    zoom(factor) {
        this.zoomLevel *= factor;
        this.zoomLevel = Math.max(0.5, Math.min(3, this.zoomLevel));
        this.updateZoomDisplay();
        this.applyTransform();
    }

    resetView() {
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.updateZoomDisplay();
        this.applyTransform();
    }

    updateZoomDisplay() {
        const zoomDisplay = document.getElementById('zoomLevel');
        if (zoomDisplay) {
            zoomDisplay.textContent = Math.round(this.zoomLevel * 100) + '%';
        }
    }

    applyTransform() {
        if (this.chartContainer) {
            this.chartContainer.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomLevel})`;
            this.chartContainer.style.transformOrigin = 'top left';
        }
    }

    startDrag(e) {
        // Don't drag if clicking on a hotspot
        if (e.target.classList.contains('chart-hotspot')) return;

        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        if (this.chartContainer) {
            this.chartContainer.style.cursor = 'grabbing';
        }
    }

    drag(e) {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;

        this.panX += deltaX;
        this.panY += deltaY;

        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;

        this.applyTransform();
    }

    endDrag() {
        this.isDragging = false;
        if (this.chartContainer) {
            this.chartContainer.style.cursor = 'grab';
        }
    }

    handleTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.lastMouseX = touch.clientX;
            this.lastMouseY = touch.clientY;
            this.isDragging = true;
        }
    }

    handleTouchMove(e) {
        if (e.touches.length === 1 && this.isDragging) {
            e.preventDefault();
            const touch = e.touches[0];
            const deltaX = touch.clientX - this.lastMouseX;
            const deltaY = touch.clientY - this.lastMouseY;

            this.panX += deltaX;
            this.panY += deltaY;

            this.lastMouseX = touch.clientX;
            this.lastMouseY = touch.clientY;

            this.applyTransform();
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.chartContainer?.parentElement?.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }
}

// Initialize chart timeline manager
let chartTimelineManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        chartTimelineManager = new ChartTimelineManager();
    });
} else {
    chartTimelineManager = new ChartTimelineManager();
}
