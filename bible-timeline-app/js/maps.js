// Interactive Maps Component

class MapsManager {
    constructor() {
        this.currentMap = 'overview';
        this.mapContainer = document.getElementById('mapContainer');
        this.mapImage = document.getElementById('mapImage');
        this.mapMarkers = document.getElementById('mapMarkers');
        this.mapInfo = document.getElementById('mapInfo');

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMap('overview');
    }

    setupEventListeners() {
        // Map filter buttons
        document.querySelectorAll('.map-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const mapType = e.target.getAttribute('data-map');
                this.loadMap(mapType);
            });
        });

        // Language change
        window.addEventListener('languageChange', () => {
            this.updateMapInfo();
        });
    }

    loadMap(mapType) {
        this.currentMap = mapType;

        // For demonstration, we'll use the uploaded biblical chart images
        // In production, you would have specific map images for each type
        const mapImages = {
            'overview': '../infoimage/Screenshot 2025-11-11 074429.png',
            'exodus': '../infoimage/Screenshot 2025-11-11 074452.png',
            'kingdoms': '../infoimage/Screenshot 2025-11-11 074515.png',
            'jerusalem': '../infoimage/Screenshot 2025-11-11 074526.png',
            'tabernacle': '../infoimage/Screenshot 2025-11-11 074429.png',
            'temple': '../infoimage/Screenshot 2025-11-11 074452.png'
        };

        this.mapImage.src = mapImages[mapType] || mapImages['overview'];
        this.mapImage.onload = () => {
            this.placeMarkers(mapType);
            this.updateMapInfo();
        };
    }

    placeMarkers(mapType) {
        if (!this.mapMarkers) return;

        this.mapMarkers.innerHTML = '';

        const markers = this.getMarkersForMap(mapType);

        markers.forEach(marker => {
            const markerEl = document.createElement('div');
            markerEl.className = 'map-marker';
            markerEl.style.left = marker.x + '%';
            markerEl.style.top = marker.y + '%';
            markerEl.title = languageManager.getText(marker.name);

            markerEl.addEventListener('click', () => {
                this.showLocationDetails(marker);
            });

            this.mapMarkers.appendChild(markerEl);
        });
    }

    getMarkersForMap(mapType) {
        // Define markers for different map types
        const markerData = {
            'overview': [
                { id: 'egypt', name: { en: 'Egypt - Land of Slavery', he: 'מצרים - ארץ העבדות' }, x: 15, y: 70, description: { en: 'Where Israelites were enslaved before the Exodus', he: 'היכן ישראל היו משועבדים לפני יציאת מצרים' } },
                { id: 'sinai', name: { en: 'Mount Sinai - Law Given', he: 'הר סיני - מתן תורה' }, x: 25, y: 75, description: { en: 'Where God gave Moses the Ten Commandments', he: 'היכן אלוהים נתן למשה את עשרת הדברות' } },
                { id: 'canaan', name: { en: 'Canaan - Promised Land', he: 'כנען - הארץ המובטחת' }, x: 35, y: 45, description: { en: 'The land promised to Abraham and his descendants', he: 'הארץ שהובטחה לאברהם ולצאצאיו' } },
                { id: 'jerusalem', name: { en: 'Jerusalem - Holy City', he: 'ירושלים - עיר הקודש' }, x: 36, y: 50, description: { en: 'Capital city and location of the Temple', he: 'עיר הבירה ומיקום בית המקדש' } },
                { id: 'babylon', name: { en: 'Babylon - Place of Exile', he: 'בבל - מקום הגלות' }, x: 75, y: 45, description: { en: 'Where Judah was exiled after Jerusalem fell', he: 'היכן יהודה גלתה לאחר נפילת ירושלים' } }
            ],
            'exodus': [
                { id: 'goshen', name: { en: 'Goshen', he: 'גושן' }, x: 20, y: 65, description: { en: 'Where Israelites lived in Egypt', he: 'היכן ישראל התגוררו במצרים' } },
                { id: 'red_sea', name: { en: 'Red Sea Crossing', he: 'קריעת ים סוף' }, x: 28, y: 72, description: { en: 'Where God parted the waters', he: 'היכן אלוהים קרע את המים' } },
                { id: 'sinai_ex', name: { en: 'Mount Sinai', he: 'הר סיני' }, x: 32, y: 78, description: { en: 'Received the Law', he: 'קיבלו את התורה' } },
                { id: 'kadesh', name: { en: 'Kadesh Barnea', he: 'קדש ברנע' }, x: 30, y: 60, description: { en: 'Wilderness wandering location', he: 'מיקום נדודי המדבר' } }
            ],
            'kingdoms': [
                { id: 'samaria', name: { en: 'Samaria - Northern Capital', he: 'שומרון - בירת הצפון' }, x: 35, y: 45, description: { en: 'Capital of Northern Kingdom (Israel)', he: 'בירת הממלכה הצפונית (ישראל)' } },
                { id: 'jerusalem_k', name: { en: 'Jerusalem - Southern Capital', he: 'ירושלים - בירת הדרום' }, x: 36, y: 52, description: { en: 'Capital of Southern Kingdom (Judah)', he: 'בירת הממלכה הדרומית (יהודה)' } },
                { id: 'dan', name: { en: 'Dan - Northern Border', he: 'דן - גבול צפוני' }, x: 35, y: 35, description: { en: 'Northern border city', he: 'עיר גבול צפונית' } },
                { id: 'beersheba', name: { en: 'Beersheba - Southern Border', he: 'באר שבע - גבול דרומי' }, x: 34, y: 62, description: { en: 'Southern border - "From Dan to Beersheba"', he: 'גבול דרומי - "מדן ועד באר שבע"' } }
            ],
            'jerusalem': [
                { id: 'temple_mount', name: { en: 'Temple Mount', he: 'הר הבית' }, x: 50, y: 45, description: { en: 'Location of Solomon\'s Temple', he: 'מיקום בית המקדש של שלמה' } },
                { id: 'city_david', name: { en: 'City of David', he: 'עיר דוד' }, x: 48, y: 55, description: { en: 'Original Jerusalem conquered by David', he: 'ירושלים המקורית שנכבשה על ידי דוד' } },
                { id: 'garden_gethsemane', name: { en: 'Mount of Olives', he: 'הר הזיתים' }, x: 65, y: 50, description: { en: 'Mountain east of Jerusalem', he: 'הר ממזרח לירושלים' } }
            ],
            'tabernacle': [
                { id: 'holy_holies', name: { en: 'Holy of Holies', he: 'קודש הקודשים' }, x: 30, y: 40, description: { en: 'Most sacred space containing the Ark', he: 'המקום הקדוש ביותר המכיל את הארון' } },
                { id: 'holy_place', name: { en: 'Holy Place', he: 'הקודש' }, x: 50, y: 40, description: { en: 'Inner sanctuary with altar', he: 'המקדש הפנימי עם המזבח' } },
                { id: 'outer_court', name: { en: 'Outer Court', he: 'החצר החיצונית' }, x: 70, y: 50, description: { en: 'Public worship area', he: 'אזור פולחן ציבורי' } }
            ],
            'temple': [
                { id: 'temple_holy', name: { en: 'Holy of Holies', he: 'קודש הקודשים' }, x: 40, y: 35, description: { en: 'Inner sanctuary of the Temple', he: 'המקדש הפנימי של בית המקדש' } },
                { id: 'altar', name: { en: 'Bronze Altar', he: 'מזבח הנחושת' }, x: 50, y: 50, description: { en: 'Place of sacrifice', he: 'מקום הקרבנות' } },
                { id: 'pillars', name: { en: 'Jachin and Boaz', he: 'יכין ובועז' }, x: 45, y: 45, description: { en: 'The two great pillars', he: 'שני העמודים הגדולים' } }
            ]
        };

        return markerData[mapType] || markerData['overview'];
    }

    showLocationDetails(location) {
        const modal = document.getElementById('detailModal');
        const modalBody = document.getElementById('modalBody');

        const name = languageManager.getText(location.name);
        const desc = languageManager.getText(location.description);

        modalBody.innerHTML = `
            <h2>${name}</h2>
            <p style="font-size: 1.1rem; line-height: 1.8; margin-top: 1rem;">${desc}</p>
            <div style="margin-top: 2rem; padding: 1rem; background: var(--vintage-paper); border-left: 4px solid var(--vintage-burgundy); border-radius: 4px;">
                <p style="font-style: italic; color: var(--text-secondary);">
                    ${languageManager.currentLang === 'en'
                        ? 'Click the map markers to explore more biblical locations!'
                        : 'לחץ על סמני המפה כדי לחקור עוד מיקומים מקראיים!'}
                </p>
            </div>
        `;

        modal.classList.add('active');

        // Set up favorite button
        const favoriteBtn = document.getElementById('modalFavorite');
        if (window.favoritesManager) {
            const isFavorited = window.favoritesManager.isFavorite(location.id);
            favoriteBtn.classList.toggle('favorited', isFavorited);
            favoriteBtn.onclick = () => {
                window.favoritesManager.toggleFavorite({
                    id: location.id,
                    type: 'location',
                    name: location.name,
                    data: location
                });
                favoriteBtn.classList.toggle('favorited');
            };
        }
    }

    updateMapInfo() {
        if (!this.mapInfo) return;

        const mapDescriptions = {
            'overview': {
                en: 'Overview of the Biblical World - Explore key locations from Creation to the Return',
                he: 'סקירה של העולם המקראי - חקרו מיקומים מרכזיים מהבריאה ועד השיבה'
            },
            'exodus': {
                en: 'The Exodus Route - Follow Israel\'s journey from Egypt to Mount Sinai',
                he: 'מסלול יציאת מצרים - עקבו אחר מסע ישראל ממצרים להר סיני'
            },
            'kingdoms': {
                en: 'Divided Kingdom - Northern Israel and Southern Judah',
                he: 'הממלכה המפולגת - ישראל הצפונית ויהודה הדרומית'
            },
            'jerusalem': {
                en: 'Jerusalem - The Holy City and its sacred sites',
                he: 'ירושלים - עיר הקודש והאתרים הקדושים שלה'
            },
            'tabernacle': {
                en: 'The Tabernacle - God\'s dwelling place in the wilderness',
                he: 'המשכן - משכן אלוהים במדבר'
            },
            'temple': {
                en: 'Solomon\'s Temple - The magnificent house of God',
                he: 'בית המקדש של שלמה - בית אלוהים המפואר'
            }
        };

        const description = mapDescriptions[this.currentMap];
        this.mapInfo.innerHTML = `<h3>${languageManager.getText(description)}</h3>`;
    }
}

// Initialize maps manager
let mapsManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        mapsManager = new MapsManager();
    });
} else {
    mapsManager = new MapsManager();
}
