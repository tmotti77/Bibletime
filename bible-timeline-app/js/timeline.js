// Interactive Timeline Component with Zoom/Pan

class TimelineManager {
    constructor() {
        this.canvas = document.getElementById('timelineCanvas');
        this.overlay = document.getElementById('timelineOverlay');
        this.container = document.getElementById('timelineContainer');
        this.ctx = null;
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.currentFilter = 'all';
        this.hoveredItem = null;

        if (this.canvas) {
            this.init();
        }
    }

    init() {
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.setupEventListeners();
        this.renderTimeline();
        this.setupLegend();
    }

    setupCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = 600;
    }

    setupEventListeners() {
        // Zoom controls
        document.getElementById('zoomIn')?.addEventListener('click', () => this.zoom(1.2));
        document.getElementById('zoomOut')?.addEventListener('click', () => this.zoom(0.8));
        document.getElementById('resetView')?.addEventListener('click', () => this.resetView());

        // Period filters
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.getAttribute('data-period');
                this.renderTimeline();
            });
        });

        // Mouse events for pan
        this.canvas.addEventListener('mousedown', (e) => this.startDrag(e));
        this.canvas.addEventListener('mousemove', (e) => this.drag(e));
        this.canvas.addEventListener('mouseup', () => this.endDrag());
        this.canvas.addEventListener('mouseleave', () => this.endDrag());

        // Mouse move for hover effects
        this.canvas.addEventListener('mousemove', (e) => this.handleHover(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', () => this.endDrag());

        // Window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.renderTimeline();
        });

        // Language change
        window.addEventListener('languageChange', () => {
            this.renderTimeline();
            this.setupLegend();
        });
    }

    zoom(factor) {
        this.zoomLevel *= factor;
        this.zoomLevel = Math.max(0.5, Math.min(3, this.zoomLevel)); // Limit zoom 0.5x to 3x
        this.updateZoomDisplay();
        this.renderTimeline();
    }

    resetView() {
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.updateZoomDisplay();
        this.renderTimeline();
    }

    updateZoomDisplay() {
        const zoomDisplay = document.getElementById('zoomLevel');
        if (zoomDisplay) {
            zoomDisplay.textContent = Math.round(this.zoomLevel * 100) + '%';
        }
    }

    startDrag(e) {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
    }

    drag(e) {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;

        this.panX += deltaX;
        this.panY += deltaY;

        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;

        this.renderTimeline();
    }

    endDrag() {
        this.isDragging = false;
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

            this.renderTimeline();
        }
    }

    handleHover(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - this.panX) / this.zoomLevel;
        const mouseY = (e.clientY - rect.top - this.panY) / this.zoomLevel;

        // Check if hovering over any event
        const hoveredEvent = this.getEventAtPosition(mouseX, mouseY);

        if (hoveredEvent) {
            this.canvas.style.cursor = 'pointer';
            this.showTooltip(hoveredEvent, e.clientX, e.clientY);
        } else {
            this.canvas.style.cursor = this.isDragging ? 'grabbing' : 'grab';
            this.hideTooltip();
        }
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - this.panX) / this.zoomLevel;
        const mouseY = (e.clientY - rect.top - this.panY) / this.zoomLevel;

        const clickedEvent = this.getEventAtPosition(mouseX, mouseY);

        if (clickedEvent) {
            this.showEventDetails(clickedEvent);
        }
    }

    getEventAtPosition(x, y) {
        const events = this.getFilteredEvents();

        for (let event of events) {
            const eventX = this.yearToX(event.year);
            const eventY = this.getEventY(event);
            const radius = 12;

            const distance = Math.sqrt(Math.pow(x - eventX, 2) + Math.pow(y - eventY, 2));

            if (distance <= radius) {
                return event;
            }
        }

        return null;
    }

    showTooltip(event, screenX, screenY) {
        let tooltip = document.getElementById('timelineTooltip');

        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'timelineTooltip';
            tooltip.className = 'timeline-tooltip';
            this.overlay.appendChild(tooltip);
        }

        const name = languageManager.getText(event.name);
        const desc = languageManager.getText(event.description);

        tooltip.innerHTML = `
            <h4>${name}</h4>
            <p>${Math.abs(event.year)} ${event.year < 0 ? 'BCE' : 'CE'}</p>
        `;

        tooltip.style.left = (screenX - this.container.getBoundingClientRect().left + 10) + 'px';
        tooltip.style.top = (screenY - this.container.getBoundingClientRect().top + 10) + 'px';
        tooltip.classList.add('visible');
    }

    hideTooltip() {
        const tooltip = document.getElementById('timelineTooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
    }

    showEventDetails(event) {
        const modal = document.getElementById('detailModal');
        const modalBody = document.getElementById('modalBody');

        const name = languageManager.getText(event.name);
        const desc = languageManager.getText(event.description);
        const period = biblicalData.periods.find(p => p.id === event.period);
        const periodName = period ? languageManager.getText(period.name) : '';

        modalBody.innerHTML = `
            <h2>${name}</h2>
            <div style="color: var(--vintage-gold); font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">
                ${Math.abs(event.year)} ${event.year < 0 ? 'BCE' : 'CE'}
            </div>
            <div style="background: var(--vintage-tan); padding: 0.5rem 1rem; border-radius: 6px; display: inline-block; margin-bottom: 1rem;">
                ${periodName}
            </div>
            <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 1rem;">${desc}</p>
            ${event.reference ? `<p style="font-style: italic; color: var(--text-secondary);">Reference: ${event.reference}</p>` : ''}
            <div style="margin-top: 1.5rem;">
                ${event.tags.map(tag => `<span class="event-tag">${tag}</span>`).join(' ')}
            </div>
        `;

        modal.classList.add('active');

        // Set up favorite button
        const favoriteBtn = document.getElementById('modalFavorite');
        if (window.favoritesManager) {
            const isFavorited = window.favoritesManager.isFavorite(event.id);
            favoriteBtn.classList.toggle('favorited', isFavorited);
            favoriteBtn.onclick = () => {
                window.favoritesManager.toggleFavorite({
                    id: event.id,
                    type: 'event',
                    name: event.name,
                    data: event
                });
                favoriteBtn.classList.toggle('favorited');
            };
        }
    }

    getFilteredEvents() {
        if (this.currentFilter === 'all') {
            return biblicalData.events;
        }
        return biblicalData.events.filter(event => event.period === this.currentFilter);
    }

    getFilteredPeriods() {
        if (this.currentFilter === 'all') {
            return biblicalData.periods;
        }
        return biblicalData.periods.filter(period => period.id === this.currentFilter);
    }

    yearToX(year) {
        // Convert year to X position on canvas
        const minYear = -4004;
        const maxYear = -400;
        const totalYears = maxYear - minYear;
        const yearOffset = year - minYear;
        const percentage = yearOffset / totalYears;

        return 50 + (percentage * (this.canvas.width - 100));
    }

    getEventY(event) {
        // Distribute events vertically based on their period
        const periods = biblicalData.periods;
        const periodIndex = periods.findIndex(p => p.id === event.period);

        return 100 + (periodIndex * 60) + (Math.random() * 30);
    }

    renderTimeline() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Save context state
        this.ctx.save();

        // Apply zoom and pan transformations
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.zoomLevel, this.zoomLevel);

        // Draw timeline background
        this.drawTimelineBackground();

        // Draw periods
        this.drawPeriods();

        // Draw main timeline line
        this.drawMainLine();

        // Draw events
        this.drawEvents();

        // Draw year labels
        this.drawYearLabels();

        // Restore context state
        this.ctx.restore();
    }

    drawTimelineBackground() {
        // Draw subtle grid
        this.ctx.strokeStyle = 'rgba(139, 115, 85, 0.1)';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.canvas.height; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }
    }

    drawPeriods() {
        const periods = this.getFilteredPeriods();

        periods.forEach((period, index) => {
            const startX = this.yearToX(period.startYear);
            const endX = this.yearToX(period.endYear);
            const y = 50 + (index * 60);
            const height = 40;

            // Draw period rectangle
            this.ctx.fillStyle = period.color + '33'; // Add transparency
            this.ctx.fillRect(startX, y, endX - startX, height);

            // Draw period border
            this.ctx.strokeStyle = period.color;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(startX, y, endX - startX, height);

            // Draw period name
            this.ctx.fillStyle = '#2c2416';
            this.ctx.font = 'bold 14px Georgia';
            this.ctx.textAlign = 'center';
            const periodName = languageManager.getText(period.name);
            this.ctx.fillText(periodName, startX + (endX - startX) / 2, y + 25);
        });
    }

    drawMainLine() {
        const minYear = -4004;
        const maxYear = -400;

        const startX = this.yearToX(minYear);
        const endX = this.yearToX(maxYear);
        const y = this.canvas.height / 2;

        this.ctx.strokeStyle = '#8b7355';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, y);
        this.ctx.lineTo(endX, y);
        this.ctx.stroke();
    }

    drawEvents() {
        const events = this.getFilteredEvents();

        events.forEach(event => {
            const x = this.yearToX(event.year);
            const y = this.getEventY(event);

            // Draw event marker
            const period = biblicalData.periods.find(p => p.id === event.period);
            const color = period ? period.color : '#6b2c2c';

            // Draw outer circle
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 12, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw border
            this.ctx.strokeStyle = '#b8860b';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            // Draw inner dot for major events
            if (event.tags.includes('major')) {
                this.ctx.fillStyle = 'white';
                this.ctx.beginPath();
                this.ctx.arc(x, y, 5, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Draw connecting line to timeline
            this.ctx.strokeStyle = color + '88';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 3]);
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, this.canvas.height / 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        });
    }

    drawYearLabels() {
        const yearMarkers = [-4000, -3000, -2000, -1500, -1000, -500];

        this.ctx.fillStyle = '#2c2416';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';

        yearMarkers.forEach(year => {
            const x = this.yearToX(year);
            const y = this.canvas.height - 20;

            // Draw tick mark
            this.ctx.strokeStyle = '#8b7355';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y - 10);
            this.ctx.lineTo(x, y + 10);
            this.ctx.stroke();

            // Draw year label
            this.ctx.fillText(Math.abs(year) + ' BCE', x, y + 25);
        });
    }

    setupLegend() {
        const legendItems = document.getElementById('legendItems');
        if (!legendItems) return;

        legendItems.innerHTML = '';

        biblicalData.periods.forEach(period => {
            const item = document.createElement('div');
            item.className = 'legend-item';

            const colorBox = document.createElement('div');
            colorBox.className = 'legend-color';
            colorBox.style.backgroundColor = period.color;

            const label = document.createElement('span');
            label.textContent = languageManager.getText(period.name);

            item.appendChild(colorBox);
            item.appendChild(label);
            legendItems.appendChild(item);
        });
    }
}

// Initialize timeline when DOM is ready
let timelineManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        timelineManager = new TimelineManager();
    });
} else {
    timelineManager = new TimelineManager();
}
