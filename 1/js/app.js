let filteredData = timelineData;
let currentFilter = 'all';
let currentZoom = 1;
let isPanning = false;
let startX, startY, scrollLeft, scrollTop;
let panStartX, panStartY;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createTimeline();
    setupEventListeners();
    setupPanAndZoom();
});

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchData(e.target.value);
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            filterData(filter, e.target);
        });
    });
    
    // Zoom controls
    document.getElementById('zoomIn').addEventListener('click', () => {
        currentZoom = Math.min(currentZoom + 0.2, 3);
        applyZoom();
    });
    
    document.getElementById('zoomOut').addEventListener('click', () => {
        currentZoom = Math.max(currentZoom - 0.2, 0.5);
        applyZoom();
    });
    
    document.getElementById('zoomReset').addEventListener('click', () => {
        currentZoom = 1;
        applyZoom();
        const wrapper = document.querySelector('.timeline-wrapper');
        wrapper.scrollLeft = 0;
        wrapper.scrollTop = 0;
    });
    
    // Close modal on outside click
    window.onclick = function(event) {
        const modal = document.getElementById('personModal');
        if (event.target === modal) {
            closeModal();
        }
    };
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function setupPanAndZoom() {
    const wrapper = document.querySelector('.timeline-wrapper');
    const container = document.querySelector('.timeline-container');
    
    // Mouse wheel zoom
    wrapper.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            currentZoom = Math.max(0.5, Math.min(3, currentZoom + delta));
            applyZoom();
        }
    });
    
    // Pan with mouse drag
    wrapper.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Left mouse button
            isPanning = true;
            startX = e.pageX - wrapper.offsetLeft;
            startY = e.pageY - wrapper.offsetTop;
            scrollLeft = wrapper.scrollLeft;
            scrollTop = wrapper.scrollTop;
            wrapper.style.cursor = 'grabbing';
        }
    });
    
    wrapper.addEventListener('mouseleave', () => {
        isPanning = false;
        wrapper.style.cursor = 'grab';
    });
    
    wrapper.addEventListener('mouseup', () => {
        isPanning = false;
        wrapper.style.cursor = 'grab';
    });
    
    wrapper.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const y = e.pageY - wrapper.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        wrapper.scrollLeft = scrollLeft - walkX;
        wrapper.scrollTop = scrollTop - walkY;
    });
}

function applyZoom() {
    const container = document.querySelector('.timeline-container');
    container.style.transform = `scale(${currentZoom})`;
    document.getElementById('zoomLevel').textContent = Math.round(currentZoom * 100) + '%';
}

