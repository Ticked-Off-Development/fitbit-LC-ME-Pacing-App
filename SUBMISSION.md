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

Tracked against the [Fitbit publishing checklist](https://dev.fitbit.com/static/publishing-checklist.pdf)
(a sample checklist to tailor, not a formal requirements document — its payment-system sections
don't apply to a free app). Repository issue #31 covers this work.

**Legal**
- [x] Rights to all content — battery icons are BSD-3-Clause, notice reproduced in
      [NOTICE.md](./NOTICE.md)
- [ ] Confirm the battery icons really are derived from Circles (see the open item in NOTICE.md)
- [ ] Log in to [gam.fitbit.com](https://gam.fitbit.com/) and accept the
      [Platform Terms of Service](https://dev.fitbit.com/legal/platform-terms-of-service/) and the
      [App Distribution Agreement](https://dev.fitbit.com/legal/app-distribution-agreement/)
- [ ] Confirm the App Gallery is still accepting new submissions

**Code check**
- [x] No `//TODO` or other comment tags left in `app/`, `companion/`, `settings/`, `common/`
- [x] Console output removed — all logging goes through `common/log.js`, gated off for release
- [ ] `common/log.js` still has `DEBUG = false` (committed that way; verify it wasn't flipped
      during development)
- [ ] Remaining open GitHub issues triaged — decide which ship in 1.0.0 and which wait
- [x] `TODO.md` entries reviewed

**package.json**
- [x] `name` and `appDisplayName` checked
- [x] Version set for this release (1.0.0)
- [x] `appType` correct (`app`, not `clockface`)
- [x] `buildTargets` set — `atlas` and `vulcan`
- [x] Permissions set — all four are used; see the justification table below
- [x] 80x80 `icon.png` present in `/resources`

**Always-On Display** — not applicable. The app implements no AOD mode and does not request
`access_aod`. Worth revisiting later: a pacing app is a plausible AOD candidate, but adding it
brings pixel-budget rules and a whole matrix of AOD/non-AOD test combinations.

**Final tests** (from the checklist — these need hardware, not just the Simulator)
- [ ] Fresh install
- [ ] Upgrade path — not applicable for a first release, no prior version to migrate from
- [ ] Behaviour when permissions are **not** granted (`app/hrm.js:50` handles the heart-rate case)
- [ ] Behaviour with stale or missing sensor data — no resting HR or age on the profile should
      fall back to the default AT, not break
- [ ] Wear it for a day or two in real conditions — the checklist calls this out specifically, and
      it's the only way to catch battery drain from `run_background`
- [ ] `npm run lint` and `npm test` clean
- [ ] `npx fitbit-build` succeeds for both build targets

**Assets and hosting**
- [ ] Screenshots captured (see below)
- [ ] Privacy policy hosted at a public URL, and placeholders filled

**After submission**
- [ ] Archive a backup of this version (excluding `node_modules`)
- [ ] On approval: update the GAM description and screenshots, then publish

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

> **983 characters.** The GAM description field caps at 1000, so keep any edit under that — count
> before pasting. Covers the points the checklist asks for: features, controls, settings,
> limitations, cost, and search keywords.

```
Pace by your Anaerobic Threshold (AT) — the heart rate above which activity is more likely to trigger post-exertional malaise.

Your watch shows live heart rate in a colour-coded zone alongside your resting HR and your AT, and vibrates when you cross the threshold so you know to stop, rest and pace.

SET YOUR AT
WorkWell Foundation guideline (resting HR + 15), 50/55/60% of max HR, or your own value from 40-220 BPM.

ALERTS
Repeat every 0-300 seconds, or a single buzz on crossing. Eight haptic patterns. Press the back button to mute.

TRACK YOUR DAY
A trend arrow warns you before you cross AT. See time above AT, a recovery timer, and a daily exertion budget.

Free, no ads. Your data stays on your watch: no network requests, no analytics.

LIMITATIONS
Some AT formulas need resting HR or age from your Fitbit profile. Optical heart rate readings are estimates and lag sudden changes.

Not a medical device. Does not diagnose, treat or prevent disease. Consult your clinician.
```

### Tags

Keep these accurate and few — the checklist warns against overusing or misusing tags, and
irrelevant ones are a rejection risk.

Suggested: `pacing`, `heart rate`, `long covid`, `ME/CFS`, `health`, `chronic illness`

### Cost

Free. No payment system, no trial, no in-app purchases — so the trial/payment fields in GAM stay
empty and no reviewer promo code is needed.

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

## Notes for reviewers

Paste this into the "notes for reviewers" field at upload. Testing a heart-rate threshold app is
not obvious, so the how-to-test section matters here.

```
CHANGES IN THIS VERSION
First submission. No previous version exists, so there is no upgrade or data migration path.

WHAT IT DOES
Alerts people with Long Covid or ME/CFS when their heart rate crosses their anaerobic
threshold (AT), so they can rest before triggering post-exertional malaise.

HOW TO TEST
The quickest path is the Fitbit OS Simulator, where heart rate can be set directly:
1. Launch the app. The main view shows heart rate, resting HR and AT.
2. Set heart rate below AT — the zone panel is blue or green.
3. Raise heart rate above AT — the panel turns red and the watch vibrates. The repeat
   interval is configurable in settings (default 30s).
4. Press the back button once — alerts mute for 5 minutes and a "MUTE 5m" indicator appears
   in the zone panel. Press the back button twice quickly to exit the app.
5. Scroll down to reach the AT Stats page: time above AT, recovery timer, daily budget bar.
6. Settings are in the Fitbit phone app: AT formula, alert interval, haptic type, mute
   duration, daily budget, and solid vs gradient zone colours.

Note that the default AT formula (WorkWell: resting HR + 15) reads resting heart rate from
the Fitbit profile. On a test account with no resting HR recorded, the app falls back to a
safe default of 100 BPM rather than failing — this is intended behaviour. The same applies to
the max-HR formulas when no age is set.

BATTERY USE
The app sets appTimeoutEnabled = false and requests run_background so heart rate alerts keep
working while the screen is off. This is essential to the app's purpose: a pacing alert that
stops when the display sleeps is useless. There is no always-on display mode, no animation,
and no network activity, so background cost is limited to the heart rate sensor.

PRIVACY
The app makes no network requests of any kind. No servers, analytics, or third-party SDKs.
All data stays in device storage. Privacy policy: <PRIVACY_POLICY_URL>

THIRD-PARTY CONTENT
Battery icons are derived from github.com/cgguardian/circles, BSD-3-Clause, © 2021 Chris
Merpaw. The licence notice is reproduced in NOTICE.md in the source repository.
```

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
