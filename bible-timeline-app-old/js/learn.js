// Learning Modules System

class LearnManager {
    constructor() {
        this.currentTopic = null;
        this.learnContent = document.getElementById('learnContent');
        this.completedTopics = this.loadCompletedTopics();

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.topic-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const topic = e.target.getAttribute('data-topic');
                this.loadTopic(topic);
            });
        });

        // Language change
        window.addEventListener('languageChange', () => {
            if (this.currentTopic) {
                this.loadTopic(this.currentTopic);
            }
        });
    }

    loadTopic(topicId) {
        this.currentTopic = topicId;
        const topicData = this.getTopicData(topicId);

        if (!topicData) return;

        const title = languageManager.getText(topicData.title);
        const intro = languageManager.getText(topicData.intro);

        let html = `
            <h2>${title}</h2>
            <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">${intro}</p>
        `;

        // Add content sections
        topicData.sections.forEach((section, index) => {
            const sectionTitle = languageManager.getText(section.title);
            const sectionContent = languageManager.getText(section.content);

            html += `
                <div class="event-card" style="cursor: default; margin-bottom: 1.5rem;">
                    <h4>${sectionTitle}</h4>
                    <p style="margin-top: 0.5rem; line-height: 1.6;">${sectionContent}</p>
                    ${section.examples ? this.renderExamples(section.examples) : ''}
                </div>
            `;
        });

        // Add completion button
        const isCompleted = this.completedTopics.includes(topicId);
        const buttonText = isCompleted
            ? (languageManager.currentLang === 'en' ? 'Completed ✓' : 'הושלם ✓')
            : (languageManager.currentLang === 'en' ? 'Mark as Complete' : 'סמן כהושלם');

        html += `
            <button
                class="start-quiz-btn ${isCompleted ? 'completed' : ''}"
                onclick="window.learnManager.markTopicComplete('${topicId}')"
                style="${isCompleted ? 'background: var(--vintage-olive);' : ''}"
            >
                ${buttonText}
            </button>
        `;

        this.learnContent.innerHTML = html;
    }

    renderExamples(examples) {
        let html = '<ul style="margin-top: 0.5rem; padding-left: 1.5rem;">';
        examples.forEach(example => {
            html += `<li>${languageManager.getText(example)}</li>`;
        });
        html += '</ul>';
        return html;
    }

    markTopicComplete(topicId) {
        if (!this.completedTopics.includes(topicId)) {
            this.completedTopics.push(topicId);
            this.saveCompletedTopics();
            this.loadTopic(topicId); // Reload to update button

            // Update progress
            if (window.progressManager) {
                window.progressManager.updateProgress();
            }
        }
    }

    loadCompletedTopics() {
        const saved = localStorage.getItem('biblicalTimelineCompletedTopics');
        return saved ? JSON.parse(saved) : [];
    }

    saveCompletedTopics() {
        localStorage.setItem('biblicalTimelineCompletedTopics', JSON.stringify(this.completedTopics));
    }

    getTopicData(topicId) {
        const topics = {
            'clothing': {
                title: { en: 'Biblical Clothing', he: 'לבוש מקראי' },
                intro: {
                    en: 'Clothing in biblical times reflected social status, occupation, and religious identity. Learn about the various garments worn throughout biblical history.',
                    he: 'הלבוש בתקופה המקראית שיקף מעמד חברתי, עיסוק וזהות דתית. למדו על הבגדים השונים שנלבשו לאורך ההיסטוריה המקראית.'
                },
                sections: [
                    {
                        title: { en: 'Common Garments', he: 'בגדים נפוצים' },
                        content: {
                            en: 'The tunic was the basic garment worn by both men and women. It was a simple, loose-fitting robe that reached to the knees or ankles.',
                            he: 'הכתונת הייתה הבגד הבסיסי שנלבש על ידי גברים ונשים כאחד. זו הייתה חלוק פשוט ורופף שהגיע עד הברכיים או הקרסוליים.'
                        },
                        examples: [
                            { en: 'Tunic (כתונת) - Basic undergarment', he: 'כתונת - בגד תחתון בסיסי' },
                            { en: 'Cloak (שמלה) - Outer garment for warmth', he: 'שמלה - בגד חיצוני לחום' },
                            { en: 'Belt (אזור) - To secure clothing', he: 'אזור - לאבטח את הלבוש' }
                        ]
                    },
                    {
                        title: { en: 'Priestly Garments', he: 'בגדי כהונה' },
                        content: {
                            en: 'The high priest wore special garments including the ephod, breastplate with twelve stones, and the turban with gold plate.',
                            he: 'הכהן הגדול לבש בגדים מיוחדים כולל האפוד, החושן עם שתים עשרה האבנים, והמצנפת עם לוח הזהב.'
                        }
                    }
                ]
            },
            'tools': {
                title: { en: 'Biblical Tools & Implements', he: 'כלים וציוד מקראי' },
                intro: {
                    en: 'Explore the tools and implements used in daily life, agriculture, and worship during biblical times.',
                    he: 'חקרו את הכלים והציוד ששימשו בחיי היומיום, בחקלאות ובפולחן בתקופה המקראית.'
                },
                sections: [
                    {
                        title: { en: 'Agricultural Tools', he: 'כלי חקלאות' },
                        content: {
                            en: 'Farming was central to biblical life. The plow, sickle, and threshing sledge were essential tools.',
                            he: 'החקלאות הייתה מרכזית לחיים המקראיים. המחרשה, המגל ומורג הדיש היו כלים חיוניים.'
                        },
                        examples: [
                            { en: 'Plow (מחרשה) - For tilling soil', he: 'מחרשה - לעיבוד אדמה' },
                            { en: 'Sickle (מגל) - For harvesting grain', he: 'מגל - לקצירת תבואה' },
                            { en: 'Millstone (רחיים) - For grinding grain', he: 'רחיים - לטחינת תבואה' }
                        ]
                    },
                    {
                        title: { en: 'Household Items', he: 'כלי בית' },
                        content: {
                            en: 'Daily life required various tools including pottery for storage, oil lamps for light, and looms for weaving.',
                            he: 'חיי היומיום דרשו כלים שונים כולל כלי חרס לאחסון, נרות שמן לאור ונולים לאריגה.'
                        }
                    }
                ]
            },
            'customs': {
                title: { en: 'Biblical Customs & Culture', he: 'מנהגים ותרבות מקראית' },
                intro: {
                    en: 'Understanding biblical customs helps us better comprehend the stories and teachings of Scripture.',
                    he: 'הבנת המנהגים המקראיים עוזרת לנו להבין טוב יותר את הסיפורים והתורות של הכתובים.'
                },
                sections: [
                    {
                        title: { en: 'Hospitality', he: 'הכנסת אורחים' },
                        content: {
                            en: 'Hospitality was sacred in biblical culture. Welcoming strangers and providing for travelers was a serious obligation.',
                            he: 'הכנסת אורחים הייתה קדושה בתרבות המקראית. קבלת זרים ודאגה למטיילים הייתה חובה רצינית.'
                        }
                    },
                    {
                        title: { en: 'Covenants', he: 'בריתות' },
                        content: {
                            en: 'Covenants were binding agreements, often sealed with sacrifices and ceremonies. They formed the basis of relationships with God and others.',
                            he: 'בריתות היו הסכמים מחייבים, לעתים קרובות נחתמו עם קרבנות וטקסים. הם היוו את הבסיס ליחסים עם אלוהים ואחרים.'
                        }
                    }
                ]
            },
            'people': {
                title: { en: 'Key Biblical Figures', he: 'דמויות מקראיות מרכזיות' },
                intro: {
                    en: 'Learn about the men and women who shaped biblical history through their faith and actions.',
                    he: 'למדו על הגברים והנשים שעיצבו את ההיסטוריה המקראית דרך אמונתם ומעשיהם.'
                },
                sections: biblicalData.people.map(person => ({
                    title: person.name,
                    content: person.description
                }))
            },
            'events': {
                title: { en: 'Major Biblical Events', he: 'אירועים מקראיים מרכזיים' },
                intro: {
                    en: 'Discover the pivotal moments that defined biblical history and shaped the faith of millions.',
                    he: 'גלו את הרגעים המכריעים שהגדירו את ההיסטוריה המקראית ועיצבו את אמונתם של מיליונים.'
                },
                sections: biblicalData.events.filter(e => e.tags.includes('major')).slice(0, 6).map(event => ({
                    title: event.name,
                    content: event.description
                }))
            },
            'architecture': {
                title: { en: 'Biblical Architecture', he: 'אדריכלות מקראית' },
                intro: {
                    en: 'Explore the magnificent structures of the biblical world, from the Tabernacle to Solomon\'s Temple.',
                    he: 'חקרו את המבנים המפוארים של העולם המקראי, מהמשכן ועד בית המקדש של שלמה.'
                },
                sections: [
                    {
                        title: { en: 'The Tabernacle', he: 'המשכן' },
                        content: {
                            en: 'A portable sanctuary built according to God\'s precise instructions, the Tabernacle accompanied Israel through the wilderness.',
                            he: 'מקדש נייד שנבנה לפי הוראותיו המדויקות של אלוהים, המשכן ליווה את ישראל דרך המדבר.'
                        }
                    },
                    {
                        title: { en: 'Solomon\'s Temple', he: 'בית המקדש של שלמה' },
                        content: {
                            en: 'Built over seven years, Solomon\'s Temple was a magnificent structure that became the center of Israelite worship.',
                            he: 'נבנה במשך שבע שנים, בית המקדש של שלמה היה מבנה מפואר שהפך למרכז הפולחן הישראלי.'
                        }
                    }
                ]
            }
        };

        return topics[topicId];
    }
}

// Initialize learn manager
window.learnManager = null;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.learnManager = new LearnManager();
    });
} else {
    window.learnManager = new LearnManager();
}
