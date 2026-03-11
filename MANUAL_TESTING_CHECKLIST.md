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
- [ ] Default settings are applied on first launch (alert interval: 30, formula: Workwell, color mode: gradient, alert type: nudge, mute duration: 5 min, daily budget: 30 min)
- [ ] App timeout is disabled (app stays running indefinitely, does not exit after inactivity)
- [ ] AT Stats module initializes on launch (daily stats loaded from file or defaults)

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

## 4. HR Trend Indicator

- [ ] Trend indicator is displayed to the right of the HR value in the zone panel
- [ ] **Rising (`^`)**: shown in red (#ff6b6b) when recent HR average is >2 BPM above older average
- [ ] **Falling (`v`)**: shown in teal (#4ecdc4) when recent HR average is >2 BPM below older average
- [ ] **Stable (`-`)**: shown in gray (#aaaaaa) when the difference is within 2 BPM
- [ ] Trend requires at least 6 readings before showing rising/falling (shows stable until then)
- [ ] Trend is calculated by comparing the average of the newer half vs older half of the last 10 readings
- [ ] HR history is cleared when the device is removed from the wrist
- [ ] Trend resets to stable after removing and re-wearing the device
- [ ] Non-numeric or invalid HR readings are not added to the history
- [ ] Trend indicator updates on every HR sensor reading

---

## 5. RHR & AT Display

- [ ] RHR (Resting Heart Rate) label is displayed on the left side of the reference row
- [ ] RHR value shows the user's resting heart rate from their Fitbit profile
- [ ] RHR shows `--` if the value is unavailable or invalid
- [ ] AT (Anaerobic Threshold) label is displayed on the right side of the reference row
- [ ] AT value updates when settings change (formula or custom value)
- [ ] A vertical divider separates the RHR and AT sections

---

## 6. Heart Rate Zone Colors

### 6.1 Gradient Mode (Default)

- [ ] Background panel uses a gradient (two distinct colors blending) by default
- [ ] **Gray gradient** is shown when heart rate is not detected (`--`)
- [ ] **Blue gradient** is shown at lowest exertion (HR near/below RHR + 25% of safe zone)
- [ ] **Green gradient** is shown in low-moderate safe zone (25%-50% of safe zone)
- [ ] **Yellow gradient** is shown in moderate zone (50%-75% of safe zone)
- [ ] **Orange gradient** is shown in high zone (75%-100% of safe zone)
- [ ] **Red gradient** is shown when heart rate exceeds AT
- [ ] Zone color transitions smoothly as heart rate changes between zones

### 6.2 Solid Color Mode

- [ ] After toggling ON in settings, background uses a single solid color (no gradient)
- [ ] All six zone colors still apply correctly (gray, blue, green, yellow, orange, red)
- [ ] Switching back to gradient mode (toggle OFF) restores gradient display

### 6.3 Edge Cases

- [ ] If RHR is unavailable: zones fall back to green (below AT) or red (at/above AT) only
- [ ] Zone boundaries are calculated correctly as quartiles of (AT - RHR) range

---

## 7. Vibration Alerts

### 7.1 Basic Alert Behavior

- [ ] Vibration triggers when heart rate exceeds the calculated AT
- [ ] Vibration stops when heart rate drops below AT
- [ ] No vibration occurs when heart rate is at or below AT
- [ ] Alert uses the default "nudge" haptic pattern on first install

### 7.2 Alert Interval (0-300 seconds)

- [ ] With interval set to **0**: vibration triggers once when crossing above AT (no repeat alerts while above)
- [ ] With interval set to **30**: vibration triggers, then waits 30 seconds before next alert (even if HR stays above AT)
- [ ] With interval set to **300** (max): only one alert every 5 minutes
- [ ] Changing the interval in settings takes effect immediately on the device
- [ ] Interval slider moves in increments of 5 seconds

### 7.3 Alert Type (Haptic Patterns)

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

## 8. Mute / Snooze Functionality

- [ ] **Single pressing** the physical **back button** mutes vibration alerts
- [ ] **Double pressing** the back button within 1.5 seconds exits the app
- [ ] `MUTE Xm` indicator appears on the watchface (inside the HR zone panel)
- [ ] The mute indicator shows the correct remaining minutes (e.g., `MUTE 5m`)
- [ ] The countdown decrements each minute (e.g., `MUTE 5m` → `MUTE 4m` → ...)
- [ ] No vibration alerts fire while muted, even if HR is above AT
- [ ] Alerts resume automatically after the mute duration expires
- [ ] The `MUTE` indicator disappears when the mute period ends
- [ ] Pressing back button again while muted **resets** the mute timer (does not stack)
- [ ] Default mute duration is 5 minutes
- [ ] Changing mute duration in settings (1-60 min) changes the mute period for subsequent presses

---

## 9. AT Formula Settings

### 9.1 Workwell Foundation (RHR + 15) — Default

- [ ] AT is calculated as user's RHR + 15
- [ ] AT value shown on the watchface matches (RHR + 15)
- [ ] If RHR is unavailable, AT falls back to default (100 BPM)

### 9.2 MaxHR x 50%

- [ ] AT is calculated as (220 - age) × 0.50, rounded down
- [ ] AT value on the watchface updates to reflect this formula
- [ ] If age is unavailable, AT falls back to default (100 BPM)

### 9.3 MaxHR x 55%

- [ ] AT is calculated as (220 - age) × 0.55, rounded down
- [ ] AT value on the watchface updates to reflect this formula
- [ ] If age is unavailable, AT falls back to default (100 BPM)

### 9.4 MaxHR x 60%

- [ ] AT is calculated as (220 - age) × 0.60, rounded down
- [ ] AT value on the watchface updates to reflect this formula
- [ ] If age is unavailable, AT falls back to default (100 BPM)

### 9.5 Custom AT

- [ ] Selecting "Custom AT" in the formula dropdown reveals a text input field
- [ ] The text input field is **hidden** when any other formula is selected
- [ ] Entering a valid number (40-220) sets the AT to that exact value
- [ ] AT value on the watchface updates to the custom value
- [ ] Values below 40 are rejected (AT stays at previous value)
- [ ] Values above 220 are rejected (AT stays at previous value)
- [ ] Non-numeric input is rejected
- [ ] Changing from custom to another formula recalculates AT using the new formula

### 9.6 Formula Switching

- [ ] Switching between formulas updates the AT display immediately
- [ ] HR zone colors update immediately when AT changes
- [ ] Vibration alert threshold changes to the new AT value immediately

---

## 10. AT Stats Page (Scroll View)

### 10.1 Scroll Navigation

- [ ] The main clockface is the first page (visible on launch)
- [ ] Scrolling down reveals the AT Stats page
- [ ] AT Stats page has a "AT Stats" header bar at the top
- [ ] Scrolling back up returns to the main clockface
- [ ] Scroll navigation is smooth and responsive

### 10.2 Time Above AT

- [ ] "ABOVE AT" label is displayed on the AT Stats page
- [ ] Cumulative time above AT is shown in `M:SS` format (e.g., `3:45`)
- [ ] Timer accumulates while heart rate is above AT
- [ ] Timer does not accumulate while heart rate is at or below AT
- [ ] Elapsed time between readings is capped at 5 seconds (prevents large jumps from sensor gaps)
- [ ] Session time is preserved across brief watch removals (e.g., adjusting the band)
- [ ] Session time resets to 0 on a new day (midnight rollover)
- [ ] Initial display shows `0:00`

### 10.3 Recovery Timer

- [ ] "RECOVERY" label is displayed on the AT Stats page
- [ ] Shows `--:--` in gray when idle (HR has not crossed above AT)
- [ ] When HR drops below AT: timer starts counting up in orange with "recovering" status label
- [ ] When HR reaches a safe zone (blue or green): timer freezes in green with "recovered" status label, showing how long recovery took
- [ ] If HR crosses above AT again during recovery: recovery resets to idle
- [ ] Recovery state resets when the device is removed from the wrist

### 10.4 Daily Exertion Budget

- [ ] "DAILY BUDGET" label is displayed on the AT Stats page
- [ ] Used vs total budget is shown (e.g., `5 / 30 min`)
- [ ] Remaining minutes are shown (e.g., `25 min remaining`)
- [ ] Progress bar fills proportionally as budget is consumed
- [ ] **Progress bar colors**:
  - [ ] Green (#66bb6a) when under 50% used
  - [ ] Yellow (#ffee58) when 50-74% used
  - [ ] Orange (#ffa726) when 75-89% used
  - [ ] Red (#ef5350) when 90%+ used
- [ ] At 80% usage: a `confirmation-max` haptic vibration fires as a warning
- [ ] "LIMIT NEAR" warning label appears in orange at 80%+ usage
- [ ] The 80% haptic warning fires only once per day (does not repeat)
- [ ] "OVER LIMIT" warning label appears in red when budget is fully consumed (100%+)
- [ ] Default daily budget is 30 minutes
- [ ] Budget resets to 0 at midnight (date rollover)
- [ ] Daily budget persists across app restarts (saved to `daily-stats.cbor`)
- [ ] Budget remaining shows `0 min remaining` when fully used (no negative values)

### 10.5 Daily Budget Setting

- [ ] Changing the daily budget in settings (5-120 min, step 5) updates the budget on the device
- [ ] Progress bar and labels recalculate with the new budget immediately
- [ ] Invalid budget values are rejected (current budget kept)

---

## 11. Settings Persistence

- [ ] Settings are saved when the app is unloaded (exits or device restarts)
- [ ] Settings are restored when the app launches again
- [ ] All settings persist: alert interval, alert type, AT formula, custom AT, color mode, mute duration, daily budget
- [ ] Daily stats (time above AT, daily date) persist separately in `daily-stats.cbor`
- [ ] Default values are used correctly on first-ever launch (no saved file)

---

## 12. Settings Synchronization (Companion ↔ Device)

- [ ] Changing a setting in the Fitbit mobile app updates the device immediately when connected
- [ ] All settings sync when the device connects (companion sends all on peerSocket `open` event)
- [ ] Settings sync handles all keys: `colorMode`, `alertInterval`, `alertType`, `atFormula`, `customAT`, `muteDuration`, `dailyBudget`
- [ ] Malformed setting messages are handled gracefully (no crash, logged warning)
- [ ] When peerSocket is not connected, the companion logs a warning (no crash)

---

## 13. Battery Display

- [ ] Battery percentage is shown in the top-right area (e.g., `85%`)
- [ ] Battery bar width reflects the current charge level proportionally
- [ ] **Above 10%**: battery bar is white, battery icon is standard
- [ ] **At or below 10%**: battery bar turns red, battery icon turns red, percentage text turns red
- [ ] **Charging**: charging icon (lightning bolt) appears next to battery
- [ ] **Charger connected but not charging**: charging icon still appears
- [ ] **Not charging**: charging icon is hidden
- [ ] Battery display updates in real time as the charge level changes

---

## 14. UI Layout & Visual Design

- [ ] Black background covers the entire screen
- [ ] Top status bar shows date on the left and battery on the right
- [ ] Subtle separator lines (dark gray) divide the major sections
- [ ] Main HR zone panel occupies the central ~50% of the screen
- [ ] Heart rate text is large and centered in the zone panel
- [ ] Reference values row (RHR / AT) is cleanly divided with a vertical divider
- [ ] Time display is centered at the bottom of the screen
- [ ] HR trend indicator is positioned to the right within the HR zone panel
- [ ] All text elements are readable and properly aligned
- [ ] No overlapping elements at any screen state
- [ ] Scroll view allows navigating between the main clockface and the AT Stats page
- [ ] AT Stats page has clearly separated sections (Above AT, Recovery, Daily Budget) with divider lines
- [ ] Daily budget progress bar has rounded corners and is properly aligned
- [ ] Budget warning label is centered and visible when triggered
- [ ] Layout renders correctly on Versa 3 (336×336 px)
- [ ] Layout renders correctly on Sense 2

---

## 15. Settings UI (Fitbit Mobile App)

- [ ] Settings page loads without errors in the Fitbit mobile app
- [ ] **Alert Interval** section: slider moves from 0 to 300 in steps of 5, label updates dynamically
- [ ] **Alert Mute Duration** section: slider moves from 1 to 60 in steps of 1, label updates dynamically
- [ ] **Alert (Haptic) Type** section: dropdown lists all 8 options, selection is saved
- [ ] **AT Formula** section: dropdown lists all 5 formulas, selection is saved
- [ ] **AT Formula** dropdown: "Workwell RHR + 15" is the first option in the list (matches default)
- [ ] **Custom AT** text input appears only when "Custom AT" formula is selected
- [ ] **Custom AT** text input accepts numeric values
- [ ] **Color Mode** toggle: shows "ON: Solid Color" when on, "OFF: Gradient Colors" when off
- [ ] **Daily Exertion Budget** section: slider moves from 5 to 120 in steps of 5, label updates dynamically
- [ ] All sections have descriptive titles and helper text
- [ ] Settings descriptions accurately describe the behavior

---

## 16. Permissions

- [ ] App requests `access_heart_rate` permission
- [ ] App requests `access_user_profile` permission (for age and RHR)
- [ ] If heart rate permission is denied: HR shows `--`, zone is gray, no alerts fire
- [ ] If user profile permission is denied: age-based formulas fall back to default AT (100)

---

## 17. Error Handling & Edge Cases

- [ ] App does not crash when HeartRateSensor is unavailable
- [ ] App does not crash when BodyPresenceSensor is unavailable
- [ ] App handles invalid/missing user profile data (age, RHR) gracefully with fallback defaults
- [ ] App handles corrupted or missing settings file (loads defaults)
- [ ] Invalid AT formula values are rejected (current formula kept)
- [ ] Invalid alert interval values are rejected (current interval kept)
- [ ] Invalid custom AT values (non-numeric, out of range) are rejected
- [ ] Invalid alert type values are rejected (current type kept)
- [ ] Invalid mute duration values are rejected (current duration kept)
- [ ] Invalid daily budget values are rejected (current budget kept)
- [ ] AT value is always clamped to the 40-220 BPM range regardless of formula result
- [ ] Corrupted or missing `daily-stats.cbor` file loads defaults gracefully
- [ ] AT Stats handles body removal gracefully (recovery/state resets, session time preserved)
- [ ] HR trend handles non-numeric readings without adding them to history
- [ ] No runtime exceptions appear in the Fitbit console during normal usage

---

## 18. Device Compatibility

- [ ] App installs and runs on **Fitbit Versa 3** (atlas)
- [ ] App installs and runs on **Fitbit Sense 2** (vulcan)
- [ ] All features work identically on both supported devices
- [ ] App does not appear as installable on unsupported devices

---

## 19. Performance & Stability

- [ ] App runs continuously without memory leaks or degradation over extended periods (1+ hour)
- [ ] Heart rate sensor readings remain responsive over time
- [ ] App does not cause excessive battery drain compared to other clockfaces
- [ ] App does not freeze or become unresponsive
- [ ] Settings changes are responsive (no long delays between change and effect)
- [ ] Mute timer fires correctly after the full duration (does not drift)

---

## 20. Build & Lint

- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes with no errors
- [ ] `npm run test` (ESLint checks) passes
- [ ] No TypeScript or JavaScript errors during build

---

## Notes

- **AT default fallback**: When a formula cannot compute (missing age/RHR), the AT defaults to 100 BPM.
- **Zone calculation**: The safe zone between RHR and AT is divided into 4 equal quartiles (blue → green → yellow → orange), with red for above AT.
- **Mute vs. Alert Interval**: Mute silences all alerts entirely for a duration. Alert interval controls the minimum gap between consecutive alerts when HR is above AT.
- **HR trend**: Uses a sliding window of the last 10 readings, split into older and newer halves. A difference of >2 BPM between half-averages triggers rising/falling.
- **Recovery timer**: Measures how long it takes to drop from above-AT to a safe zone (blue/green). It is not just below-AT — the user must reach a restful HR level.
- **Daily budget**: Tracks cumulative minutes above AT per calendar day. Persists in `daily-stats.cbor` so it survives app restarts. Resets automatically at midnight.
- **Budget warning**: The 80% haptic fires exactly once per day (`budgetWarningFired` flag resets on date rollover).
- **Settings flow**: Settings UI → Fitbit settingsStorage → Companion parses & sends → Device receives via peerSocket → Callback applies changes. Companion also syncs all settings on peerSocket `open` event.
- **AT formula order fix**: The settings dropdown now lists "Workwell RHR + 15" first to match the device default, preventing a mismatch on first launch.
