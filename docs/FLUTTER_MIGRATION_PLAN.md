# SpeakX Feature Migration Plan — "English Town" (RN prototype → SpeakX stack)

> **Goal:** turn the existing React Native + Expo prototype in this repo into a
> **production-ready SpeakX feature**.
>
> **SpeakX stack:** Flutter (frontend) · Golang (backend) · MongoDB (database).
>
> **No automated converter exists** — the UI/logic is rebuilt by hand in Dart,
> and the prototype's local storage becomes a real Golang + Mongo backend.

> ⚠️ **Assumptions to confirm with the SpeakX team** (I couldn't see the live app):
> state management, folder convention, API protocol (REST vs gRPC), auth, and
> theming are guessed from common SpeakX-scale practice. Adjust §2 and §3 once
> you confirm the real conventions.

---

## 1. The big shift: client-only → full-stack

The prototype stores **everything on-device** (6 AsyncStorage modules). In SpeakX
this data belongs on the server so it syncs across devices and ties to the user
account.

| Prototype (local) | SpeakX production |
|---|---|
| `progressStorage` | Mongo `user_progress` ← Golang API ← Flutter repo (+ local cache) |
| `rewardStorage` | Mongo `user_rewards` |
| `avatarStorage` | Mongo `user_avatar` |
| `dreamHomeLayoutStorage` | Mongo `dream_home_layouts` |
| `dreamHomePlacementStorage` | Mongo `dream_home_placements` |
| `exerciseProgressStorage` | Mongo `exercise_progress` |

Static content (`src/data/*` — rewards, scenes, exercises, vocab) can either be
**bundled in the app** (fastest) or **served from Golang** (lets you update
content without an app release — recommended for SpeakX).

---

## 2. Target architecture (Flutter + Golang + Mongo)

### Flutter (frontend)
- **State management:** Bloc/Cubit *(common at SpeakX scale — confirm)*.
  Alt: Riverpod if that's the house standard.
- **Networking:** `dio` (interceptors for SpeakX auth token, retries, logging).
- **Models/JSON:** `freezed` + `json_serializable` for DTOs.
- **Routing:** match SpeakX (`go_router` or `auto_route` — confirm).
- **Local cache:** `hive`/`shared_preferences` for offline + fast first paint.
- **Feature-first folders** (typical SpeakX-style):
  ```
  lib/features/english_town/
    ├── data/         # DTOs, datasources (remote+local), repositories impl
    ├── domain/       # entities, repository interfaces, usecases
    ├── presentation/ # screens, widgets, bloc/cubit
  ```

### Golang (backend)
- New service/module `englishtown` exposing endpoints (REST shown; swap for gRPC
  if SpeakX uses it):
  ```
  GET  /v1/englishtown/progress
  POST /v1/englishtown/progress
  GET  /v1/englishtown/rewards
  POST /v1/englishtown/rewards/claim
  GET  /v1/englishtown/avatar
  PUT  /v1/englishtown/avatar
  GET  /v1/englishtown/dreamhome
  PUT  /v1/englishtown/dreamhome/placements
  GET  /v1/englishtown/exercises/:id/progress
  POST /v1/englishtown/exercises/:id/submit
  GET  /v1/englishtown/content   # static data, if server-driven
  ```
- Reuse SpeakX's existing auth middleware, user identity, and Mongo driver setup.

### MongoDB
- Collections keyed by `userId` (see §1 table). Index on `userId` (+ compound
  with `rewardId`/`exerciseId` where relevant).
- Static-content collections (`rewards_catalog`, `scenes`, `vocab_questions`) if
  serving content from the backend.

---

## 3. Mapping the prototype to the SpeakX feature

| Prototype area | Files | Becomes |
|---|---|---|
| `src/data/*` | 18 | Dart entities + (bundled consts **or** Mongo content collections + Go handlers) |
| `src/utils/*` | 15 | Dart utils in `domain` (geometry, scoring, layout) — pure, unit-test these |
| `src/storage/*` | 6 | `data` layer: repositories + remote datasource (Go API) + local cache |
| `src/services/*` | 6 | Flutter services: sound (`just_audio`), TTS (`flutter_tts`), haptics (built-in), reward-claim → calls API |
| `src/navigation/AppTabs` | 1 | SpeakX router entry for the feature |
| `src/screens/*` | 9 | `presentation/screens` + a Bloc/Cubit each |
| `src/components/*` | ~80 | `presentation/widgets` (SVG → `flutter_svg`, animations → `AnimationController`) |

---

## 4. Dependency mapping (Flutter side)

| RN / Expo | Flutter |
|---|---|
| react-native-reanimated | `AnimationController` / `flutter_animate` (🔴 most effort) |
| react-native-svg | `flutter_svg` |
| react-native-gesture-handler | `GestureDetector` / `InteractiveViewer` (map pan-zoom) |
| expo-av | `just_audio` / `audioplayers` |
| expo-speech | `flutter_tts` |
| expo-haptics | `HapticFeedback` / `gaimon` |
| async-storage | **→ Golang API** (+ `hive` cache) |

---

## 5. Migration order (each phase compiles & runs)

### Phase 0 — Align & scaffold
- [ ] Confirm SpeakX conventions (state mgmt, routing, API protocol, auth, theme)
- [ ] Create `lib/features/english_town/` per SpeakX folder pattern
- [ ] Add packages (`dio`, `freezed`, `bloc`/chosen, `flutter_svg`, audio, tts)
- [ ] Copy `assets/` (36 PNG, 6 WAV) into the SpeakX asset pipeline

### Phase 1 — Domain (pure Dart, no UI, no network)
- [ ] `src/data/*` → entities + content models
- [ ] `src/utils/*` → utilities; **unit-test the geometry/score logic**

### Phase 2 — Backend + data layer (the new part)
- [ ] Golang: `englishtown` endpoints + Mongo collections + indexes
- [ ] Flutter `data`: DTOs (`freezed`), remote datasource (`dio`), repositories
- [ ] Local cache + offline strategy
- [ ] Contract-test Flutter ⇄ Go (Postman/integration tests)

### Phase 3 — Navigation shell
- [ ] Register feature route in SpeakX router; stub 9 screens so it boots

### Phase 4 — Screens, simple → hard
1. Membership → 2. Progress → 3. Home → 4. Rewards → 5. AvatarSetup →
6. VocabularyExercise → 7. AICall → 8. EnglishTown (map) → 9. DreamHomeEditor

### Phase 5 — Components (~80) — bulk of the work
- map (7) · scenes (20, SVG) · avatar (7) · exercises (5) ·
  **rewards (23 + reveal — animation-heavy)** · settings/top-level (14)

### Phase 6 — Parity & ship
- [ ] Recreate reward-reveal animations
- [ ] Sound/haptic timing parity
- [ ] Real-device test iOS + Android (no Expo Go in Flutter)
- [ ] Screen-by-screen visual diff vs prototype
- [ ] Code review against SpeakX standards → integrate

---

## 6. Hardest parts (where time goes)
1. **Reward reveal animations** (23 reward comps) — Reanimated → Flutter rewrite.
2. **English Town map** — pan/zoom + dynamic label placement + scene rendering.
3. **Dream Home editor** — drag/drop, zone validation, coordinate math.
4. **Backend + sync** — designing the Go API + Mongo schema + offline cache (new
   work that didn't exist in the prototype).

---

## 7. Recommended first step
A **vertical slice**: pick one screen (suggest **Progress** or **Rewards**) and
build it *all the way through the SpeakX stack* — Flutter UI → Bloc → repository
→ `dio` → Golang endpoint → Mongo. This proves the architecture and conventions
end-to-end and gives the team a real per-feature time estimate before committing
to all 147 files.

---

## 8. Rough effort
- Full feature, production-ready, full-stack: **~6–10 weeks** focused.
- The Golang/Mongo layer + animations are the long poles; static screens are fast.
