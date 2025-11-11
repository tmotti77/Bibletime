// Timeline Visualization - Recreates the biblical chart style with horizontal bars and interactive elements

class InteractiveTimelineManager {
    constructor() {
        this.container = document.getElementById('timelineContainer');
        this.canvas = document.getElementById('timelineCanvas');
        this.ctx = null;
        this.zoomLevel = 1;
        this.scrollX = 0;
        this.isDragging = false;
        this.lastMouseX = 0;

        // Timeline configuration
        this.startYear = -4004;
        this.endYear = -400;
        this.yearRange = Math.abs(this.endYear - this.startYear);
        this.pixelsPerYear = 0.5; // Will be adjusted based on zoom

        if (this.canvas) {
            this.init();
        }
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.render();
    }

    setupCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = this.yearRange * this.pixelsPerYear * this.zoomLevel;
        this.canvas.height = 800;
        this.ctx = this.canvas.getContext('2d');
    }

    setupEventListeners() {
        // Zoom controls
        document.getElementById('zoomIn')?.addEventListener('click', () => {
            this.zoomLevel *= 1.3;
            this.setupCanvas();
            this.render();
            this.updateZoomDisplay();
        });

        document.getElementById('zoomOut')?.addEventListener('click', () => {
            this.zoomLevel /= 1.3;
            this.zoomLevel = Math.max(0.3, this.zoomLevel);
            this.setupCanvas();
            this.render();
            this.updateZoomDisplay();
        });

        document.getElementById('resetView')?.addEventListener('click', () => {
            this.zoomLevel = 1;
            this.scrollX = 0;
            this.container.scrollLeft = 0;
            this.setupCanvas();
            this.render();
            this.updateZoomDisplay();
        });

        // Pan with mouse
        this.container.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouseX = e.clientX;
        });

        this.container.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.lastMouseX;
                this.container.scrollLeft -= deltaX;
                this.lastMouseX = e.clientX;
            }
        });

        this.container.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.container.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });

        // Click on events
        this.canvas.addEventListener('click', (e) => {
            this.handleClick(e);
        });

        // Language change
        window.addEventListener('languageChange', () => {
            this.render();
        });

        // Resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.render();
        });
    }

    updateZoomDisplay() {
        const display = document.getElementById('zoomLevel');
        if (display) {
            display.textContent = Math.round(this.zoomLevel * 100) + '%';
        }
    }

    yearToX(year) {
        return (Math.abs(year - this.startYear)) * this.pixelsPerYear * this.zoomLevel;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw vintage paper background
        this.drawBackground();

        // Draw main timeline
        this.drawMainTimeline();

        // Draw period bars
        this.drawPeriodBars();

        // Draw character lifespan bars
        this.drawCharacterLifespans();

        // Draw events
        this.drawEvents();

        // Draw year markers
        this.drawYearMarkers();
    }

    drawBackground() {
        // Vintage paper texture
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#f4f1e8');
        gradient.addColorStop(1, '#e8e4d9');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Add subtle texture lines
        this.ctx.strokeStyle = 'rgba(139, 115, 85, 0.05)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.height; i += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }
    }

    drawMainTimeline() {
        const y = 100;

        // Main timeline bar
        this.ctx.strokeStyle = '#8b7355';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(50, y);
        this.ctx.lineTo(this.canvas.width - 50, y);
        this.ctx.stroke();

        // Title
        this.ctx.fillStyle = '#2c2416';
        this.ctx.font = 'bold 24px Georgia';
        this.ctx.textAlign = 'center';
        const title = languageManager.currentLang === 'en' ? 'BIBLICAL TIMELINE' : 'ציר הזמן המקראי';
        this.ctx.fillText(title, this.canvas.width / 2, 40);
    }

    drawPeriodBars() {
        const startY = 120;
        const barHeight = 60;

        biblicalData.periods.forEach((period, index) => {
            const x1 = this.yearToX(period.startYear);
            const x2 = this.yearToX(period.endYear);
            const width = x2 - x1;

            // Period bar
            this.ctx.fillStyle = period.color + '88';
            this.ctx.fillRect(x1, startY, width, barHeight);

            // Border
            this.ctx.strokeStyle = period.color;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x1, startY, width, barHeight);

            // Period name
            this.ctx.fillStyle = '#2c2416';
            this.ctx.font = 'bold 14px Georgia';
            this.ctx.textAlign = 'center';
            const name = languageManager.getText(period.name);

            // Text wrapping for long names
            const maxWidth = width - 10;
            const words = name.split(' ');
            let line = '';
            let y = startY + 25;

            words.forEach(word => {
                const testLine = line + word + ' ';
                const metrics = this.ctx.measureText(testLine);
                if (metrics.width > maxWidth && line !== '') {
                    this.ctx.fillText(line, x1 + width / 2, y);
                    line = word + ' ';
                    y += 16;
                } else {
                    line = testLine;
                }
            });
            this.ctx.fillText(line, x1 + width / 2, y);
        });
    }

    drawCharacterLifespans() {
        const startY = 220;
        const barHeight = 30;
        const spacing = 35;

        // Sort characters by birth year
        const characters = [...biblicalData.people].filter(p => p.lifespan).sort((a, b) => a.lifespan.born - b.lifespan.born);

        characters.forEach((character, index) => {
            const x1 = this.yearToX(character.lifespan.born);
            const x2 = this.yearToX(character.lifespan.died);
            const width = x2 - x1;
            const y = startY + (index * spacing);

            // Lifespan bar
            const gradient = this.ctx.createLinearGradient(x1, y, x2, y);
            gradient.addColorStop(0, '#6b2c2c');
            gradient.addColorStop(1, '#b8860b');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x1, y, width, barHeight);

            // Border
            this.ctx.strokeStyle = '#2c2416';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x1, y, width, barHeight);

            // Character name
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'left';
            const name = languageManager.getText(character.name);
            this.ctx.fillText(name, x1 + 5, y + 18);

            // Years lived
            const yearsLived = Math.abs(character.lifespan.died - character.lifespan.born);
            this.ctx.font = '10px Arial';
            this.ctx.fillText(`${yearsLived} yrs`, x1 + 5, y + 28);

            // Store click area
            character._clickArea = { x: x1, y, width, height: barHeight };
        });
    }

    drawEvents() {
        const eventsY = 220 + (biblicalData.people.filter(p => p.lifespan).length * 35) + 50;

        // Group events by period for better layout
        biblicalData.events.filter(e => e.tags.includes('major')).forEach((event, index) => {
            const x = this.yearToX(event.year);
            const y = eventsY + (Math.floor(index / 3) * 80);

            // Event marker
            this.ctx.fillStyle = '#6b2c2c';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.strokeStyle = '#b8860b';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Event line to timeline
            this.ctx.strokeStyle = '#8b735544';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(x, 100);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
            this.ctx.setLineDash([]);

            // Event name
            this.ctx.fillStyle = '#2c2416';
            this.ctx.font = '11px Georgia';
            this.ctx.textAlign = 'center';
            const name = languageManager.getText(event.name);
            this.ctx.fillText(name, x, y + 25);

            // Year
            this.ctx.font = 'bold 10px Arial';
            this.ctx.fillStyle = '#b8860b';
            this.ctx.fillText(Math.abs(event.year) + ' BCE', x, y + 38);

            // Store click area
            event._clickArea = { x: x - 30, y: y - 30, width: 60, height: 80 };
        });
    }

    drawYearMarkers() {
        const y = 100;
        const markerInterval = 500; // Every 500 years

        for (let year = this.startYear; year <= this.endYear; year += markerInterval) {
            const x = this.yearToX(year);

            // Marker line
            this.ctx.strokeStyle = '#8b7355';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y - 15);
            this.ctx.lineTo(x, y + 15);
            this.ctx.stroke();

            // Year label
            this.ctx.fillStyle = '#2c2416';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(Math.abs(year), x, y - 20);
        }
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left + this.container.scrollLeft;
        const y = e.clientY - rect.top;

        // Check character clicks
        for (let character of biblicalData.people) {
            if (character._clickArea) {
                const area = character._clickArea;
                if (x >= area.x && x <= area.x + area.width &&
                    y >= area.y && y <= area.y + area.height) {
                    this.showCharacterDetails(character);
                    return;
                }
            }
        }

        // Check event clicks
        for (let event of biblicalData.events) {
            if (event._clickArea) {
                const area = event._clickArea;
                if (x >= area.x && x <= area.x + area.width &&
                    y >= area.y && y <= area.y + area.height) {
                    this.showEventDetails(event);
                    return;
                }
            }
        }
    }

    showCharacterDetails(character) {
        if (window.charactersManager) {
            window.charactersManager.showCharacterDetails(character.id);
        }
    }

    showEventDetails(event) {
        const modal = document.getElementById('detailModal');
        const modalBody = document.getElementById('modalBody');

        const name = languageManager.getText(event.name);
        const desc = languageManager.getText(event.description);

        modalBody.innerHTML = `
            <h2>${name}</h2>
            <div style="color: var(--vintage-gold); font-weight: bold; font-size: 1.3rem; margin: 1rem 0;">
                ${Math.abs(event.year)} BCE
            </div>
            <p style="font-size: 1.1rem; line-height: 1.8;">${desc}</p>
            ${event.reference ? `<p style="margin-top: 1rem; font-style: italic; color: var(--text-secondary);">Reference: ${event.reference}</p>` : ''}
            <div style="margin-top: 1.5rem;">
                ${event.tags.map(tag => `<span class="event-tag">${tag}</span>`).join(' ')}
            </div>
        `;

        modal.classList.add('active');
    }
}

// Initialize
window.interactiveTimelineManager = null;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.interactiveTimelineManager = new InteractiveTimelineManager();
    });
} else {
    window.interactiveTimelineManager = new InteractiveTimelineManager();
}
