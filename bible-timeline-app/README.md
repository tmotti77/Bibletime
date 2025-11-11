# Biblical Timeline Explorer | מחקר ציר הזמן המקראי

An interactive, bilingual (English/Hebrew) educational web application for exploring biblical history through timelines, maps, quizzes, and learning modules.

## ✨ Features

### 🌍 Bilingual Support
- Seamlessly switch between English and Hebrew
- Full RTL (Right-to-Left) support for Hebrew
- All content available in both languages

### 📜 Interactive Timeline
- Explore biblical history from Creation to the Return from Exile
- Zoom and pan functionality for detailed exploration
- Filter by historical periods (Creation, Patriarchs, Exodus, Judges, Kings, Exile, Return)
- Clickable events with detailed information
- Color-coded periods and events
- Visual timeline with hover tooltips

### 🗺️ Interactive Maps
- Biblical world overview
- Exodus route
- Divided Kingdom
- Jerusalem
- Tabernacle layout
- Temple structure
- Clickable location markers with detailed descriptions

### 📚 Learning Modules
- Biblical Clothing
- Tools & Implements
- Customs & Culture
- Key Biblical Figures
- Major Events
- Architecture
- Track completed topics for progress

### 🎯 Quiz System
- Three difficulty levels (Easy, Medium, Hard)
- Multiple-choice questions
- Instant feedback with explanations
- Score tracking
- Questions cover all periods of biblical history

### ⭐ Favorites/Bookmarks
- Save favorite events, locations, and people
- Quick access to bookmarked content
- Persistent storage across sessions

### 🔍 Search Functionality
- Search across all content (events, people, periods, locations)
- Real-time search results
- Click results to navigate to detailed views

### 📊 Progress Tracking
- Visual progress bar
- Track learning completion
- Monitor quiz performance
- Engagement metrics

### 🎨 Design
- Modern-Vintage fusion aesthetic
- Vintage color palette (sepia, burgundy, navy, gold)
- Modern, clean layout and interactions
- Paper texture background
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)

## 🚀 Getting Started

### Installation

1. **Clone or download this repository**

2. **Open the application**
   ```bash
   cd bible-timeline-app
   ```

3. **Run with a local server** (recommended)

   Using Python:
   ```bash
   python -m http.server 8000
   ```

   Or using Node.js:
   ```bash
   npx http-server
   ```

4. **Open in browser**
   Navigate to `http://localhost:8000` in your web browser

### Alternative: Direct File Opening

You can also open `index.html` directly in your browser, but some features may work better with a local server.

## 📖 How to Use

### Navigation

- **Timeline**: Explore biblical history chronologically
  - Use period filters to focus on specific eras
  - Zoom in/out with +/- buttons
  - Click and drag to pan
  - Click events for detailed information

- **Maps**: Explore biblical geography
  - Select different map types from the sidebar
  - Click markers to learn about locations
  - View Tabernacle and Temple layouts

- **Learn**: Educational content
  - Choose topics from the sidebar
  - Read through comprehensive information
  - Mark topics as complete to track progress

- **Quiz**: Test your knowledge
  - Select difficulty level
  - Answer multiple-choice questions
  - Earn points based on difficulty
  - View explanations for answers

- **Favorites**: Access bookmarked items
  - View all your saved favorites
  - Quick navigation to bookmarked content
  - Remove items you no longer need

### Search

- Use the search box in the navigation bar
- Search works across all content types
- Click results to navigate to details

### Language Toggle

- Click the language toggle (EN | עב) in the navigation bar
- All content instantly switches to the selected language
- Layout adjusts for RTL when Hebrew is selected

### Progress Tracking

- Your progress is automatically tracked
- View progress percentage in the navigation bar
- Progress based on:
  - Completed learning topics
  - Quiz participation
  - Favorites added
  - Timeline exploration
  - Map exploration

## 🗂️ Project Structure

