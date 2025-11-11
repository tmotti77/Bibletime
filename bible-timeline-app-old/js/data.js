// Biblical Timeline Data
// Comprehensive data structure with bilingual support

const biblicalData = {
    // Timeline Periods
    periods: [
        {
            id: 'creation',
            name: { en: 'Creation', he: 'הבריאה' },
            startYear: -4004,
            endYear: -2348,
            color: '#8b7355',
            description: {
                en: 'From the creation of the world to the great flood',
                he: 'מבריאת העולם ועד המבול הגדול'
            }
        },
        {
            id: 'patriarchs',
            name: { en: 'The Patriarchs', he: 'תקופת האבות' },
            startYear: -2166,
            endYear: -1706,
            color: '#6b7c3b',
            description: {
                en: 'Abraham, Isaac, and Jacob - the fathers of Israel',
                he: 'אברהם, יצחק ויעקב - אבות האומה'
            }
        },
        {
            id: 'exodus',
            name: { en: 'Exodus & Wandering', he: 'יציאת מצרים והנדודים' },
            startYear: -1491,
            endYear: -1451,
            color: '#6b2c2c',
            description: {
                en: 'Liberation from Egypt and 40 years in the wilderness',
                he: 'שחרור ממצרים ו-40 שנות נדודים במדבר'
            }
        },
        {
            id: 'judges',
            name: { en: 'Period of Judges', he: 'תקופת השופטים' },
            startYear: -1451,
            endYear: -1095,
            color: '#b8860b',
            description: {
                en: 'Israel governed by judges before the monarchy',
                he: 'ישראל בהנהגת שופטים לפני המלוכה'
            }
        },
        {
            id: 'kings',
            name: { en: 'United & Divided Kingdom', he: 'הממלכה המאוחדת והמפולגת' },
            startYear: -1095,
            endYear: -586,
            color: '#2c3e50',
            description: {
                en: 'Saul, David, Solomon, and the divided kingdoms',
                he: 'שאול, דוד, שלמה והממלכות המפולגות'
            }
        },
        {
            id: 'exile',
            name: { en: 'Babylonian Exile', he: 'גלות בבל' },
            startYear: -586,
            endYear: -538,
            color: '#5c5244',
            description: {
                en: 'Judah in captivity in Babylon',
                he: 'יהודה בשבי בבבל'
            }
        },
        {
            id: 'return',
            name: { en: 'Return & Restoration', he: 'שיבת ציון והשיקום' },
            startYear: -538,
            endYear: -400,
            color: '#3ba99c',
            description: {
                en: 'Return from exile and rebuilding of Jerusalem',
                he: 'חזרה מהגלות ובניין ירושלים מחדש'
            }
        }
    ],

    // Major Events
    events: [
        {
            id: 'creation_world',
            name: { en: 'Creation of the World', he: 'בריאת העולם' },
            year: -4004,
            period: 'creation',
            description: {
                en: 'God creates the heavens, earth, and all life in six days',
                he: 'אלוהים ברא את השמים, הארץ וכל החיים בששה ימים'
            },
            reference: 'Genesis 1-2',
            tags: ['creation', 'major']
        },
        {
            id: 'fall',
            name: { en: 'The Fall', he: 'החטא הראשון' },
            year: -4004,
            period: 'creation',
            description: {
                en: 'Adam and Eve sin, bringing death into the world',
                he: 'אדם וחוה חוטאים, מביאים את המוות לעולם'
            },
            reference: 'Genesis 3',
            tags: ['creation', 'major']
        },
        {
            id: 'flood',
            name: { en: 'The Great Flood', he: 'המבול הגדול' },
            year: -2348,
            period: 'creation',
            description: {
                en: 'God floods the earth, Noah and his family saved in the ark',
                he: 'אלוהים מציף את הארץ, נח ומשפחתו ניצלים בתיבה'
            },
            reference: 'Genesis 6-9',
            tags: ['creation', 'major', 'judgment']
        },
        {
            id: 'babel',
            name: { en: 'Tower of Babel', he: 'מגדל בבל' },
            year: -2247,
            period: 'creation',
            description: {
                en: 'God confuses languages at Babel, scattering humanity',
                he: 'אלוהים מבלבל את השפות בבבל, מפזר את האנושות'
            },
            reference: 'Genesis 11',
            tags: ['creation', 'judgment']
        },
        {
            id: 'abraham_call',
            name: { en: 'Call of Abraham', he: 'קריאת אברהם' },
            year: -2091,
            period: 'patriarchs',
            description: {
                en: 'God calls Abram to leave his homeland and establishes covenant',
                he: 'אלוהים קורא לאברם לעזוב את ארצו ומכונן את הברית'
            },
            reference: 'Genesis 12',
            tags: ['patriarchs', 'major', 'covenant']
        },
        {
            id: 'isaac_birth',
            name: { en: 'Birth of Isaac', he: 'לידת יצחק' },
            year: -2066,
            period: 'patriarchs',
            description: {
                en: 'Abraham and Sarah miraculously have a son in old age',
                he: 'אברהם ושרה מקבלים בן בנס בזקנתם'
            },
            reference: 'Genesis 21',
            tags: ['patriarchs', 'miracle']
        },
        {
            id: 'jacob_wrestling',
            name: { en: 'Jacob Wrestles with God', he: 'יעקב נאבק עם אלוהים' },
            year: -1739,
            period: 'patriarchs',
            description: {
                en: 'Jacob wrestles with God and receives name Israel',
                he: 'יעקב נאבק עם אלוהים ומקבל את השם ישראל'
            },
            reference: 'Genesis 32',
            tags: ['patriarchs', 'major']
        },
        {
            id: 'joseph_egypt',
            name: { en: 'Joseph in Egypt', he: 'יוסף במצרים' },
            year: -1706,
            period: 'patriarchs',
            description: {
                en: 'Joseph becomes second-in-command in Egypt',
                he: 'יוסף הופך למשנה למלך במצרים'
            },
            reference: 'Genesis 41',
            tags: ['patriarchs', 'egypt']
        },
        {
            id: 'exodus_egypt',
            name: { en: 'Exodus from Egypt', he: 'יציאת מצרים' },
            year: -1491,
            period: 'exodus',
            description: {
                en: 'Moses leads Israel out of slavery through ten plagues',
                he: 'משה מוביל את ישראל מעבדות דרך עשר המכות'
            },
            reference: 'Exodus 12-14',
            tags: ['exodus', 'major', 'miracle']
        },
        {
            id: 'red_sea',
            name: { en: 'Crossing the Red Sea', he: 'קריעת ים סוף' },
            year: -1491,
            period: 'exodus',
            description: {
                en: 'God parts the Red Sea for Israel to escape Egypt',
                he: 'אלוהים קורע את ים סוף כדי שישראל יברח ממצרים'
            },
            reference: 'Exodus 14',
            tags: ['exodus', 'major', 'miracle']
        },
        {
            id: 'ten_commandments',
            name: { en: 'Ten Commandments', he: 'עשרת הדברות' },
            year: -1491,
            period: 'exodus',
            description: {
                en: 'God gives Moses the Law at Mount Sinai',
                he: 'אלוהים נותן למשה את התורה בהר סיני'
            },
            reference: 'Exodus 20',
            tags: ['exodus', 'major', 'law']
        },
        {
            id: 'tabernacle',
            name: { en: 'Building the Tabernacle', he: 'בניית המשכן' },
            year: -1490,
            period: 'exodus',
            description: {
                en: 'Israel constructs the portable temple in the wilderness',
                he: 'ישראל בונה את בית המקדש הנייד במדבר'
            },
            reference: 'Exodus 25-40',
            tags: ['exodus', 'worship']
        },
        {
            id: 'joshua_jericho',
            name: { en: 'Fall of Jericho', he: 'נפילת יריחו' },
            year: -1451,
            period: 'judges',
            description: {
                en: 'Joshua conquers Jericho as Israel enters Canaan',
                he: 'יהושע כובש את יריחו כשישראל נכנס לכנען'
            },
            reference: 'Joshua 6',
            tags: ['judges', 'major', 'conquest']
        },
        {
            id: 'deborah',
            name: { en: 'Deborah Judges Israel', he: 'דבורה שופטת את ישראל' },
            year: -1209,
            period: 'judges',
            description: {
                en: 'Deborah leads Israel and defeats Sisera',
                he: 'דבורה מנהיגה את ישראל ומביסה את סיסרא'
            },
            reference: 'Judges 4-5',
            tags: ['judges', 'leadership']
        },
        {
            id: 'gideon',
            name: { en: 'Gideon Defeats Midianites', he: 'גדעון מביס את המדינים' },
            year: -1191,
            period: 'judges',
            description: {
                en: 'Gideon and 300 men defeat the Midianite army',
                he: 'גדעון ו-300 איש מביסים את צבא מדין'
            },
            reference: 'Judges 7',
            tags: ['judges', 'miracle', 'victory']
        },
        {
            id: 'samson',
            name: { en: 'Samson Judges Israel', he: 'שמשון שופט את ישראל' },
            year: -1075,
            period: 'judges',
            description: {
                en: 'Samson delivers Israel from the Philistines',
                he: 'שמשון מושיע את ישראל מהפלשתים'
            },
            reference: 'Judges 13-16',
            tags: ['judges', 'strength']
        },
        {
            id: 'samuel',
            name: { en: 'Samuel the Prophet', he: 'שמואל הנביא' },
            year: -1095,
            period: 'judges',
            description: {
                en: 'Samuel becomes the last judge and anoints kings',
                he: 'שמואל הופך לשופט האחרון וממשיח מלכים'
            },
            reference: '1 Samuel 1-3',
            tags: ['judges', 'prophet']
        },
        {
            id: 'saul_king',
            name: { en: 'Saul Becomes King', he: 'שאול הופך למלך' },
            year: -1095,
            period: 'kings',
            description: {
                en: 'Israel demands a king, Saul is anointed',
                he: 'ישראל דורש מלך, שאול נמשח'
            },
            reference: '1 Samuel 10',
            tags: ['kings', 'major', 'monarchy']
        },
        {
            id: 'david_goliath',
            name: { en: 'David and Goliath', he: 'דוד וגלית' },
            year: -1063,
            period: 'kings',
            description: {
                en: 'Young David defeats the giant Goliath',
                he: 'דוד הצעיר מביס את הענק גלית'
            },
            reference: '1 Samuel 17',
            tags: ['kings', 'miracle', 'courage']
        },
        {
            id: 'david_king',
            name: { en: 'David Becomes King', he: 'דוד הופך למלך' },
            year: -1055,
            period: 'kings',
            description: {
                en: 'David is anointed king over all Israel',
                he: 'דוד נמשח למלך על כל ישראל'
            },
            reference: '2 Samuel 5',
            tags: ['kings', 'major', 'monarchy']
        },
        {
            id: 'solomon_temple',
            name: { en: 'Solomon Builds Temple', he: 'שלמה בונה את המקדש' },
            year: -966,
            period: 'kings',
            description: {
                en: 'Solomon constructs the magnificent temple in Jerusalem',
                he: 'שלמה בונה את בית המקדש המפואר בירושלים'
            },
            reference: '1 Kings 6-8',
            tags: ['kings', 'major', 'temple', 'worship']
        },
        {
            id: 'kingdom_divided',
            name: { en: 'Kingdom Divides', he: 'הממלכה מתפצלת' },
            year: -931,
            period: 'kings',
            description: {
                en: 'Israel splits into northern (Israel) and southern (Judah) kingdoms',
                he: 'ישראל מתפצלת לממלכה צפונית (ישראל) ודרומית (יהודה)'
            },
            reference: '1 Kings 12',
            tags: ['kings', 'major', 'division']
        },
        {
            id: 'elijah_carmel',
            name: { en: 'Elijah at Mount Carmel', he: 'אליהו בהר הכרמל' },
            year: -874,
            period: 'kings',
            description: {
                en: 'Elijah confronts prophets of Baal, God sends fire',
                he: 'אליהו מתעמת עם נביאי הבעל, אלוהים שולח אש'
            },
            reference: '1 Kings 18',
            tags: ['kings', 'prophet', 'miracle']
        },
        {
            id: 'fall_israel',
            name: { en: 'Fall of Northern Kingdom', he: 'נפילת ממלכת ישראל' },
            year: -722,
            period: 'kings',
            description: {
                en: 'Assyria conquers Israel, ten tribes exiled',
                he: 'אשור כובשת את ישראל, עשרת השבטים מגורשים'
            },
            reference: '2 Kings 17',
            tags: ['kings', 'major', 'exile', 'judgment']
        },
        {
            id: 'hezekiah',
            name: { en: 'Hezekiah\'s Deliverance', he: 'הצלת חזקיהו' },
            year: -701,
            period: 'kings',
            description: {
                en: 'God delivers Jerusalem from Assyrian siege',
                he: 'אלוהים מציל את ירושלים ממצור אשור'
            },
            reference: '2 Kings 19',
            tags: ['kings', 'miracle', 'deliverance']
        },
        {
            id: 'josiah_reform',
            name: { en: 'Josiah\'s Reforms', he: 'הרפורמות של יאשיהו' },
            year: -622,
            period: 'kings',
            description: {
                en: 'King Josiah discovers the Law and leads revival',
                he: 'המלך יאשיהו מגלה את התורה ומוביל התחדשות'
            },
            reference: '2 Kings 22-23',
            tags: ['kings', 'reform', 'revival']
        },
        {
            id: 'fall_jerusalem',
            name: { en: 'Fall of Jerusalem', he: 'נפילת ירושלים' },
            year: -586,
            period: 'exile',
            description: {
                en: 'Babylon destroys Jerusalem and the temple',
                he: 'בבל הורסת את ירושלים ואת המקדש'
            },
            reference: '2 Kings 25',
            tags: ['exile', 'major', 'judgment', 'destruction']
        },
        {
            id: 'daniel_lions',
            name: { en: 'Daniel in Lions\' Den', he: 'דניאל בגוב האריות' },
            year: -539,
            period: 'exile',
            description: {
                en: 'Daniel is protected by God in the lions\' den',
                he: 'דניאל מוגן על ידי אלוהים בגוב האריות'
            },
            reference: 'Daniel 6',
            tags: ['exile', 'miracle', 'deliverance']
        },
        {
            id: 'cyrus_decree',
            name: { en: 'Cyrus\' Decree', he: 'גזירת כורש' },
            year: -538,
            period: 'return',
            description: {
                en: 'Persian king Cyrus allows Jews to return to Jerusalem',
                he: 'המלך הפרסי כורש מתיר ליהודים לחזור לירושלים'
            },
            reference: 'Ezra 1',
            tags: ['return', 'major', 'restoration']
        },
        {
            id: 'temple_rebuilt',
            name: { en: 'Temple Rebuilt', he: 'בניית המקדש מחדש' },
            year: -516,
            period: 'return',
            description: {
                en: 'The second temple is completed in Jerusalem',
                he: 'בית המקדש השני הושלם בירושלים'
            },
            reference: 'Ezra 6',
            tags: ['return', 'major', 'temple', 'restoration']
        },
        {
            id: 'ezra_return',
            name: { en: 'Ezra Returns', he: 'שיבת עזרא' },
            year: -458,
            period: 'return',
            description: {
                en: 'Ezra leads revival of the Law in Jerusalem',
                he: 'עזרא מוביל התחדשות התורה בירושלים'
            },
            reference: 'Ezra 7-10',
            tags: ['return', 'revival', 'law']
        },
        {
            id: 'nehemiah_walls',
            name: { en: 'Nehemiah Rebuilds Walls', he: 'נחמיה בונה את החומות' },
            year: -445,
            period: 'return',
            description: {
                en: 'Nehemiah rebuilds the walls of Jerusalem in 52 days',
                he: 'נחמיה בונה את חומות ירושלים ב-52 יום'
            },
            reference: 'Nehemiah 6',
            tags: ['return', 'restoration', 'building']
        }
    ],

    // Key Biblical Figures
    people: [
        {
            id: 'adam',
            name: { en: 'Adam', he: 'אדם' },
            period: 'creation',
            role: { en: 'First Man', he: 'האדם הראשון' },
            description: {
                en: 'Created by God in His image, father of humanity',
                he: 'נברא על ידי אלוהים בצלמו, אבי האנושות'
            },
            lifespan: { born: -4004, died: -3074 }
        },
        {
            id: 'noah',
            name: { en: 'Noah', he: 'נח' },
            period: 'creation',
            role: { en: 'Ark Builder', he: 'בונה התיבה' },
            description: {
                en: 'Righteous man who built the ark and saved his family from the flood',
                he: 'איש צדיק שבנה את התיבה והציל את משפחתו מהמבול'
            },
            lifespan: { born: -2948, died: -1998 }
        },
        {
            id: 'abraham',
            name: { en: 'Abraham', he: 'אברהם' },
            period: 'patriarchs',
            role: { en: 'Father of Faith', he: 'אבי האמונה' },
            description: {
                en: 'Called by God to be father of many nations, covenant bearer',
                he: 'נקרא על ידי אלוהים להיות אב להמון עמים, נושא הברית'
            },
            lifespan: { born: -2166, died: -1991 }
        },
        {
            id: 'moses',
            name: { en: 'Moses', he: 'משה' },
            period: 'exodus',
            role: { en: 'Lawgiver & Deliverer', he: 'מחוקק ומושיע' },
            description: {
                en: 'Led Israel out of Egypt and received the Law from God',
                he: 'הוביל את ישראל ממצרים וקיבל את התורה מאלוהים'
            },
            lifespan: { born: -1571, died: -1451 }
        },
        {
            id: 'david',
            name: { en: 'David', he: 'דוד' },
            period: 'kings',
            role: { en: 'King of Israel', he: 'מלך ישראל' },
            description: {
                en: 'Greatest king of Israel, man after God\'s own heart',
                he: 'המלך הגדול ביותר של ישראל, איש כלבב אלוהים'
            },
            lifespan: { born: -1085, died: -1015 }
        },
        {
            id: 'solomon',
            name: { en: 'Solomon', he: 'שלמה' },
            period: 'kings',
            role: { en: 'Wise King', he: 'המלך החכם' },
            description: {
                en: 'Wisest man who built the temple in Jerusalem',
                he: 'האדם החכם ביותר שבנה את המקדש בירושלים'
            },
            lifespan: { born: -1035, died: -975 }
        }
    ],

    // Biblical Artifacts and Objects
    artifacts: [
        {
            id: 'ark_covenant',
            name: { en: 'Ark of the Covenant', he: 'ארון הברית' },
            period: 'exodus',
            description: {
                en: 'Sacred chest containing the Ten Commandments',
                he: 'ארון קודש המכיל את עשרת הדברות'
            },
            significance: { en: 'Symbol of God\'s presence', he: 'סמל לנוכחות אלוהים' }
        },
        {
            id: 'tabernacle',
            name: { en: 'The Tabernacle', he: 'המשכן' },
            period: 'exodus',
            description: {
                en: 'Portable temple used by Israelites in wilderness',
                he: 'בית מקדש נייד ששימש את ישראל במדבר'
            },
            significance: { en: 'God\'s dwelling among His people', he: 'משכן אלוהים בתוך עמו' }
        },
        {
            id: 'solomons_temple',
            name: { en: 'Solomon\'s Temple', he: 'בית המקדש של שלמה' },
            period: 'kings',
            description: {
                en: 'Magnificent temple built in Jerusalem by King Solomon',
                he: 'בית מקדש מפואר שנבנה בירושלים על ידי המלך שלמה'
            },
            significance: { en: 'Center of worship for Israel', he: 'מרכז הפולחן לישראל' }
        }
    ],

    // Quiz Questions
    quizQuestions: {
        easy: [
            {
                question: { en: 'Who built the ark?', he: 'מי בנה את התיבה?' },
                options: {
                    en: ['Noah', 'Moses', 'Abraham', 'David'],
                    he: ['נח', 'משה', 'אברהם', 'דוד']
                },
                correctIndex: 0,
                explanation: {
                    en: 'Noah built the ark to save his family from the flood.',
                    he: 'נח בנה את התיבה כדי להציל את משפחתו מהמבול.'
                }
            },
            {
                question: { en: 'Who parted the Red Sea?', he: 'מי קרע את ים סוף?' },
                options: {
                    en: ['Moses', 'Joshua', 'Elijah', 'Aaron'],
                    he: ['משה', 'יהושע', 'אליהו', 'אהרן']
                },
                correctIndex: 0,
                explanation: {
                    en: 'God parted the Red Sea through Moses to save Israel.',
                    he: 'אלוהים קרע את ים סוף דרך משה כדי להציל את ישראל.'
                }
            },
            {
                question: { en: 'Who defeated Goliath?', he: 'מי הביס את גלית?' },
                options: {
                    en: ['David', 'Saul', 'Jonathan', 'Samuel'],
                    he: ['דוד', 'שאול', 'יהונתן', 'שמואל']
                },
                correctIndex: 0,
                explanation: {
                    en: 'Young David defeated the giant Goliath with a sling and stone.',
                    he: 'דוד הצעיר הביס את הענק גלית עם קלע ואבן.'
                }
            }
        ],
        medium: [
            {
                question: { en: 'Which king built the temple in Jerusalem?', he: 'איזה מלך בנה את המקדש בירושלים?' },
                options: {
                    en: ['Solomon', 'David', 'Hezekiah', 'Josiah'],
                    he: ['שלמה', 'דוד', 'חזקיהו', 'יאשיהו']
                },
                correctIndex: 0,
                explanation: {
                    en: 'King Solomon built the magnificent temple in Jerusalem.',
                    he: 'המלך שלמה בנה את בית המקדש המפואר בירושלים.'
                }
            },
            {
                question: { en: 'How many plagues were sent to Egypt?', he: 'כמה מכות נשלחו למצרים?' },
                options: {
                    en: ['10', '7', '12', '40'],
                    he: ['10', '7', '12', '40']
                },
                correctIndex: 0,
                explanation: {
                    en: 'God sent ten plagues to Egypt before Pharaoh released Israel.',
                    he: 'אלוהים שלח עשר מכות למצרים לפני שפרעה שחרר את ישראל.'
                }
            }
        ],
        hard: [
            {
                question: { en: 'In what year did the Babylonian exile begin?', he: 'באיזו שנה החלה גלות בבל?' },
                options: {
                    en: ['586 BCE', '722 BCE', '538 BCE', '931 BCE'],
                    he: ['586 לפני הספירה', '722 לפני הספירה', '538 לפני הספירה', '931 לפני הספירה']
                },
                correctIndex: 0,
                explanation: {
                    en: 'Jerusalem fell and the Babylonian exile began in 586 BCE.',
                    he: 'ירושלים נפלה וגלות בבל החלה ב-586 לפני הספירה.'
                }
            }
        ]
    },

    // Map Locations
    mapLocations: {
        overview: [
            { id: 'egypt', name: { en: 'Egypt', he: 'מצרים' }, x: 30, y: 70 },
            { id: 'sinai', name: { en: 'Mount Sinai', he: 'הר סיני' }, x: 35, y: 75 },
            { id: 'jerusalem', name: { en: 'Jerusalem', he: 'ירושלים' }, x: 45, y: 50 },
            { id: 'babylon', name: { en: 'Babylon', he: 'בבל' }, x: 70, y: 45 }
        ]
    }
};
