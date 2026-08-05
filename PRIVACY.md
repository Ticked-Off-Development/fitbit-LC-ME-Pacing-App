# Privacy Policy — LC ME Pacing

**Last updated:** August 2026

LC ME Pacing is a Fitbit OS application that helps people with Long Covid or ME
(Myalgic Encephalomyelitis) pace their activity against their Anaerobic Threshold (AT).

This policy explains exactly what the app reads, where it keeps it, and who else can see it.

## Medical disclaimer

**LC ME Pacing is not a medical device.** It does not diagnose, treat, cure, or prevent any
disease. Heart rate values come from a wrist-based optical sensor and are estimates that may be
inaccurate, particularly during movement. The app is an informational aid only. Talk to your
clinician before changing your activity levels, and do not use it as a substitute for
professional medical advice.

## What the app accesses

| Data | Source | Why |
|---|---|---|
| Live heart rate | On-device heart rate sensor | To display your current HR zone and alert you when you cross your anaerobic threshold |
| Resting heart rate | Your Fitbit user profile | To calculate AT using the WorkWell Foundation formula (RHR + 15) |
| Age | Your Fitbit user profile | To calculate AT using the Maximum Heart Rate formulas (220 − age) |
| Body presence | On-device body presence sensor | To detect when the watch is taken off, so heart rate history clears and alerts stop |
| Battery level | Device power API | To display the battery indicator |

These map to the four permissions the app requests: `access_heart_rate`,
`access_user_profile`, `access_activity`, and `run_background`.

## What the app does with it

Everything is processed on your watch, in real time, to draw the display and decide whether to
vibrate.

The app also stores a small amount of data on the watch itself:

- **Your settings** (AT formula, alert interval, alert type, mute duration, daily budget, colour
  mode) — saved to `settings.cbor` on the watch, and synced between the watch and the Fitbit
  phone app so the settings screen stays in step.
- **Daily pacing stats** (seconds spent above AT today, today's date, current session total) —
  saved to `daily-stats.cbor` on the watch. Stats reset automatically at midnight.

No raw heart rate history is written to storage. The trend indicator keeps the last 10 readings
in memory only, and clears them when you take the watch off.

## What leaves your device

**Nothing.**

LC ME Pacing makes no network requests. It has no server, no analytics, no crash reporting, and
no third-party SDKs. The developer cannot see your heart rate, your settings, or your usage —
there is no mechanism by which that data could reach anyone.

The only data transfer that happens at all is between your own watch and your own phone, over
Fitbit's built-in settings channel, so that the settings screen in the Fitbit app can configure
the watch.

Published builds of the app produce no console or debug output.

## Retention and deletion

Both files live in the app's private storage on the watch. Uninstalling LC ME Pacing removes
them permanently. Daily stats reset on their own each midnight.

## Data the app never touches

The app does not access location, GPS, contacts, exercise or workout records, sleep data,
weight, nutrition, payment information, or the internet.

## Your Fitbit data

Your underlying Fitbit account data remains governed by
[Fitbit's own privacy policy](https://www.fitbit.com/global/us/legal/privacy-policy). You can
revoke this app's permissions at any time by uninstalling it from the Fitbit app.

## Children

LC ME Pacing is not directed at children under 13 and does not knowingly collect any data from
them.

## Changes to this policy

Any change will be published in this file with an updated date. Because the app collects nothing
remotely, changes will only ever concern what is stored on your own device.

## Contact

Questions about this policy: `<SUPPORT_EMAIL>`

Source code: https://github.com/Ticked-Off-Development/fitbit-LC-ME-Pacing-App
