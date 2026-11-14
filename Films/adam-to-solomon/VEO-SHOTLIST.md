# From a Garden to a Temple: realistic version with Veo

**בעברית, בקצרה:** הקובץ הזה הוא ההמשך של העבודה. יש כבר סרט גמור בסגנון צלליות (`From a Garden to a Temple.mp4`). המטרה עכשיו היא גרסה ריאליסטית: כל שוט נוצר ב-Veo (דרך Flow, עם מנוי הגוגל של המשתמש), ואז מחברים את הקטעים עם אותה מוזיקה ואותן כותרות. למטה יש פרומפט מוכן לכל שוט.

---

## For the session that picks this up

Read this file first, then `STATE.md`. You are continuing work started in a cloud session that could not reach the user's browser.

**What exists**
- `From a Garden to a Temple.mp4`: the finished 3:00 film, 1920x1080, in a sunset-silhouette look drawn in code (`film.html`, rendered with `python3 tools/make.py final`). The user approved it.
- `audio/music.wav`: the music the user picked by ear, already cut to 3:00. "The call of the desert" by zero-project, CC BY 3.0. Its credit line is in `From a Garden to a Temple-credits.txt` and must stay in the video description.
- The chapter timing below is the timing of that film and of the music cut. Keep it, so the music and captions still land.

**What the user asked for**
- A more realistic version, made with Google's video model, using their Google subscription in the browser (Flow), not a paid API key.
- The user writes in Hebrew. Reply in Hebrew.

**What the user has already decided (do not re-ask)**
- Story: Adam and Eve up to King Solomon, about 3 minutes, 16:9.
- Words: on-screen text only, no narrator.
- Music: "The call of the desert" (above).
- Isaac must be in it (the user noticed when he was missing).
- Looks the user rejected: engraved antique chart ("looks old Chinese"), stone mosaic.

**What is still open (ask once, before generating everything)**
- Whether Veo's realism is what they want: make the two test shots first (1B Eden and 6D the sea) and show them.
- Whether to keep Veo's own audio under the music or use the music alone. Recommended: music alone, Veo audio muted, because the effects were never heard and approved.
- Whether to keep the red line motif (see "The red line" below).

**How to work in the browser**
1. Confirm with the user that Flow opens in their browser with the subscription, and how many generations their plan allows. Each attempt uses credits, including the ones that are thrown away, so say the count before each batch.
2. Settings for every shot: 16:9, the highest quality the plan allows, 8 seconds unless the shot list says otherwise. Longer than needed is fine; shots are trimmed in the edit.
3. Paste the STYLE block, then the shot prompt. Generate, look at the result, and show the user before moving on in the first few shots. After the look is agreed, work in batches of one chapter.
4. Download each accepted clip as `clips/<shot id>.mp4` (for example `clips/1B.mp4`). `clips/` is not in git because `*.mp4` is ignored; keep it on the user's disk.
5. For consistency, use Flow's reference or first-frame image where it helps: export a still of the accepted Abraham, Moses and David and reuse it for their later shots.

**Limits to respect**
- Never type the user's Google password or handle their credentials. They sign in themselves.
- Keep people adult and clothed in every prompt. Eden uses simple linen wraps and figures seen from behind. The Moriah shot shows a father and a grown son walking and an altar; it must not show harm to anyone.
- If a prompt is refused by the tool, simplify it and say so; do not look for ways around the refusal.

---

## STYLE block (paste before every shot prompt)

```
Photorealistic biblical epic, shot on 35mm anamorphic, natural light, golden hour or dramatic weather, warm earth tones with deep shadows, volumetric haze and dust, shallow depth of field, slow deliberate camera movement, ancient Near East setting, period-accurate rough linen and wool clothing, no modern objects, no text, no captions, no logos. Audio: natural ambience only, no dialogue, no music.
```

## Shot list

Times are positions in the 3:00 film. "Use" is how long the shot runs in the edit. Generate 8 s unless noted, then trim.

### C1 Eden, 0:00 to 0:16
Caption 0:03.6 to 0:08.9: IN THE BEGINNING, A GARDEN