function createTimeline() {
    const container = document.querySelector('.timeline-container');
    const markersContainer = document.getElementById('timelineMarkers');
    const eventsContainer = document.getElementById('majorEvents');
    
    // Clear existing content
    markersContainer.innerHTML = '';
    eventsContainer.innerHTML = '';
    const existingBars = container.querySelectorAll('.person-bar');
    existingBars.forEach(bar => bar.remove());
    // SVG connections will be cleared in createFamilyConnections
    
    const maxYear = 3000;
    // Use a fixed large width to ensure all content is visible
    // The container is 5000px wide, timeline axis starts at 100px and is 4800px wide
    const containerWidth = 5000;
    const timelineStartX = 100;
    const timelineWidth = containerWidth - 200; // 4800px
    
    // Create time markers
    for (let year = 0; year <= maxYear; year += 100) {
        const marker = document.createElement('div');
        marker.className = 'time-marker';
        const xPos = (year / maxYear) * timelineWidth + timelineStartX;
        marker.style.left = xPos + 'px';
        
        const label = document.createElement('div');
        label.className = 'time-label';
        label.textContent = year;
        label.style.left = xPos + 'px';
        label.onclick = () => scrollToYear(year);
        
        markersContainer.appendChild(marker);
        markersContainer.appendChild(label);
    }
    
    // Create major events
    majorEvents.forEach(event => {
        const marker = document.createElement('div');
        marker.className = 'event-marker';
        const xPos = (event.year / maxYear) * timelineWidth + timelineStartX;
        marker.style.left = xPos + 'px';
        marker.onclick = () => scrollToYear(event.year);
        
        const label = document.createElement('div');
        label.className = 'event-label';
        label.textContent = event.label;
        label.style.left = xPos + 'px';
        label.title = event.description;
        label.onclick = () => scrollToYear(event.year);
        
        eventsContainer.appendChild(marker);
        eventsContainer.appendChild(label);
    });
    
    // Create person bars with better positioning
    const personPositions = new Map();
    filteredData.forEach((person, index) => {
        const bar = document.createElement('div');
        bar.className = `person-bar ${person.gender}`;
        if (person.special) {
            bar.classList.add('special');
        }
        if (person.gender === 'female') {
            bar.classList.add('woman');
        }
        
        // Calculate position based on birth year
        const startX = (person.born / maxYear) * timelineWidth + timelineStartX;
        // Calculate width based on lifespan
        const width = person.died ? 
            ((person.died - person.born) / maxYear) * timelineWidth : 
            Math.max(50, timelineWidth * 0.05);
        
        // Smart vertical positioning - avoid overlaps
        let top = 250;
        let foundPosition = false;
        let attempts = 0;
        
        while (!foundPosition && attempts < 50) {
            const testTop = 250 + attempts * 40;
            let hasOverlap = false;
            
            for (const [existingBar, pos] of personPositions.entries()) {
                const existingStartX = (existingBar.born / maxYear) * timelineWidth + timelineStartX;
                const existingWidth = existingBar.died ? 
                    ((existingBar.died - existingBar.born) / maxYear) * timelineWidth : 50;
                const existingTop = pos.top;
                
                // Check if there's overlap
                if (Math.abs(testTop - existingTop) < 40 &&
                    !(startX + width < existingStartX || startX > existingStartX + existingWidth)) {
                    hasOverlap = true;
                    break;
                }
            }
            
            if (!hasOverlap) {
                top = testTop;
                foundPosition = true;
            }
            attempts++;
        }
        
        personPositions.set(person, { top, startX, width });
        
        bar.style.left = startX + 'px';
        bar.style.width = width + 'px';
        bar.style.top = top + 'px';
        bar.style.animationDelay = (index * 0.05) + 's';
        
        // Create content with name and years
        const yearsText = person.died ? `${person.born}-${person.died}` : `${person.born}+`;
        const displayName = window.innerWidth > 768 ? person.nameHe : person.nameHe.substring(0, 6);
        
        // Create inner HTML with name and years
        bar.innerHTML = `
            <span class="person-name">${displayName}</span>
            <span class="person-years">${yearsText}</span>
        `;
        bar.setAttribute('data-name', `${person.nameHe} (${person.nameEn})`);
        bar.setAttribute('data-person-id', person.nameHe);
        
        bar.onclick = () => showModal(person);
        
        container.appendChild(bar);
    });
    
    // Create family connections
    createFamilyConnections(personPositions, containerWidth, maxYear);
    
    updateStats();
}

function createFamilyConnections(personPositions, containerWidth, maxYear) {
    const container = document.querySelector('.timeline-container');
    const timelineStartX = 100;
    const timelineWidth = containerWidth - 200;
    
    let svg = container.querySelector('svg.family-connections-svg');
    
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('family-connections-svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '2';
        container.appendChild(svg);
    } else {
        // Clear existing connections
        svg.innerHTML = '';
    }
    
    svg.style.width = containerWidth + 'px';
    svg.style.height = container.offsetHeight + 'px';
    
    filteredData.forEach(person => {
        if (!person.parent) return;
        
        const parent = timelineData.find(p => p.nameHe === person.parent);
        if (!parent) return;
        
        const childPos = personPositions.get(person);
        const parentPos = personPositions.get(parent);
        
        if (!childPos || !parentPos) return;
        
        // Connect from middle of parent's bar to start of child's bar
        const parentX = parentPos.startX + (parent.died ? 
            ((parent.died - parent.born) / maxYear) * timelineWidth / 2 : 25);
        const parentY = parentPos.top + 16;
        const childX = childPos.startX;
        const childY = childPos.top + 16;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', parentX);
        line.setAttribute('y1', parentY);
        line.setAttribute('x2', childX);
        line.setAttribute('y2', childY);
        line.setAttribute('stroke', 'rgba(212, 175, 55, 0.85)');
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-dasharray', '6,4');
        line.classList.add('family-connection');
        
        svg.appendChild(line);
    });
}

