## 🎯 Jobs To Be Done – Games Section

This document outlines detailed Jobs To Be Done (JTBD) for the **Games** section of the LuvFutbol app. It captures functional, emotional, contextual, interaction-level, and technical design needs of football coaches when planning, managing, and reviewing matches.

---

### ⚙️ Functional Jobs

| Job                          | Description                                            | Desired Outcome                                           |
| ---------------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| Plan a Match Fixture         | Create or import a match with minimal effort           | Match appears in calendar, pre-loaded with necessary info |
| Assign Lineup & Formation    | Select players and positions for the upcoming match    | Visual lineup is complete and saved to tactics board      |
| Build Tactical Setup         | Create tactical strategy visually                      | Saved tactics board aligns with game model & coach vision |
| Link Preparatory Training    | Connect training sessions to match objectives          | Training relevance is clearly linked to match plan        |
| Collect Match Data           | Enter stats (manually or via integration)              | Accurate match data is saved and usable post-game         |
| Generate Post-Match Insights | Summarize what happened, key events, and performance   | AI or coach-generated summary available for review        |
| Review Game Against Strategy | Reflect on how the game aligned with intended strategy | Insight into tactical execution and success/failure       |

---

### 🤝 Emotional Jobs

| Job                                    | Description                                   | Emotional Benefit                 |
| -------------------------------------- | --------------------------------------------- | --------------------------------- |
| Feel in control of match prep          | Stay organised and thorough ahead of fixtures | Confidence, clarity, preparedness |
| Save time on admin work                | Avoid repetitive entry of fixtures or stats   | Efficiency, less frustration      |
| Reflect intelligently post-game        | Make sense of game outcome with AI support    | Clarity, reduced overwhelm        |
| Show players and staff tactical intent | Use boards to communicate clearly             | Authority, professionalism        |

---

### 📱 Contextual Jobs

| Job                        | When It Happens                                 | Trigger/Event                                    |
| -------------------------- | ----------------------------------------------- | ------------------------------------------------ |
| Add fixture automatically  | When a new game is scheduled by league/calendar | AI detects & prompts setup                       |
| Prepare matchday sheet     | The night before or morning of a match          | Coach wants to print/export plan                 |
| Capture real-time insights | During or immediately after match               | Coach wants to voice-tag or note tactical events |
| Review match as a team     | At post-match session                           | Coach shares summary + clips + tactics board     |

---

### 🧩 Interaction Design Jobs (Board Usability)

| Job                             | Description                                 | Desired Interaction Experience                           |
| ------------------------------- | ------------------------------------------- | -------------------------------------------------------- |
| Sketch tactical ideas naturally | Draw shapes (circles, arrows, Xs) on screen | Shapes are converted into smart objects in real time     |
| Rearrange players easily        | Tap-drag-drop players across zones          | Snaps to pitch zones or grid optionally                  |
| Create formations intuitively   | Place players by shape or auto-fill line    | System recognizes common formations or templates         |
| Undo/redo quickly               | Correct drawing or positioning mistakes     | Simple gestures to undo/redo any action                  |
| Switch perspectives smoothly    | View pitch from multiple tactical angles    | Pitch toggles between full, half, thirds views instantly |
| Add notes live during a match   | Voice or text input tied to moment on pitch | Automatically tagged and timestamped with board context  |
| Duplicate previous setup        | Use last match's board as starting point    | One-tap duplication, with ability to tweak               |

---

### 🛠️ Technical & Design Considerations

| Principle                   | Application in Games Section                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------- |
| Mobile-first UI             | Fully responsive, touch-optimized tactical board with thumb-friendly controls                             |
| Offline-first Architecture  | Games, tactics boards, and notes can be created offline and synced later via Supabase                     |
| Modular Component Structure | Tactical board, match planner, and notes implemented as reusable modules (Next.js 15, Tailwind)           |
| Konva.js Canvas Integration | Used for precise drawing, object detection, and animation sequences on the tactics board                  |
| Supabase Integration        | Handles auth, match data, board storage, stats and user roles securely                                    |
| Role-Based Access           | Coaches create/edit, players view read-only; assistant coaches may comment or draft versions              |
| High Performance            | Local caching of match data, lightweight animations, and fast load times even with media-rich boards      |
| Coach-Friendly UX           | Uses authentic football language (philosophy, principles, phase of play) throughout board and planning UI |

---

### 🔗 Related Features

* Smart Fixture Import (AI, Calendar Sync, API)
* Tactics Board with Live Drawing Recognition
* Match Stats & Event Logging
* AI Game Summary Generator
* Training-to-Match Linking
* Calendar Auto-Sync
* Post-Match Notes Integration
* Gesture & object-based interaction layer
* Offline Editing Support
* Default Libraries: Formations, Phases, Principles
* Public Shareable Match Boards


---

This JTBD mapping ensures the Games section supports the full life cycle of match planning, execution, analysis, and interaction — designed for mobile-first performance, coach-friendly logic, and future-ready architecture.

---

## ✍️ Live Drawing Recognition – Intelligent UI Layer

### Interaction Model

Users draw directly on the tactics board or session builder. The UI interprets common coaching shapes into smart objects.

| Drawn Shape | Interpreted As | Action |
|-------------|---------------|--------|
| Circle | Player | Auto-assign team, draggable |
| X or Cross | Opposition Player | Styled differently, editable |
| Arrow | Run/Pass Direction | Connects nearest player to end of arrow |
| Rectangle | Zone or Training Area | Taggable (e.g. press zone, rondo space) |
| Line | Tactical Link | Represent pass, press trigger, etc. |

### Smart Enhancements (Core)

- Auto-snap to grid or formation template
- Predictive mirroring (L→R or vice versa)
- Press-hold gestures to open object edit menu
- Undo/redo gesture support
- Time-aware movement paths (for animation)
- Grouping for duplication or mirroring drills

### Use Cases:

- Sketch team shapes and AI suggests formation
- Draw arrows from players to define movements
- Build session diagrams by drawing drills