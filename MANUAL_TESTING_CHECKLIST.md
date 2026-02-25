# Manual Testing Checklist

Comprehensive checklist for manually verifying all features of the LC ME Pacing App. Tests should be performed on a real Fitbit device (Versa 3 or Sense 2) paired with the Fitbit mobile app.

---

## Prerequisites

- [ ] Fitbit device (Versa 3 or Sense 2) with Developer Bridge enabled
- [ ] Fitbit mobile app installed and paired
- [ ] App built and installed successfully (`npx fitbit` then `bi`)
- [ ] User profile on Fitbit account has age and resting heart rate (RHR) data
- [ ] Device is charged and worn on the wrist

---

## 1. App Launch & Initial State

- [ ] App installs without errors
- [ ] App launches and displays the clockface without crashes
- [ ] Default settings are applied on first launch (alert interval: 0, formula: Workwell, color mode: gradient, alert type: nudge, mute duration: 5 min)
- [ ] App timeout is disabled (app stays running indefinitely, does not exit after inactivity)

---

## 2. Clock & Date Display

- [ ] Current time is displayed in 12-hour format (e.g., `11:35`)
- [ ] AM/PM indicator is shown and correct
- [ ] Time updates every minute (not seconds)
- [ ] Day of week is displayed as 3-letter abbreviation (e.g., `Wed`)
- [ ] Date is displayed in "Mon DD" format (e.g., `Feb 25`)
- [ ] Date and day update correctly at midnight

---

## 3. Heart Rate Monitoring

- [ ] Heart rate value is displayed prominently in large text when device is worn
- [ ] "BPM" label is shown below the heart rate number
- [ ] Heart rate updates continuously as the sensor reads
- [ ] Heart rate shows `--` when the device is not being worn (body presence sensor)
- [ ] Heart rate sensor stops when the device is removed from the wrist
- [ ] Heart rate sensor restarts when the device is placed back on the wrist
- [ ] Heart rate shows `--` if heart rate permission is not granted

---

## 4. RHR & AT Display

- [ ] RHR (Resting Heart Rate) label is displayed on the left side of the reference row
- [ ] RHR value shows the user's resting heart rate from their Fitbit profile
- [ ] RHR shows `--` if the value is unavailable or invalid
- [ ] AT (Anaerobic Threshold) label is displayed on the right side of the reference row
- [ ] AT value updates when settings change (formula or custom value)
- [ ] A vertical divider separates the RHR and AT sections

---

## 5. Heart Rate Zone Colors

### 5.1 Gradient Mode (Default)

- [ ] Background panel uses a gradient (two distinct colors blending) by default
- [ ] **Gray gradient** is shown when heart rate is not detected (`--`)
- [ ] **Blue gradient** is shown at lowest exertion (HR near/below RHR + 25% of safe zone)
- [ ] **Green gradient** is shown in low-moderate safe zone (25%-50% of safe zone)
- [ ] **Yellow gradient** is shown in moderate zone (50%-75% of safe zone)
- [ ] **Orange gradient** is shown in high zone (75%-100% of safe zone)
- [ ] **Red gradient** is shown when heart rate exceeds AT
- [ ] Zone color transitions smoothly as heart rate changes between zones

### 5.2 Solid Color Mode

- [ ] After toggling ON in settings, background uses a single solid color (no gradient)
- [ ] All six zone colors still apply correctly (gray, blue, green, yellow, orange, red)
- [ ] Switching back to gradient mode (toggle OFF) restores gradient display

### 5.3 Edge Cases

- [ ] If RHR is unavailable: zones fall back to green (below AT) or red (at/above AT) only
- [ ] Zone boundaries are calculated correctly as quartiles of (AT - RHR) range

---

## 6. Vibration Alerts

### 6.1 Basic Alert Behavior

- [ ] Vibration triggers when heart rate exceeds the calculated AT
- [ ] Vibration stops when heart rate drops below AT
- [ ] No vibration occurs when heart rate is at or below AT
- [ ] Alert uses the default "nudge" haptic pattern on first install

### 6.2 Alert Interval (0-300 seconds)

- [ ] With interval set to **0**: vibration triggers on every HR sensor reading above AT
- [ ] With interval set to **30**: vibration triggers, then waits 30 seconds before next alert (even if HR stays above AT)
- [ ] With interval set to **300** (max): only one alert every 5 minutes
- [ ] Changing the interval in settings takes effect immediately on the device
- [ ] Interval slider moves in increments of 5 seconds