| Shot | At | Use | Prompt |
|---|---|---|---|
| 1A | 0:00 | 5 s | `Aerial shot gliding low over a lush ancient garden at sunrise: rivers, fruit trees, tall grass, mist burning off, birds rising. The camera moves forward fast and settles on one enormous old fruit tree on a low hill, backlit by the sun.` |
| 1B | 0:05 | 6 s | `Wide shot beneath a massive old fruit tree heavy with red fruit, huge setting sun behind it with long god rays through the branches. A man and a woman in simple linen wraps stand under it, seen from behind at a distance, faces not visible. The woman slowly reaches up and picks one fruit. A serpent is coiled on the trunk. Slow dolly in.` |
| 1C | 0:11 | 5 s | `Same garden at dusk, the light turning cold and blue. Leaves fall from the great tree. The man and woman, now in rough animal-skin garments, walk away from camera down the hill with bowed heads into a barren landscape. Slow crane up, wind rising.` |

### C2 The Flood, 0:16 to 0:32
Caption 0:18.6 to 0:24.6: THE WATERS ROSE. ONE BOAT FLOATED

| Shot | At | Use | Prompt |
|---|---|---|---|
| 2A | 0:16 | 5 s | `A huge wooden ark on a hilltop under black storm clouds, first heavy rain falling. Pairs of animals walk up a ramp into it: elephants, giraffes, deer, sheep, camels. An old bearded man in a wool robe watches at the door. Lightning in the distance. Wide shot, slow push in.` |
| 2B | 0:21 | 6 s | `Torrential rain, flood water rising over fields and trees until only the hilltop remains, then the great wooden ark lifts and floats free on dark heaving water. Lightning flashes. Wide shot from water level, slow crane up.` |
| 2C | 0:27 | 5 s | `The storm breaks. Calm water to the horizon, the ark resting on a mountain top, sunlight through parting clouds and a full rainbow arching over it. A white dove flies toward camera carrying a green olive sprig. Slow truck right.` |

### C3 Babel, 0:32 to 0:46
Caption 0:41.2 to 0:45.6: ONE LANGUAGE BECAME MANY

| Shot | At | Use | Prompt |
|---|---|---|---|
| 3A | 0:32 | 8 s | `A colossal stepped mud-brick tower under construction on a desert plain at hot orange dusk, far taller than anything around it, wooden scaffolding and ramps, hundreds of tiny workers carrying bricks, dust in the air. Camera tilts up slowly from the base to the unfinished top in the clouds.` |
| 3B | 0:40 | 6 s | `At the top of the unfinished brick tower, workers stop, shout at each other without understanding, drop their tools and scatter down the ramps in every direction. Bricks tumble from the upper tier. Wide shot pulling back, strong wind, dust.` |

### C4 Abraham, Isaac, Jacob, 0:46 to 1:04
Captions 0:50.4 to 0:54: COUNT THE STARS, IF YOU CAN · 0:54.6 to 0:58.2: A SON WAS GIVEN, AND GIVEN BACK

| Shot | At | Use | Prompt |
|---|---|---|---|
| 4A | 0:46 | 7.6 s | `Night in the desert. An old bearded man in a blue wool robe steps out of a goat-hair tent beside a small campfire, sheep and a camel resting nearby, and lifts his face and one arm toward a sky blazing with thousands of stars and the Milky Way. A shooting star crosses. Slow tilt up from the man to the stars.` |
| 4B | 0:53.6 | 4.6 s | `Before dawn on a bare mountain top. An old bearded father and his grown son in rough robes stand beside a stone altar stacked with firewood. A shaft of warm light breaks through the clouds onto them and the father lowers his raised hand and embraces his son. Behind them a ram is caught by its horns in a thicket. Wide shot, slow push in.` |
| 4C | 0:58.2 | 5.8 s | `Night on a stony hillside. A young man sleeps on the ground with his head on a stone. Above him a broad stairway of golden light rises from the earth into the stars, with faint luminous figures moving up and down it. Slow crane up along the stairway.` |

### C5 Joseph, 1:04 to 1:20
Caption 1:10.6 to 1:16.4: SOLD FOR SILVER. RAISED TO RULE

