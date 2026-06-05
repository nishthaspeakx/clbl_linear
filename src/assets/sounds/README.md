# Game sound effects

Drop short `.mp3` clips here, then wire them in
`src/services/soundService.ts` → `SOUND_ASSETS` (replace the matching `null`
with a `require('../assets/sounds/<file>.mp3')`).

Until a file is wired, that event is **silently skipped** — the app never
crashes for a missing sound.

Keep clips **short (< 1.5s)**, premium, and not irritating. Background music is
out of scope — short effects only.

## Expected files (suggested set)

| File                    | Event(s)                                   | Feel                          |
| ----------------------- | ------------------------------------------ | ----------------------------- |
| `button_tap.mp3`        | `button_tap`                               | soft click / pop              |
| `tab_switch.mp3`        | `tab_switch`                               | soft navigation tap           |
| `pin_tap.mp3`           | `pin_tap`                                  | light tap + sparkle           |
| `start_lesson.mp3`      | `start_lesson`                             | short positive chime          |
| `correct_answer.mp3`    | `correct_answer`                           | success ding                  |
| `wrong_answer.mp3`      | `wrong_answer`                             | soft error buzz (not harsh)   |
| `exercise_complete.mp3` | `exercise_complete`                        | short celebration tune        |
| `level_complete.mp3`    | `level_complete`                           | bigger success fanfare        |
| `character_walk.mp3`    | `character_walk`                           | soft footsteps                |
| `coin_collect.mp3`      | `coin_collect`, `coin_cascade`             | coin pickup (auto pitch-vary) |
| `reward_box_appear.mp3` | `reward_box_appear`                        | magical whoosh                |
| `reward_box_shake.mp3`  | `reward_box_shake`                         | small rattle                  |
| `reward_open.mp3`       | `reward_box_open`                          | sparkle burst                 |
| `reward_unlocked.mp3`   | `reward_unlocked`                          | achievement fanfare           |
| `claim_reward.mp3`      | `claim_reward`                             | satisfying collect            |
| `reward_rare.mp3`       | `reward_rare`                              | blue crystal chime            |
| `reward_epic.mp3`       | `reward_epic`                              | magical purple sparkle        |
| `reward_legendary.mp3`  | `reward_legendary`                         | big golden celebration        |
| `item_placed.mp3`       | `item_placed`                              | soft placement                |
| `invalid_place.mp3`     | `invalid_place`                            | soft blocked                  |
| `day_night_toggle.mp3`  | `day_night_toggle`                         | soft transition whoosh        |
| `avatar_changed.mp3`    | `avatar_changed`                           | sparkle / makeover            |

Several events may share one file until you have dedicated clips
(e.g. all soft taps can point at `button_tap.mp3`).