function scrollToYear(year) {
    const wrapper = document.querySelector('.timeline-wrapper');
    const containerWidth = 5000;
    const timelineStartX = 100;
    const timelineWidth = containerWidth - 200;
    const maxYear = 3000;
    const xPos = (year / maxYear) * timelineWidth + timelineStartX;
    
    wrapper.scrollTo({
        left: xPos * currentZoom - window.innerWidth / 2,
        behavior: 'smooth'
    });
}

function showModal(person) {
    const modal = document.getElementById('personModal');
    const modalBody = document.getElementById('modalBody');
    
    const yearsText = person.died ? `${person.died - person.born} שנה` : 'שנים לא ידועות';
    const genderText = person.gender === 'male' ? 'זכר' : 'נקבה';
    const genderIcon = person.gender === 'male' ? '♂' : '♀';
    
    const generationText = person.generation ? `דור ${person.generation}` : 'דור לא ידוע';
    
    // Find family members
    const children = timelineData.filter(p => p.parent === person.nameHe);
    const parent = person.parent ? timelineData.find(p => p.nameHe === person.parent) : null;
    
    modalBody.innerHTML = `
        <h2 style="color: #8b6914; font-size: 2.2rem; font-weight: 700; margin-bottom: 15px; text-align: center;">
            ${person.nameHe} ${genderIcon}
        </h2>
        <h3 style="color: #666; font-size: 1.4rem; margin-bottom: 20px; text-align: center;">
            ${person.nameEn}
        </h3>
        <div style="text-align: center; margin-bottom: 20px;">
            <span style="background: ${person.gender === 'male' ? 'linear-gradient(135deg, #8b6914, #d4af37)' : 'linear-gradient(135deg, #c41e3a, #d46a6a)'}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem;">
                ${genderText} | ${person.special ? 'דמות מיוחדת' : 'דמות רגילה'}
            </span>
        </div>
        <div style="background: #f8f6f0; padding: 20px; border-radius: 15px; margin-bottom: 15px;">
            <p style="font-size: 1.2rem; color: #c41e3a; font-weight: 700; margin-bottom: 10px; text-align: center;">
                שנות חיים: ${yearsText}
            </p>
            <p style="font-size: 1rem; color: #555; margin-bottom: 10px; text-align: center;">
                נולד: ${person.born} לבריאת העולם
            </p>
            ${person.died ? `<p style="font-size: 1rem; color: #555; text-align: center;">נפטר: ${person.died} לבריאת העולם</p>` : ''}
            <p style="font-size: 1rem; color: #555; text-align: center;">
                גיל: ${person.died ? person.died - person.born : 'לא ידוע'} שנה
            </p>
        </div>
        ${person.generation ? `
            <div style="background: #e8f5e8; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-right: 4px solid #4CAF50;">
                <p style="font-size: 1rem; color: #2E7D32; font-weight: 600; text-align: center;">
                    🌳 ${generationText}
                </p>
            </div>
        ` : ''}
        ${parent ? `
            <div style="background: #e3f2fd; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-right: 4px solid #2196F3;">
                <p style="font-size: 1rem; color: #1976D2; font-weight: 600; text-align: center; margin-bottom: 8px;">
                    👨‍👩‍👧‍👦 הורה:
                </p>
                <p style="font-size: 1rem; color: #1565C0; text-align: center; cursor: pointer; text-decoration: underline;" onclick="searchPerson('${parent.nameHe}')">
                    ${parent.nameHe} (${parent.nameEn})
                </p>
            </div>
        ` : ''}
        ${children.length > 0 ? `
            <div style="background: #f3e5f5; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-right: 4px solid #9C27B0;">
                <p style="font-size: 1rem; color: #7B1FA2; font-weight: 600; text-align: center; margin-bottom: 8px;">
                    👨‍👩‍👧‍👦 ילדים (${children.length}):
                </p>
                <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                    ${children.map(child => `
                        <span style="background: rgba(156, 39, 176, 0.1); padding: 6px 12px; border-radius: 15px; font-size: 0.9rem; color: #7B1FA2; cursor: pointer; border: 1px solid #9C27B0;" onclick="searchPerson('${child.nameHe}')">
                            ${child.nameHe}
                        </span>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        ${person.birthplace ? `
            <div style="background: #e6f3ff; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-right: 4px solid #2196F3;">
                <p style="font-size: 1rem; color: #1976D2; font-weight: 600; text-align: center;">
                    🏠 מקום לידה: ${person.birthplace}
                </p>
            </div>
        ` : ''}
        ${person.events ? `
            <div style="background: #fff3e0; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-right: 4px solid #FF9800;">
                <p style="font-size: 1rem; color: #F57C00; font-weight: 600; text-align: center; margin-bottom: 8px;">
                    ✨ אירועים מרכזיים:
                </p>
                <p style="font-size: 0.9rem; color: #E65100; text-align: center; line-height: 1.6;">
                    ${person.events}
                </p>
            </div>
        ` : ''}
        ${person.note ? `
            <div style="background: #fff9e6; padding: 20px; border-right: 5px solid #d4af37; margin-bottom: 15px; border-radius: 10px;">
                <p style="font-size: 1.1rem; color: #333; line-height: 1.8; text-align: center;">
                    ${person.note}
                </p>
            </div>
        ` : ''}
        <div style="background: #f0f0f0; padding: 15px; border-radius: 10px;">
            <p style="font-size: 0.95rem; color: #666; font-weight: 600; text-align: center;">
                תקופה היסטורית:
            </p>
            <p style="font-size: 0.9rem; color: #555; margin-top: 5px; text-align: center;">
                ${getEraText(person.born)}
            </p>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function searchPerson(name) {
    closeModal();
    const searchInput = document.getElementById('searchInput');
    searchInput.value = name;
    searchData(name);
    
    // Scroll to person
    const person = timelineData.find(p => p.nameHe === name);
    if (person) {
        setTimeout(() => scrollToYear(person.born), 300);
    }
}

function closeModal() {
    document.getElementById('personModal').style.display = 'none';
}

function getEraText(year) {
    if (year < 1656) return 'תקופת לפני המבול';
    if (year < 1948) return 'תקופת אחרי המבול';
    if (year < 2255) return 'תקופת האבות';
    if (year < 2448) return 'תקופת יושבי מצרים';
    if (year < 2900) return 'תקופת השופטים';
    return 'תקופת המלוכה';
}

function filterData(filter, targetElement) {
    currentFilter = filter;
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (targetElement) {
        targetElement.classList.add('active');
    } else {
        buttons.forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
    }
    
    if (filter === 'all') {
        filteredData = timelineData;
    } else if (filter === 'special') {
        filteredData = timelineData.filter(person => person.special);
    } else {
        filteredData = timelineData.filter(person => person.gender === filter);
    }
    
    createTimeline();
}

function searchData(query) {
    if (query.trim() === '') {
        filteredData = currentFilter === 'all' ? timelineData : 
            currentFilter === 'special' ? timelineData.filter(p => p.special) :
            timelineData.filter(p => p.gender === currentFilter);
    } else {
        filteredData = timelineData.filter(person => 
            (currentFilter === 'all' || 
             (currentFilter === 'special' ? person.special : person.gender === currentFilter)) &&
            (person.nameHe.includes(query) || 
             person.nameEn.toLowerCase().includes(query.toLowerCase()) ||
             person.note?.includes(query))
        );
    }
    
    createTimeline();
}

function updateStats() {
    document.getElementById('totalCount').textContent = filteredData.length;
    document.getElementById('maleCount').textContent = filteredData.filter(p => p.gender === 'male').length;
    document.getElementById('femaleCount').textContent = filteredData.filter(p => p.gender === 'female').length;
    document.getElementById('specialCount').textContent = filteredData.filter(p => p.special).length;
}