| Shot | At | Use | Prompt |
|---|---|---|---|
| 5A | 1:04 | 4.4 s | `Green pasture hills. A young man in a striped robe of many bright colours walks toward ten older shepherds, his brothers, who turn and stare at him with hard faces. Sheep around them. Medium wide shot, handheld.` |
| 5B | 1:08.4 | 5.6 s | `A camel caravan of traders crosses desert dunes at sunset leading a young man on foot with bound hands. Silver coins change hands in the foreground. In the far distance the pyramids of Egypt stand on the horizon. Wide shot trucking right.` |
| 5C | 1:14 | 6 s | `Ancient Egypt in golden light. A man in fine white linen and a gold collar stands on stone steps above great heaps of harvested grain, palm trees and the Nile behind him, pyramids beyond. A group of dusty travellers in shepherd robes approach and bow before him. Slow crane up.` |

### C6 Moses and the sea, 1:20 to 1:42
Captions 1:26.2 to 1:29.7: LET MY PEOPLE GO · 1:35.2 to 1:40.4: AND THE SEA STOOD UP

| Shot | At | Use | Prompt |
|---|---|---|---|
| 6A | 1:20 | 4 s | `Slaves in loincloths make and carry mud bricks under a harsh red sun beside a half-built Egyptian monument, an overseer with a whip standing over them. Dust and heat haze. Truck right along the line of workers.` |
| 6B | 1:24 | 6 s | `A rocky desert mountainside at dusk. A thorn bush burns with bright flame yet its green branches are not consumed. A bearded shepherd in a wool robe sets down his staff, removes his sandals and kneels before it, shielding his face from the light. Slow push in.` |
| 6C | 1:30 | 4 s | `Dawn on the shore of a vast sea. A great crowd of people in ancient robes, seen from behind, stand trapped at the water's edge. Far behind them an army with torches and chariots approaches. An old bearded man climbs a rock and raises a wooden staff. Wind rising. Wide shot.` |
| 6D | 1:34 | 8 s | `The sea splits apart: two towering walls of dark water rise on either side of a dry sandy path running to the horizon, where sunlight breaks through storm clouds. The crowd in ancient robes, seen from behind, walk onto the path between the walls of water. Strong wind blows spray and cloaks. Slow crane up and push forward.` |

### C7 Sinai, 1:42 to 1:58
Caption 1:53 to 1:57.4: FORTY YEARS TO CROSS A DESERT

| Shot | At | Use | Prompt |
|---|---|---|---|
| 7A | 1:42 | 5 s | `A dark granite desert mountain wrapped in smoke and fire at its summit, lightning striking the peak, a huge crowd of tiny figures gathered at its foot looking up. One small figure climbs toward the top. Wide shot, slow push in with a slight arc.` |
| 7B | 1:47 | 5 s | `Close shot of two rounded stone tablets on a rock ledge in firelight. Lines of ancient script cut themselves into the stone one after another, glowing gold as they form, small chips of stone falling. Slow push in.` |
| 7C | 1:52 | 6 s | `A vast camp of goat-hair tents in a desert valley, a rectangular tented sanctuary at its centre with a tall column of cloud standing over it. A long line of people and flocks winds through the dunes toward it. Aerial shot trucking right at sunset.` |

### C8 The land, 1:58 to 2:14
Caption 2:03.2 to 2:08: WALLS FELL. JUDGES ROSE

| Shot | At | Use | Prompt |
|---|---|---|---|
| 8A | 1:58 | 4.4 s | `Seven priests in robes blow long ram's-horn trumpets as they march in line past the towering stone walls of an ancient fortified city, an army behind them. Low angle, dust, amber evening light. Truck right with the march.` |
| 8B | 2:02.4 | 1.8 s | `The massive stone walls and towers of the ancient city crack and collapse outward in a wave of falling blocks and rolling dust. Wide shot, slight camera shake. (Generate 4 s.)` |
| 8C | 2:04.2 | 5.2 s | `A woman judge in a head covering sits beneath a tall palm tree on a hilltop while people gather to hear her. At night behind her, a line of men on a ridge hold flaming torches and clay jars. Slow truck right from day into night.` |
| 8D | 2:09.4 | 4.6 s | `A golden barley field at harvest near a small hill town. A young woman in a head scarf bends to gather fallen stalks behind the reapers. A landowner in a fine robe stands watching her kindly. Low sun, wind moving through the grain. Slow dolly in.` |