```
bible-timeline-app/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css          # Main styles (modern-vintage fusion)
│   ├── timeline.css        # Timeline-specific styles
│   └── responsive.css      # Responsive design for all devices
├── js/
│   ├── data.js            # Biblical data (events, people, periods)
│   ├── language.js        # Bilingual system
│   ├── timeline.js        # Interactive timeline with zoom/pan
│   ├── maps.js            # Interactive maps component
│   ├── learn.js           # Learning modules system
│   ├── quiz.js            # Quiz system
│   ├── favorites.js       # Bookmarks/favorites system
│   ├── search.js          # Search functionality
│   ├── progress.js        # Progress tracking
│   └── app.js             # Main application controller
└── README.md              # This file
```

## 💾 Data Persistence

The application uses browser localStorage to save:
- Language preference
- Favorites/bookmarks
- Completed learning topics
- Quiz scores
- Progress tracking
- Visited periods and maps

All data persists between sessions unless you clear your browser data.

## 🎨 Design Philosophy

**Modern-Vintage Fusion**
- Vintage aesthetics: Aged paper colors, classic typography, historical feel
- Modern UX: Clean layouts, smooth interactions, responsive design
- Best of both worlds: Beautiful, historical appearance with excellent usability

**Color Palette**
- Vintage Cream (#f4f1e8) - Background
- Vintage Burgundy (#6b2c2c) - Primary accents
- Vintage Gold (#b8860b) - Highlights
- Vintage Navy (#2c3e50) - Secondary accents
- Vintage Brown (#8b7355) - Borders and text

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🌟 Key Features Detail

### Timeline Component
- Canvas-based rendering for smooth performance
- Drag to pan, buttons to zoom
- Period-based filtering
- Hover tooltips for quick info
- Click for detailed modal views
- Color-coded by historical period

### Maps Component
- Multiple map types covering different aspects
- Clickable markers with precise positioning
- Detailed descriptions for each location
- Integration with the timeline and learning modules

### Quiz System
- Difficulty-based scoring (Easy: 10pts, Medium: 20pts, Hard: 30pts)
- Immediate feedback with explanations
- Score accumulation across sessions
- Educational focus with detailed explanations

### Learning Modules
- Comprehensive content on biblical life and culture
- Structured sections for easy learning
- Progress tracking
- Integration with favorites system

## 🔧 Customization

### Adding Content

**Add Events** (in `js/data.js`):
```javascript
biblicalData.events.push({
    id: 'event_id',
    name: { en: 'Event Name', he: 'שם האירוע' },
    year: -1000,
    period: 'kings',
    description: { en: 'Description', he: 'תיאור' },
    reference: 'Bible Reference',
    tags: ['tag1', 'tag2']
});
```

**Add Quiz Questions** (in `js/data.js`):
```javascript
biblicalData.quizQuestions.easy.push({
    question: { en: 'Question?', he: '?שאלה' },
    options: {
        en: ['Option1', 'Option2', 'Option3', 'Option4'],
        he: ['אפשרות1', 'אפשרות2', 'אפשרות3', 'אפשרות4']
    },
    correctIndex: 0,
    explanation: { en: 'Explanation', he: 'הסבר' }
});
```

### Styling

Modify CSS variables in `css/styles.css`:
```css
:root {
    --vintage-burgundy: #6b2c2c;  /* Change colors */
    --spacing-md: 1rem;            /* Adjust spacing */
    --font-display: 'Georgia';     /* Change fonts */
}
```

## 🤝 Contributing

This is an educational project. Feel free to:
- Add more biblical events and data
- Improve translations
- Add more quiz questions
- Enhance the UI/UX
- Fix bugs or improve performance

## 📜 License

This project is created for educational purposes. Biblical content is historical and educational in nature.

## 🙏 Credits

Created with modern web technologies:
- Pure JavaScript (no frameworks)
- HTML5 Canvas for timeline rendering
- CSS3 for styling and animations
- LocalStorage for data persistence

Biblical historical data compiled from various historical and scholarly sources.

---

**Enjoy exploring biblical history!** | **!תהנו מחקר ההיסטוריה המקראית**

For questions or suggestions, please create an issue in the repository.