### 6.3 Alert Type (Haptic Patterns)

Test each of the 8 haptic types by selecting them in settings while HR is above AT:

- [ ] **Alert** — distinct vibration pattern
- [ ] **Bump** — distinct vibration pattern
- [ ] **Confirmation** — distinct vibration pattern
- [ ] **Confirmation Max** — distinct vibration pattern
- [ ] **Nudge** — distinct vibration pattern (default)
- [ ] **Nudge Max** — distinct vibration pattern
- [ ] **Ping** — distinct vibration pattern
- [ ] **Ring** — distinct vibration pattern
- [ ] Changing the alert type in settings takes effect immediately on the device

---

## 7. Mute / Snooze Functionality

- [ ] Pressing the physical **back button** mutes vibration alerts
- [ ] `MUTE Xm` indicator appears on the watchface (inside the HR zone panel)
- [ ] The mute indicator shows the correct remaining minutes (e.g., `MUTE 5m`)
- [ ] The countdown decrements each minute (e.g., `MUTE 5m` → `MUTE 4m` → ...)
- [ ] No vibration alerts fire while muted, even if HR is above AT
- [ ] Alerts resume automatically after the mute duration expires
- [ ] The `MUTE` indicator disappears when the mute period ends
- [ ] Pressing back button again **resets** the mute timer (does not stack)
- [ ] Default mute duration is 5 minutes
- [ ] Changing mute duration in settings (1-60 min) changes the mute period for subsequent presses
- [ ] Pressing back button does **not** exit the app (default back behavior is overridden)

---

## 8. AT Formula Settings

### 8.1 Workwell Foundation (RHR + 15) — Default

- [ ] AT is calculated as user's RHR + 15
- [ ] AT value shown on the watchface matches (RHR + 15)
- [ ] If RHR is unavailable, AT falls back to default (100 BPM)

### 8.2 MaxHR x 50%

- [ ] AT is calculated as (220 - age) × 0.50, rounded down
- [ ] AT value on the watchface updates to reflect this formula
- [ ] If age is unavailable, AT falls back to default (100 BPM)

### 8.3 MaxHR x 55%

- [ ] AT is calculated as (220 - age) × 0.55, rounded down
- [ ] AT value on the watchface updates to reflect this formula
- [ ] If age is unavailable, AT falls back to default (100 BPM)

### 8.4 MaxHR x 60%

- [ ] AT is calculated as (220 - age) × 0.60, rounded down
- [ ] AT value on the watchface updates to reflect this formula
- [ ] If age is unavailable, AT falls back to default (100 BPM)

### 8.5 Custom AT

- [ ] Selecting "Custom AT" in the formula dropdown reveals a text input field
- [ ] The text input field is **hidden** when any other formula is selected
- [ ] Entering a valid number (40-220) sets the AT to that exact value
- [ ] AT value on the watchface updates to the custom value
- [ ] Values below 40 are rejected (AT stays at previous value)
- [ ] Values above 220 are rejected (AT stays at previous value)
- [ ] Non-numeric input is rejected
- [ ] Changing from custom to another formula recalculates AT using the new formula

### 8.6 Formula Switching

- [ ] Switching between formulas updates the AT display immediately
- [ ] HR zone colors update immediately when AT changes
- [ ] Vibration alert threshold changes to the new AT value immediately

---

## 9. Settings Persistence

- [ ] Settings are saved when the app is unloaded (exits or device restarts)
- [ ] Settings are restored when the app launches again
- [ ] All settings persist: alert interval, alert type, AT formula, custom AT, color mode, mute duration
- [ ] Default values are used correctly on first-ever launch (no saved file)

---

## 10. Settings Synchronization (Companion ↔ Device)

- [ ] Changing a setting in the Fitbit mobile app updates the device immediately when connected
- [ ] If the companion was not running when settings were changed, settings sync on next companion launch
- [ ] Settings sync handles all keys: `colorMode`, `alertInterval`, `alertType`, `atFormula`, `customAT`
- [ ] Malformed setting messages are handled gracefully (no crash, logged warning)
- [ ] When peerSocket is not connected, the companion logs a warning (no crash)

---

## 11. Battery Display