### C9 David, 2:14 to 2:36
Caption 2:22.4 to 2:27: A SHEPHERD BECAME KING

| Shot | At | Use | Prompt |
|---|---|---|---|
| 9A | 2:14 | 6.4 s | `A dry valley between two hills lined with armies. A shepherd youth in a simple tunic whirls a leather sling and releases a stone. Far across the valley an enormous armoured warrior with a spear and shield staggers and falls. Wide shot that whips right with the stone, dust rising.` |
| 9B | 2:20.4 | 7.2 s | `Interior of a stone hall in warm lamplight. A young man plays a wooden lyre, his fingers on the strings in close-up. The camera rises to his face as a simple gold crown is placed on his head by an old prophet's hands. Shallow depth of field.` |
| 9C | 2:27.6 | 8.4 s | `Ancient Jerusalem on its hill at dawn: stone walls, flat-roofed houses stepping up the slope, a gate, smoke from cooking fires. A procession with a king at its head climbs the road toward the gate. Aerial shot rising slowly over the city, pink and gold sky.` |

### C10 Solomon, 2:36 to 3:00
No caption. The title FROM A GARDEN TO A TEMPLE comes at 2:53 over 10C.

| Shot | At | Use | Prompt |
|---|---|---|---|
| 10A | 2:36 | 7 s | `Builders raise a great temple of pale cut stone on a hilltop: workers haul stone blocks on sledges and ropes, cedar beams stacked nearby, wooden scaffolding, two tall bronze pillars standing at the entrance. A master builder holds a plumb line against the wall. Golden morning light, slow crane up.` |
| 10B | 2:43 | 5.4 s | `The finished temple at sunrise. Its doors open and the interior blazes with gold: gold-covered walls, lampstands, light pouring out through the doorway between two bronze pillars. A king in royal robes stands on the steps with his arms lifted. Slow push in toward the door.` |
| 10C | 2:48.4 | 11.6 s | `Very wide aerial shot pulling slowly back and up from a gleaming white and gold temple on a hill above ancient Jerusalem at sunrise, the whole land stretching away beyond it: hills, desert, a distant sea. Huge sun on the horizon, long shadows, birds crossing. (Generate 8 s and extend it once, or slow the last seconds in the edit.)` |

Total: 31 shots.

---

## The red line

In the drawn film one glowing red line runs through every scene, from Eden to the Temple's plumb line. It is the film's signature. Three ways to treat it in the realistic version; ask the user which:

1. **Drop it.** Simplest. The realistic footage carries the story alone.
2. **Overlay it in the edit (recommended).** Render the line by itself from `film.html` as a transparent layer and lay it over the Veo footage with the captions. It stays one consistent graphic over changing footage.
3. **Put it in the picture.** Add "a single scarlet cord" to each prompt (tied on a wrist, on the ark's rail, across the tablets). Veo will not keep it consistent between shots.

## Putting it together

1. Trim each clip to its "Use" length and scale to 1920x1080 at 24 fps:
   ```bash
   ffmpeg -i clips/1B.mp4 -t 6 -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=24" -an -c:v libx264 -crf 16 cut/1B.mp4
   ```
2. Join them in shot order with the concat demuxer (`cut/list.txt`), giving one silent 3:00 picture.
3. Lay `audio/music.wav` under it and master to about -14 LUFS (`python3 tools/master_audio.py --help`).
4. Captions: the caption texts and times are in the tables above and in `film.html` (`card(...)` calls). Burn them in the bottom letterbox bar in the same face (Cinzel bold, capitals, cream on black) so both versions match, or render them from `film.html` as an overlay.
5. Save the result as `From a Garden to a Temple (realistic).mp4`. Keep the drawn version; do not overwrite it.
6. The music credit line in `From a Garden to a Temple-credits.txt` goes in the video description of this version too.
7. Tell the user plainly that the picture was generated with Veo; platforms may ask for an AI-generated label when it is uploaded.

## Checks before showing a cut

- No modern objects, watermarks or stray text in any clip.
- The same person looks roughly the same across their shots (Abraham 4A and 4B, Moses 6B to 7A, David 9A to 9C).
- Cuts land on the times above, so the caption for each chapter appears over its own footage.
- Ask the user to listen once on headphones and once on a phone speaker; loudness can be measured but not heard.
