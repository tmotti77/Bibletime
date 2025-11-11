// Biblical Timeline - Person Bars Positioned by Dates
class BiblicalTimeline {
    constructor() {
        this.container = document.getElementById('timelineContainer');
        this.wrapper = document.getElementById('timelineWrapper');
        this.currentFilter = 'all';
        this.zoom = 1;
        this.searchTerm = '';

        // Timeline configuration
        this.startYear = -4004;
        this.endYear = -400;
        this.yearRange = Math.abs(this.endYear - this.startYear);
        this.pixelsPerYear = 1.2;
        this.timelineWidth = this.yearRange * this.pixelsPerYear;

        this.init();
    }

    init() {
        this.setupDimensions();
        this.renderYearMarkers();
        this.renderPeriodSections();
        this.renderMajorEvents();
        this.renderPeople();
        this.setupEventListeners();
        this.updateStats();
    }

    setupDimensions() {
        this.container.style.width = (this.timelineWidth * this.zoom) + 'px';
    }

    yearToX(year) {
        const offset = Math.abs(year - this.startYear);
        return 100 + (offset * this.pixelsPerYear * this.zoom);
    }

    renderYearMarkers() {
        const markersContainer = document.getElementById('timelineMarkers');
        markersContainer.innerHTML = '';

        const interval = 500;
        for (let year = this.startYear; year <= this.endYear; year += interval) {
            const x = this.yearToX(year);

            const marker = document.createElement('div');
            marker.className = 'time-marker';
            marker.style.left = x + 'px';
            markersContainer.appendChild(marker);

            const label = document.createElement('div');
            label.className = 'time-label';
            label.style.left = x + 'px';
            label.textContent = Math.abs(year);
            markersContainer.appendChild(label);
        }
    }

    renderPeriodSections() {
        const sectionsContainer = document.getElementById('periodSections');
        sectionsContainer.innerHTML = '';

        biblicalData.periods.forEach((period, index) => {
            const x1 = this.yearToX(period.startYear);
            const x2 = this.yearToX(period.endYear);
            const width = x2 - x1;

            const section = document.createElement('div');
            section.className = 'era-section';
            section.style.left = x1 + 'px';
            section.style.width = width + 'px';
            section.style.top = '100px';
            section.style.height = '1200px';

            const label = document.createElement('div');
            label.className = 'era-label';
            label.textContent = languageManager.getText(period.name);
            section.appendChild(label);

            sectionsContainer.appendChild(section);
        });
    }

    renderMajorEvents() {
        const eventsContainer = document.getElementById('majorEvents');
        eventsContainer.innerHTML = '';

        const majorEvents = biblicalData.events.filter(e => e.tags.includes('major'));

        majorEvents.forEach(event => {
            const x = this.yearToX(event.year);

            const marker = document.createElement('div');
            marker.className = 'event-marker';
            marker.style.left = x + 'px';
            marker.addEventListener('click', () => this.showEventDetails(event));
            eventsContainer.appendChild(marker);

            const label = document.createElement('div');
            label.className = 'event-label';
            label.style.left = x + 'px';
            label.textContent = languageManager.getText(event.name);
            label.addEventListener('click', () => this.showEventDetails(event));
            eventsContainer.appendChild(label);
        });
    }

    renderPeople() {
        const barsContainer = document.getElementById('personBars');
        barsContainer.innerHTML = '';

        const people = this.getFilteredPeople();

        people.sort((a, b) => {
            if (!a.lifespan || !b.lifespan) return 0;
            return a.lifespan.born - b.lifespan.born;
        });

        people.forEach((person, index) => {
            if (!person.lifespan) return;

            const x1 = this.yearToX(person.lifespan.born);
            const x2 = this.yearToX(person.lifespan.died);
            const width = x2 - x1;
            const yearsLived = Math.abs(person.lifespan.died - person.lifespan.born);

            const baseY = 250;
            const spacing = 45;
            const y = baseY + (index % 20) * spacing;

            const bar = document.createElement('div');
            bar.className = 'person-bar';
            bar.style.left = x1 + 'px';
            bar.style.width = width + 'px';
            bar.style.top = y + 'px';
            bar.setAttribute('data-name', languageManager.getText(person.name));
            bar.style.animationDelay = (index * 0.02) + 's';

            if (person.id === 'abraham' || person.id === 'moses' || person.id === 'david') {
                bar.classList.add('special');
            } else if (person.role && person.role.en && person.role.en.toLowerCase().includes('woman')) {
                bar.classList.add('female');
            } else {
                bar.classList.add('male');
            }

            const nameSpan = document.createElement('div');
            nameSpan.className = 'person-name';
            nameSpan.textContent = languageManager.getText(person.name);
            bar.appendChild(nameSpan);

            const yearsSpan = document.createElement('div');
            yearsSpan.className = 'person-years';
            yearsSpan.textContent = yearsLived + (languageManager.currentLang === 'en' ? ' yrs' : ' שנים');
            bar.appendChild(yearsSpan);

            bar.addEventListener('click', () => this.showPersonDetails(person));
            barsContainer.appendChild(bar);
        });
    }

