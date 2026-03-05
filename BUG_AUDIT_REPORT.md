# Bug Audit Analysis — Fitbit LC ME Pacing App

## Context
Comprehensive bug audit of the Fitbit LC ME Pacing App, a wearable application that monitors heart rate against an Anaerobic Threshold (AT) and alerts users when they exceed it. The app runs on Fitbit devices with a companion phone app for settings synchronization.

All bugs below have survived adversarial review and are verified as real issues.

---

## Verified Bugs

### BUG 1 [CRITICAL — 10 pts]: Back Button Prevents App Exit
- **Location**: `app/index.js:93-98`
- **Description**: The `keypress` handler calls `evt.preventDefault()` on every `back` button press, then calls `hrm.muteAlerts()`. This prevents the standard back-button exit mechanism on Fitbit devices. While users can still exit via the side button, the back button is the primary and most intuitive exit mechanism. Overriding it without providing an alternative exit flow (e.g., double-press to exit, or long-press to exit) is a significant UX problem.
- **Fix**: Implement double-press-to-exit logic, or only intercept back when alerts are active, or add a visible "press side button to exit" indicator.

### BUG 2 [MEDIUM — 5 pts]: `alertInterval = 0` Causes Excessive Vibration
- **Location**: `app/hrm.js:65`, `app/device-settings.js:49`, `settings/index.jsx:14`
- **Description**: The default `alertInterval` is 0. The vibration condition `(Date.now() - lastVibration) / 1000 > alertInterval` is always true when `alertInterval = 0` (since elapsed time > 0). This causes the device to vibrate on **every single HR sensor reading** (every ~1-2 seconds) while heart rate is above AT. The settings slider allows 0 as a valid value (`min='0'`). Even if "vibrate on every reading" is technically what "0 second interval" means, it's excessive and drains battery.
- **Fix**: Set minimum alertInterval to 5 seconds, or treat 0 as "vibrate once on threshold crossing only."

### BUG 3 [MEDIUM — 5 pts]: Custom AT Validation Mismatch Between Layers
- **Location**: `app/index.js:50` vs `app/hrm.js:303`
- **Description**: `index.js:50` validates custom AT with `isFinite(customValue) && customValue > 0`, accepting values 1-39 and 221+. But `hrm.js:303` rejects values outside `MIN_AT(40)` to `MAX_AT(220)`. Values like 30 BPM pass the first check but are silently rejected by `setCustomAT()`. The user receives no feedback that their value was rejected; the old value persists silently.
- **Fix**: Align validation in `index.js` to use the same MIN_AT/MAX_AT bounds, or at minimum provide user feedback when a value is rejected.

### BUG 4 [MEDIUM — 5 pts]: `calculateAT()` Called 3x Per HR Reading
- **Location**: `app/hrm.js:55,60,73` → `getZoneColors():187`, `calculateAT():60`, `getZoneName():210`
- **Description**: Each heart rate sensor reading triggers three independent calls to `calculateAT()`, each of which also accesses `user.restingHeartRate` and `user.age`. This is redundant computation on a resource-constrained wearable device. More importantly, it introduces a theoretical consistency risk: if `user.restingHeartRate` updates between the calls, the zone color (call 1) and zone name (call 3) could disagree.
- **Fix**: Calculate AT once per reading, store the result, and pass it to all functions that need it.

### BUG 5 [MEDIUM — 5 pts]: Zones Collapse When AT ≤ RHR
- **Location**: `app/hrm.js:153-162`
- **Description**: When `at - rhr ≤ 0`, `safeZoneInterval()` returns 0, making all zone boundaries equal to `rhr`. The entire zone display collapses: any HR below RHR = BLUE, any HR at/above RHR = RED. Green, yellow, and orange zones disappear. This happens with: (a) `maxHR50` formula + high RHR (e.g., age 50, RHR 90 → AT=85 < RHR=90), (b) custom AT set below user's RHR, (c) `workwell` formula cannot trigger this since AT = RHR + 15.
- **Fix**: Detect when AT ≤ RHR and fall back to a simplified two-zone display with a user warning, or use absolute zone boundaries in this case.

### BUG 6 [MEDIUM — 5 pts]: Recovery Completes Instantly (0 seconds) on Large HR Drop
- **Location**: `app/at-stats.js:69-84`
- **Description**: When HR drops from above AT directly into blue or green zone in a single reading, both the recovery start (line 69-72) and recovery completion check (line 81-84) execute in the same function call with the same `now` timestamp. This gives `lastRecoveryDuration = 0` seconds, and the UI shows "recovered" with "0:00" duration. This occurs when HR drops by more than ~2 zone intervals in one reading.
- **Fix**: Require at least one subsequent reading before checking recovery completion, or require a minimum recovery duration threshold.

