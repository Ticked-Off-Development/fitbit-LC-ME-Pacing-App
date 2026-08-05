# App Gallery Submission — LC ME Pacing

Copy for the [Fitbit Gallery App Manager](https://gam.fitbit.com/). Everything below is ready to
paste; fill the `<PLACEHOLDER>` values first.

## Placeholders to fill

| Placeholder | Where it's needed |
|---|---|
| `<PRIVACY_POLICY_URL>` | GAM listing field, and the link in this document |
| `<SUPPORT_EMAIL>` | GAM listing field, and `PRIVACY.md` |

---

## Before you submit

- [ ] Log in to [gam.fitbit.com](https://gam.fitbit.com/) and accept the
      [Platform Terms of Service](https://dev.fitbit.com/legal/platform-terms-of-service/) and the
      [App Distribution Agreement](https://dev.fitbit.com/legal/app-distribution-agreement/)
- [ ] Confirm the App Gallery is still accepting new submissions
- [ ] `npm run lint` and `npm test` clean
- [ ] `npx fitbit-build` succeeds for both build targets
- [ ] `common/log.js` has `DEBUG = false` (it is committed that way — verify it wasn't flipped
      during development, since published builds must be free of console output)
- [ ] `package.json` version reflects this release
- [ ] Screenshots captured (see below)
- [ ] Privacy policy hosted at a public URL
- [ ] Tested on a real device, not only the Simulator — reviewers test on hardware

---

## Listing fields

**App name:** LC ME Pacing

**App type:** App (not a clock face — it uses a scroll view and handles the back button, neither
of which clock faces support)

**Category:** Health & Fitness

**Version:** 1.0.0

**Supported devices:** Fitbit Versa 3, Fitbit Sense
> These are the two build targets in `package.json` — `atlas` and `vulcan` respectively, per
> `@fitbit/sdk` 6.1.0. Note that `vulcan` is the original **Sense**, not Sense 2; Sense 2 (`rhea`)
> has no official SDK support. The README's device list is out of step with this and should not be
> used as the source of truth for the listing.

**Privacy policy URL:** `<PRIVACY_POLICY_URL>`

**Support email:** `<SUPPORT_EMAIL>`

### Short description

Pace by your Anaerobic Threshold. Get a gentle buzz when your heart rate rises too high, so you
can stop, rest, and avoid post-exertional crashes.

### Long description

LC ME Pacing helps people living with Long Covid or ME/CFS stay under their Anaerobic Threshold
(AT) — the heart rate above which activity is more likely to trigger post-exertional malaise.

Your watch shows your live heart rate against a colour-coded zone, your resting heart rate, and
your AT. When you cross your threshold, the watch vibrates so you know to stop, rest, and pace.

**Choose how your AT is calculated**
- WorkWell Foundation guideline: resting heart rate + 15 beats (default)
- 50%, 55%, or 60% of maximum heart rate
- A custom value you set yourself (40–220 BPM)

**Alerts that fit how you pace**
- Repeat interval from 0 to 300 seconds, or a single buzz on crossing
- Eight haptic patterns to choose from
- Press the back button to mute for a few minutes when you already know you're over

**See your day, not just this moment**
- HR trend arrow shows whether your heart rate is rising, falling, or steady, so you can slow
  down before you cross AT
- Time above AT accumulated across the day
- Recovery timer showing how long it takes to drop back into a safe zone
- Daily exertion budget with a colour-coded progress bar and a warning as you approach the limit

**Your data stays on your watch.** LC ME Pacing makes no network requests. No servers, no
analytics, no tracking.

---

**LC ME Pacing is not a medical device.** It does not diagnose, treat, cure, or prevent any
disease. Heart rate readings are estimates from a wrist-based optical sensor and may be
inaccurate, particularly during movement. This app is an informational aid only — talk to your
clinician before changing your activity levels, and do not use it as a substitute for
professional medical advice.

### Release notes — 1.0.0

First public release.

- Live heart rate with colour-coded zones between resting heart rate and your AT
- Five ways to set your Anaerobic Threshold, including the WorkWell Foundation guideline
- Configurable vibration alerts with eight haptic patterns and an adjustable repeat interval
- Mute alerts from the watch with a single button press
- HR trend indicator to warn you before you cross AT
- AT Stats page: time above AT, recovery timer, and a daily exertion budget
- Settings sync between the Fitbit app and your watch

---

## Permission justifications

Reviewers ask why each requested permission is needed. All four are used.

| Permission | Justification |
|---|---|
| `access_heart_rate` | Reads the on-device heart rate sensor to display live BPM and to decide when the user has crossed their anaerobic threshold. This is the app's core function. |
| `access_user_profile` | Reads resting heart rate and age from the Fitbit profile to calculate the anaerobic threshold — resting HR for the WorkWell formula, age for the maximum-heart-rate formulas. Not used for anything else. |
| `access_activity` | Required by the body presence sensor, which detects whether the watch is being worn so the app can stop alerting and clear heart rate history when it is taken off. No activity or exercise records are read. |
| `run_background` | Keeps heart rate monitoring and threshold alerts running while the screen is off. Pacing alerts are useless if they stop the moment the display sleeps. |

No data collected under any of these permissions leaves the device.

---

## Screenshots

**Required format:** PNG, exactly **336×336** pixels (both Versa 3 and Sense use this resolution).
Minimum 1, maximum 5 per device. The image size must match the device resolution exactly or the
upload is rejected.

Capture these five from the Fitbit OS Simulator or a real device:

1. **Main view, below AT** — heart rate in the blue or green zone, with RHR and AT visible at the
   bottom. This is the "everything is fine" state and makes the best first screenshot.
2. **Main view, above AT** — heart rate in the red zone with the rising trend arrow (`^`) showing.
   Demonstrates the core alerting behaviour.
3. **Mute active** — the `MUTE 5m` indicator visible inside the zone panel.
4. **AT Stats page** — scrolled to section 2, showing time above AT, the recovery timer, and the
   daily budget bar partly filled.
5. **Settings** — the settings screen in the Fitbit phone app, showing the AT formula options.

Tip: the Simulator lets you drive heart rate directly, which is the practical way to get shots
2 and 3 without exerting yourself.