    getFilteredPeople() {
        let people = biblicalData.people.filter(p => p.lifespan);

        if (this.currentFilter !== 'all') {
            people = people.filter(person => {
                if (this.currentFilter === 'patriarchs') {
                    return ['abraham', 'isaac', 'jacob'].includes(person.id);
                } else if (this.currentFilter === 'prophets') {
                    return person.role && person.role.en && person.role.en.toLowerCase().includes('prophet');
                } else if (this.currentFilter === 'kings') {
                    return person.role && person.role.en && person.role.en.toLowerCase().includes('king');
                } else if (this.currentFilter === 'women') {
                    return person.role && person.role.en && person.role.en.toLowerCase().includes('woman');
                }
                return true;
            });
        }

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            people = people.filter(person => {
                const nameEn = person.name.en.toLowerCase();
                const nameHe = person.name.he.toLowerCase();
                return nameEn.includes(term) || nameHe.includes(term);
            });
        }

        return people;
    }

    setupEventListeners() {
        document.getElementById('zoomIn').addEventListener('click', () => {
            this.zoom *= 1.3;
            this.updateZoom();
        });

        document.getElementById('zoomOut').addEventListener('click', () => {
            this.zoom /= 1.3;
            this.zoom = Math.max(0.3, this.zoom);
            this.updateZoom();
        });

        document.getElementById('zoomReset').addEventListener('click', () => {
            this.zoom = 1;
            this.updateZoom();
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (!btn.id) {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentFilter = e.target.getAttribute('data-filter');
                    this.renderPeople();
                    this.updateStats();
                });
            }
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.renderPeople();
            this.updateStats();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('personModal').style.display = 'none';
        });

        document.getElementById('closeEventModal').addEventListener('click', () => {
            document.getElementById('eventModal').style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            const personModal = document.getElementById('personModal');
            const eventModal = document.getElementById('eventModal');
            if (e.target === personModal) personModal.style.display = 'none';
            if (e.target === eventModal) eventModal.style.display = 'none';
        });

        document.getElementById('langToggle').addEventListener('click', () => {
            languageManager.toggleLanguage();
            this.refresh();
        });
    }

    updateZoom() {
        this.setupDimensions();
        this.renderYearMarkers();
        this.renderPeriodSections();
        this.renderMajorEvents();
        this.renderPeople();
        document.getElementById('zoomLevel').textContent = Math.round(this.zoom * 100) + '%';
    }

    refresh() {
        this.renderYearMarkers();
        this.renderPeriodSections();
        this.renderMajorEvents();
        this.renderPeople();
        this.updateStats();
    }

    updateStats() {
        const people = this.getFilteredPeople();
        const events = biblicalData.events.filter(e => e.tags.includes('major'));

        document.getElementById('totalPeople').textContent = people.length;
        document.getElementById('totalEvents').textContent = events.length;
        document.getElementById('totalYears').textContent = this.yearRange;

        const avgLifespan = people.length > 0 ?
            Math.round(people.reduce((sum, p) => sum + Math.abs(p.lifespan.died - p.lifespan.born), 0) / people.length) : 0;
        document.getElementById('avgLifespan').textContent = avgLifespan;
    }

    showPersonDetails(person) {
        const modal = document.getElementById('personModal');
        const body = document.getElementById('modalBody');

        const name = languageManager.getText(person.name);
        const role = languageManager.getText(person.role);
        const desc = languageManager.getText(person.description);
        const yearsLived = person.lifespan ? Math.abs(person.lifespan.died - person.lifespan.born) : 0;

        body.innerHTML = '<h2 style="font-family: Suez One, serif; color: #8b6914; margin-bottom: 20px;">' + name + '</h2>' +
            '<div style="background: linear-gradient(135deg, #8b6914, #d4af37); color: white; padding: 15px; border-radius: 15px; margin-bottom: 20px;">' +
            '<div style="font-size: 2.5rem; font-weight: bold;">' + yearsLived + '</div>' +
            '<div style="font-size: 1rem;">' + (languageManager.currentLang === 'en' ? 'Years Lived' : 'שנות חיים') + '</div>' +
            (person.lifespan ? '<div style="margin-top: 10px; font-size: 0.9rem;">' + Math.abs(person.lifespan.born) + ' - ' + Math.abs(person.lifespan.died) + ' BCE</div>' : '') +
            '</div>' +
            '<div style="background: rgba(212, 175, 55, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #8b6914;">' +
            '<strong style="color: #8b6914;">' + role + '</strong>' +
            '<p style="margin-top: 10px; line-height: 1.8;">' + desc + '</p>' +
            '</div>';

        modal.style.display = 'flex';
    }

    showEventDetails(event) {
        const modal = document.getElementById('eventModal');
        const body = document.getElementById('eventModalBody');

        const name = languageManager.getText(event.name);
        const desc = languageManager.getText(event.description);

        body.innerHTML = '<h2 style="font-family: Suez One, serif; color: #8b6914; margin-bottom: 20px;">' + name + '</h2>' +
            '<div style="background: linear-gradient(135deg, #8b6914, #d4af37); color: white; padding: 15px; border-radius: 15px; margin-bottom: 20px; text-align: center;">' +
            '<div style="font-size: 2rem; font-weight: bold;">' + Math.abs(event.year) + ' BCE</div>' +
            '</div>' +
            '<div style="background: rgba(212, 175, 55, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #8b6914;">' +
            '<p style="line-height: 1.8;">' + desc + '</p>' +
            (event.reference ? '<p style="margin-top: 15px; font-style: italic; color: #8b6914;"><strong>' + (languageManager.currentLang === 'en' ? 'Reference:' : 'מקור:') + '</strong> ' + event.reference + '</p>' : '') +
            '</div>';

        modal.style.display = 'flex';
    }
}

let biblicalTimeline;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        biblicalTimeline = new BiblicalTimeline();
    });
} else {
    biblicalTimeline = new BiblicalTimeline();
}
