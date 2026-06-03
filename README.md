# English Town Map 🏙️

A mobile, game-style **town map** where an English learner walks a friendly Indian
male avatar from **lesson 1 → 60**. Each lesson is a glowing pin on an isometric
town. Finish a lesson and the character walks along the glowing route to the next
pin, with coin/star rewards and a camera that follows along.

Built **Android-first** with **Expo + TypeScript**.

---

## Tech stack

| Concern | Library |
|---|---|
| App framework | React Native + Expo (TypeScript) |
| Pins, path, glow, buildings | `react-native-svg` |
| Character walk / pulse / reward animations | `react-native-reanimated` |
| Pan + pinch-zoom | `react-native-gesture-handler` |
| Local progress | `@react-native-async-storage/async-storage` |

No backend is required for the MVP.

---

## Installation & run

```bash
npm install
npx expo start
```

Then:
- Press **`a`** to open the Android emulator, **or**
- Scan the QR code with the **Expo Go** app on your Android phone.

> First launch downloads the JS bundle, so give it a few seconds.

---

## Project structure

```
index.ts                            # Expo entry → registers src/App
src/
  App.tsx                           # Renders the screen
  screens/EnglishTownScreen.tsx     # State, progress, vertical camera, complete-flow, topic celebrations
  data/
    subtopics.ts                    # 60 lessons (topic, title, location, xPercent, yPercent, visualObject, topicIndex)
    topicZones.ts                   # 10 topic themes (name, accent, ground tints, emoji)
  utils/
    mapLayout.ts                    # Procedural world: px positions, winding road, building/prop placement, zone bands
    position.ts                     # curved-path builder + clamp helpers
  components/
    VerticalIsometricTownMap.tsx    # Scrollable iso world: ground + road + buildings + trees + coins + pins + character
    TopicZone.tsx                   # SVG iso building/prop library (IsoBuilding, Tree, Coin, TopicGround)
    LessonPin.tsx                   # Game-level node (locked / current / completed)
    CharacterAvatar.tsx             # Animated Indian male avatar (idle bounce + walk)
    LessonBottomCard.tsx            # Bottom info + Start / Complete buttons + topic chip
    RewardAnimation.tsx             # Coin + star burst on completion
  storage/progressStorage.ts        # AsyncStorage read/write (swap for API later)
docs/english-town-world-layout.md   # Full 60-lesson layout (topics, locations, visuals, prev/next)
```

---

## The vertical isometric world

A single **vertical journey (~8200px, ~10 phone screens)** in the Candy-Crush style,
with a fully **code-drawn isometric town** on both sides of one continuous winding road.
Lesson 1 is at the **bottom**; the road climbs to lesson 60 at the **top**.

- **The journey defines the world** — pin positions come from the CSV lesson ORDER
  (`xPercent` winds gently around the road, `yPercent` runs 96 → 5 bottom→top), generated
  in `src/data/subtopics.ts` and turned into pixels + buildings by `src/utils/mapLayout.ts`.
- **Topics, not districts** — the CSV `topic` column groups lessons into 10 themed zones
  (Everyday Life, My Family, Talk at Restaurant, Talk to Friends, Travel, At Work, Shopping,
  Social Interactions, At the Hotel, At the Airport). Each zone tints the ground and shows a
  small **TOPIC** banner.
- **Matching town locations** — every lesson's `location` maps to an isometric building/prop
  beside the road (cafe, market, grocery, clothing, cinema, gift shop, hotel, office, airport,
  home, park, bus stop, taxi, fountain plaza, town gate, monument…). Filler trees, bushes,
  coins and stars keep the world rich with no blank areas.
- **Pins on the road**; the **character walks the road** to the next pin on completion.

### Behaviour
- Opens focused on **lesson 1** (bottom). Drag up/down to scroll.
- **Current lesson auto-centres** when progress changes.
- Top progress card + bottom lesson card stay fixed.
- **Topic completion celebration** (+50 ⭐) when a topic's lessons are all done; **English
  Champion** finish after lesson 60.

### Customising
- **Reshape the journey:** edit `WORLD_H`, the building width / gutter positions, or the
  winding in `src/utils/mapLayout.ts`.
- **Re-theme a topic:** colours/emoji in `src/data/topicZones.ts`.
- **Move a pin / change its building:** edit `xPercent` / `yPercent` / `location` in
  `src/data/subtopics.ts` (location keywords pick the building kind in `mapLayout.ts`).
- **Add a new building style:** add a kind to `buildingKindOf` + a palette/renderer in
  `src/components/TopicZone.tsx`.
- **Connect a real lesson screen:** `handleStartLesson(id)` in `EnglishTownScreen.tsx` is the
  stub — swap the `console.log` for navigation.
- **Swap local progress for a backend:** replace the bodies of `loadProgress` / `saveProgress`
  in `src/storage/progressStorage.ts` (keep the `Progress` shape).

## Notes
- Reward values (`+10 ⭐` per lesson, `+50 ⭐` per topic) are cosmetic — wire to real XP later.
- The town is 100% SVG (no map image), so it scales to any phone width and is fully tunable.