- [ ] Battery percentage is shown in the top-right area (e.g., `85%`)
- [ ] Battery bar width reflects the current charge level proportionally
- [ ] **Above 10%**: battery bar is white, battery icon is standard
- [ ] **At or below 10%**: battery bar turns red, battery icon turns red, percentage text turns red
- [ ] **Charging**: charging icon (lightning bolt) appears next to battery
- [ ] **Charger connected but not charging**: charging icon still appears
- [ ] **Not charging**: charging icon is hidden
- [ ] Battery display updates in real time as the charge level changes

---

## 12. UI Layout & Visual Design

- [ ] Black background covers the entire screen
- [ ] Top status bar shows date on the left and battery on the right
- [ ] Subtle separator lines (dark gray) divide the major sections
- [ ] Main HR zone panel occupies the central ~50% of the screen
- [ ] Heart rate text is large and centered in the zone panel
- [ ] Reference values row (RHR / AT) is cleanly divided with a vertical divider
- [ ] Time display is centered at the bottom of the screen
- [ ] All text elements are readable and properly aligned
- [ ] No overlapping elements at any screen state
- [ ] Layout renders correctly on Versa 3 (336×336 px)
- [ ] Layout renders correctly on Sense 2

---

## 13. Settings UI (Fitbit Mobile App)

- [ ] Settings page loads without errors in the Fitbit mobile app
- [ ] **Alert Interval** section: slider moves from 0 to 300 in steps of 5, label updates dynamically
- [ ] **Alert Mute Duration** section: slider moves from 1 to 60 in steps of 1, label updates dynamically
- [ ] **Alert (Haptic) Type** section: dropdown lists all 8 options, selection is saved
- [ ] **AT Formula** section: dropdown lists all 5 formulas, selection is saved
- [ ] **Custom AT** text input appears only when "Custom AT" formula is selected
- [ ] **Custom AT** text input accepts numeric values
- [ ] **Color Mode** toggle: shows "ON: Solid Color" when on, "OFF: Gradient Colors" when off
- [ ] All sections have descriptive titles and helper text
- [ ] Settings descriptions accurately describe the behavior

---

## 14. Permissions

- [ ] App requests `access_heart_rate` permission
- [ ] App requests `access_user_profile` permission (for age and RHR)
- [ ] If heart rate permission is denied: HR shows `--`, zone is gray, no alerts fire
- [ ] If user profile permission is denied: age-based formulas fall back to default AT (100)

---

## 15. Error Handling & Edge Cases

- [ ] App does not crash when HeartRateSensor is unavailable
- [ ] App does not crash when BodyPresenceSensor is unavailable
- [ ] App handles invalid/missing user profile data (age, RHR) gracefully with fallback defaults
- [ ] App handles corrupted or missing settings file (loads defaults)
- [ ] Invalid AT formula values are rejected (current formula kept)
- [ ] Invalid alert interval values are rejected (current interval kept)
- [ ] Invalid custom AT values (non-numeric, out of range) are rejected
- [ ] Invalid alert type values are rejected (current type kept)
- [ ] Invalid mute duration values are rejected (current duration kept)
- [ ] AT value is always clamped to the 40-220 BPM range regardless of formula result
- [ ] No runtime exceptions appear in the Fitbit console during normal usage

---

## 16. Device Compatibility

- [ ] App installs and runs on **Fitbit Versa 3** (atlas)
- [ ] App installs and runs on **Fitbit Sense 2** (vulcan)
- [ ] All features work identically on both supported devices
- [ ] App does not appear as installable on unsupported devices

---

## 17. Performance & Stability

- [ ] App runs continuously without memory leaks or degradation over extended periods (1+ hour)
- [ ] Heart rate sensor readings remain responsive over time
- [ ] App does not cause excessive battery drain compared to other clockfaces
- [ ] App does not freeze or become unresponsive
- [ ] Settings changes are responsive (no long delays between change and effect)
- [ ] Mute timer fires correctly after the full duration (does not drift)

---

## 18. Build & Lint

- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes with no errors
- [ ] `npm run test` (ESLint checks) passes
- [ ] No TypeScript or JavaScript errors during build

---

## Notes

- **AT default fallback**: When a formula cannot compute (missing age/RHR), the AT defaults to 100 BPM.
- **Zone calculation**: The safe zone between RHR and AT is divided into 4 equal quartiles (blue → green → yellow → orange), with red for above AT.
- **Mute vs. Alert Interval**: Mute silences all alerts entirely for a duration. Alert interval controls the minimum gap between consecutive alerts when HR is above AT.
- **Settings flow**: Settings UI → Fitbit settingsStorage → Companion parses & sends → Device receives via peerSocket → Callback applies changes.