### BUG 7 [MEDIUM — 5 pts]: Session Stats Lost on Brief Watch Removal
- **Location**: `app/at-stats.js:107-114`
- **Description**: Both `onBodyPresenceChanged(false)` (line 103) and `onBodyPresenceChanged(true)` (line 108) reset `sessionAboveATSeconds = 0`. A brief watch removal (e.g., adjusting the band for 2 seconds) erases all accumulated session statistics. Daily stats survive (persisted in CBOR), but session-level data is lost. This affects the "ABOVE AT" display on Screen 2.
- **Fix**: Add a grace period before resetting session stats on watch removal, or preserve session stats across brief interruptions.

### BUG 8 [MEDIUM — 5 pts]: No Type Validation in `setColorMode`
- **Location**: `app/hrm.js:277-280`, `app/device-settings.js:43-57`
- **Description**: `setColorMode()` does `useSolid = userColorMode` with no type checking. If the settings CBOR file becomes corrupted and contains `colorMode: 42` or `colorMode: "true"`, `useSolid` will be a non-boolean truthy value. The code works by truthy/falsy coercion today, but there's no validation at the `loadSettings()` level or in the setter. This is the weakest setter in the codebase — all other setters validate their inputs.
- **Fix**: Add `useSolid = !!userColorMode` or explicit boolean validation.

### BUG 9 [LOW — 1 pt]: `sendValue` Silently Drops Empty String Values
- **Location**: `companion/companion-settings.js:32`
- **Description**: `if (val)` skips falsy values. If a TextInput is cleared by the user, `settingsStorage.getItem()` returns `""` (empty string), which is falsy. The setting is never sent to the device. Currently only affects the `customAT` TextInput field if cleared.
- **Fix**: Change to `if (val != null)` or `if (val !== null)`.

### BUG 10 [LOW — 1 pt]: Inverted Comments in Color Mode Logic
- **Location**: `app/index.js:27-33`
- **Description**: Comments are backwards: `if (useSolid)` has comment "Use gradient colors" and `else` has "Use solid color". The console.log strings are also inconsistent. This creates confusion for maintainers and increases risk of logic reversal during refactoring.
- **Fix**: Correct the comments to match the actual behavior.

### BUG 11 [LOW — 1 pt]: Empty JSX Expressions (Dead Code)
- **Location**: `settings/index.jsx:50,68`
- **Description**: Lines 50 and 68 contain empty JSX expressions `{}` that evaluate to `undefined` and render nothing. These are leftover development artifacts.
- **Fix**: Remove the empty `{}` expressions.

---

## Score Summary

| # | Bug | Severity | Points |
|---|-----|----------|--------|
| 1 | Back button prevents app exit | Critical | 10 |
| 2 | alertInterval=0 excessive vibration | Medium | 5 |
| 3 | Custom AT validation mismatch | Medium | 5 |
| 4 | calculateAT() called 3x per reading | Medium | 5 |
| 5 | Zones collapse when AT ≤ RHR | Medium | 5 |
| 6 | Recovery completes instantly (0s) | Medium | 5 |
| 7 | Session stats lost on watch removal | Medium | 5 |
| 8 | No type validation in setColorMode | Medium | 5 |
| 9 | sendValue drops empty strings | Low | 1 |
| 10 | Inverted comments | Low | 1 |
| 11 | Empty JSX expressions | Low | 1 |

### **TOTAL VERIFIED SCORE: 48 points**

- Critical bugs: 1 (10 pts)
- Medium bugs: 7 (35 pts)
- Low bugs: 3 (3 pts)

---

## Proposed Fix Priority

### P0 — Must Fix
1. **Bug 1**: Back button exit (Critical UX blocker)
2. **Bug 2**: Alert interval default/minimum (affects every new user)

### P1 — Should Fix
3. **Bug 3**: Custom AT validation alignment
4. **Bug 6**: Recovery instant completion logic
5. **Bug 5**: Zone collapse when AT ≤ RHR
6. **Bug 4**: Cache calculateAT() per reading cycle
7. **Bug 8**: Boolean coercion in setColorMode

### P2 — Nice to Fix
8. **Bug 7**: Session stats persistence across brief watch removal
9. **Bug 9**: sendValue falsy check
10. **Bug 10**: Fix inverted comments
11. **Bug 11**: Remove empty JSX

## Files Requiring Changes
- `app/index.js` — Back button handler (Bug 1), custom AT validation (Bug 3), comments (Bug 10)
- `app/hrm.js` — Alert interval handling (Bug 2), calculateAT caching (Bug 4), zone collapse (Bug 5), setColorMode validation (Bug 8)
- `app/at-stats.js` — Recovery logic (Bug 6), session stats (Bug 7)
- `companion/companion-settings.js` — sendValue falsy check (Bug 9)
- `settings/index.jsx` — Empty JSX cleanup (Bug 11)
