import { HeartRateSensor } from 'heart-rate';
import { BodyPresenceSensor } from 'body-presence';
import { me as appbit } from 'appbit';
import { user } from 'user-profile';
import { vibration } from 'haptics';
import document from 'document';

const UI_HEART_RATE_LABEL = document.getElementById('heartRateLabel');
const UI_RHR_VALUE = document.getElementById('rhrValue');
const UI_AT_VALUE = document.getElementById('atValue');
const UI_HEART_ZONE_RECT = document.getElementById('gradientRectangleHeart');
const UI_MUTE_INDICATOR = document.getElementById('muteIndicator');
const UI_TREND_INDICATOR = document.getElementById('trendIndicator');

const ZONE_GRAY = ['#b0b0b0', '#808080'];
const ZONE_BLUE = ['#90caf9', '#42a5f5'];
const ZONE_GREEN = ['#a5d6a7', '#66bb6a'];
const ZONE_YELLOW = ['#fff59d', '#ffee58'];
const ZONE_ORANGE = ['#ffcc80', '#ffa726'];
const ZONE_RED = ['#ef9a9a', '#ef5350'];

let muteDurationMs = 5 * 60 * 1000; // 5 minutes in milliseconds (configurable)

let useSolid = false; // default colorMode
let alertInterval = 0; // default interval
let lastVibration = 0;
let atFormula = 'workwell';
let customAT = 100;
let alertType = 'nudge';
let lastHeartRate = '--';
let muteUntil = 0;
let muteTimer = null;

const VALID_AT_FORMULAS = ['workwell', 'maxHR50', 'maxHR55', 'maxHR60', 'custom'];
const DEFAULT_AT = 100;
const MIN_AT = 40;
const MAX_AT = 220;

// HR Trend Indicator
const HR_HISTORY_SIZE = 10;
const TREND_THRESHOLD = 2; // BPM difference between halves to trigger rising/falling
const hrHistory = [];
const TREND_RISING = 'rising';
const TREND_FALLING = 'falling';
const TREND_STABLE = 'stable';

const heartRateSensor = new HeartRateSensor();
appbit.appTimeoutEnabled = false;
if (appbit.permissions.granted('access_heart_rate')) {
  if (HeartRateSensor) {
    heartRateSensor.addEventListener('reading', () => {
      lastHeartRate = heartRateSensor.heartRate;
      UI_HEART_RATE_LABEL.text = `${lastHeartRate}`;
      updateHeartRateZone(lastHeartRate);
      addToHrHistory(lastHeartRate);
      updateTrendIndicator();

      const rhr = user.restingHeartRate;
      const at = calculateAT();
      UI_RHR_VALUE.text = typeof rhr === 'number' && isFinite(rhr) ? `${rhr}` : '--';
      UI_AT_VALUE.text = `${at}`;

      if (heartRateSensor.heartRate > at) {
        if (!isMuted() && (!lastVibration || (Date.now() - lastVibration) / 1000 > alertInterval)) {
          vibration.start(alertType);
          lastVibration = Date.now();
        }
      } else {
        vibration.stop();
      }
      updateMuteIndicator();
    });
    heartRateSensor.start();
  } else {
    console.log('Heart Rate Sensor is not available');
    UI_HEART_RATE_LABEL.text = '--';
    updateHeartRateZone('--');
  }
} else {
  console.log('Permission to access heart rate data is not granted');
  updateHeartRateZone('--');
}

if (BodyPresenceSensor) {
  const body = new BodyPresenceSensor();
  body.addEventListener('reading', () => {
    if (!body.present) {
      heartRateSensor.stop();
      UI_HEART_RATE_LABEL.text = '--';
      console.log('body not present');
      updateHeartRateZone('--');
      clearHrHistory();
      updateTrendIndicator();
    } else {
      heartRateSensor.start();
    }
  });
  body.start();
}

function updateHeartRateZone(heartRate) {
  const zoneColors = getZoneColors(heartRate);

  if (!useSolid) {
    UI_HEART_ZONE_RECT.gradient.colors.c1 = zoneColors[0];
    UI_HEART_ZONE_RECT.gradient.colors.c2 = zoneColors[1];
  } else {
    UI_HEART_ZONE_RECT.gradient.colors.c1 = zoneColors[0];
    UI_HEART_ZONE_RECT.gradient.colors.c2 = zoneColors[0];
  }
}

function calculateAT() {
  let at;
  const age = user.age;
  const rhr = user.restingHeartRate;

  if (atFormula === 'custom') {
    at = typeof customAT === 'number' && isFinite(customAT) ? customAT : DEFAULT_AT;
  } else if (atFormula === 'workwell') {
    if (typeof rhr !== 'number' || !isFinite(rhr) || rhr <= 0) {
      console.log('Invalid restingHeartRate for workwell formula, using default AT');
      at = DEFAULT_AT;
    } else {
      at = rhr + 15;
    }
  } else if (atFormula === 'maxHR50' || atFormula === 'maxHR55' || atFormula === 'maxHR60') {
    if (typeof age !== 'number' || !isFinite(age) || age <= 0) {
      console.log('Invalid age for maxHR formula, using default AT');
      at = DEFAULT_AT;
    } else {
      const maxHeartRate = 220 - age;
      const multipliers = { maxHR50: 0.5, maxHR55: 0.55, maxHR60: 0.6 };
      at = Math.floor(maxHeartRate * multipliers[atFormula]);
    }
  } else {
    console.log('Unknown AT formula: ' + atFormula + ', falling back to default');
    at = DEFAULT_AT;
  }

  if (typeof at !== 'number' || !isFinite(at)) {
    at = DEFAULT_AT;
  }
  at = Math.max(MIN_AT, Math.min(MAX_AT, at));

  return at;
}

function safeZoneInterval(rhr, at) {
  if (typeof rhr !== 'number' || !isFinite(rhr) || typeof at !== 'number' || !isFinite(at)) {
    return 0;
  }
  const diff = at - rhr;
  if (diff <= 0) {
    return 0;
  }
  return diff / 4;
}

function getBlueZoneUpperLimit(rhr, at) {
  return rhr + safeZoneInterval(rhr, at);
}

function getGreenZoneUpperLimit(rhr, at) {
  return rhr + (2 * safeZoneInterval(rhr, at));
}

function getYellowZoneUpperLimit(rhr, at) {
  return rhr + (3 * safeZoneInterval(rhr, at));
}

function getOrangeZoneUpperLimit(rhr, at) {
  return rhr + (4 * safeZoneInterval(rhr, at));
}

function getZoneColors(heartRate) {
  if (heartRate === '--' || typeof heartRate !== 'number' || !isFinite(heartRate)) {
    console.log('heartRate not present');
    return ZONE_GRAY;
  }

  const rhr = user.restingHeartRate;
  const at = calculateAT();

  if (typeof rhr !== 'number' || !isFinite(rhr) || rhr <= 0) {
    return heartRate >= at ? ZONE_RED : ZONE_GREEN;
  }

  if (heartRate < getBlueZoneUpperLimit(rhr, at)) {
    return ZONE_BLUE;
  } else if (heartRate < getGreenZoneUpperLimit(rhr, at)) {
    return ZONE_GREEN;
  } else if (heartRate < getYellowZoneUpperLimit(rhr, at)) {
    return ZONE_YELLOW;
  } else if (heartRate < getOrangeZoneUpperLimit(rhr, at)) {
    return ZONE_ORANGE;
  }
  return ZONE_RED;
}

function addToHrHistory(hr) {
  if (typeof hr !== 'number' || !isFinite(hr)) return;
  hrHistory.push(hr);
  if (hrHistory.length > HR_HISTORY_SIZE) {
    hrHistory.shift();
  }
}

function clearHrHistory() {
  hrHistory.length = 0;
}

function calculateTrend() {
  if (hrHistory.length < 6) return TREND_STABLE;

  const halfLen = Math.floor(hrHistory.length / 2);
  let olderSum = 0;
  let newerSum = 0;
  const newerStart = hrHistory.length - halfLen;

  for (let i = 0; i < halfLen; i++) {
    olderSum += hrHistory[i];
    newerSum += hrHistory[newerStart + i];
  }

  const diff = (newerSum / halfLen) - (olderSum / halfLen);

  if (diff > TREND_THRESHOLD) return TREND_RISING;
  if (diff < -TREND_THRESHOLD) return TREND_FALLING;
  return TREND_STABLE;
}

function updateTrendIndicator() {
  if (!UI_TREND_INDICATOR) return;

  const trend = calculateTrend();

  if (trend === TREND_RISING) {
    UI_TREND_INDICATOR.text = String.fromCharCode(0x25B2); // ▲
    UI_TREND_INDICATOR.style.fill = '#ff6b6b';
  } else if (trend === TREND_FALLING) {
    UI_TREND_INDICATOR.text = String.fromCharCode(0x25BC); // ▼
    UI_TREND_INDICATOR.style.fill = '#4ecdc4';
  } else {
    UI_TREND_INDICATOR.text = '-';
    UI_TREND_INDICATOR.style.fill = '#aaaaaa';
  }
}

function refreshATDisplay() {
  const at = calculateAT();
  UI_AT_VALUE.text = `${at}`;
  const rhr = user.restingHeartRate;
  UI_RHR_VALUE.text = typeof rhr === 'number' && isFinite(rhr) ? `${rhr}` : '--';
}

export function setColorMode(userColorMode) {
  useSolid = userColorMode;
  updateHeartRateZone(lastHeartRate);
}

export function setAlertInterval(userAlertInterval) {
  const value = Number(userAlertInterval);
  if (!isFinite(value) || value < 0) {
    console.log('Invalid alert interval: ' + userAlertInterval + ', keeping current: ' + alertInterval);
    return;
  }
  alertInterval = value;
}

export function setATFormula(userATFormula) {
  if (VALID_AT_FORMULAS.indexOf(userATFormula) === -1) {
    console.log('Invalid AT formula: ' + userATFormula + ', keeping current: ' + atFormula);
    return;
  }
  atFormula = userATFormula;
  refreshATDisplay();
  updateHeartRateZone(lastHeartRate);
}

export function setCustomAT(userAT) {
  const value = Number(userAT);
  if (!isFinite(value) || value < MIN_AT || value > MAX_AT) {
    console.log('Invalid custom AT value: ' + userAT + ', keeping current: ' + customAT);
    return;
  }
  customAT = value;
  refreshATDisplay();
  updateHeartRateZone(lastHeartRate);
}

const VALID_ALERT_TYPES = ['alert', 'bump', 'confirmation', 'confirmation-max', 'nudge', 'nudge-max', 'ping', 'ring'];

export function setAlertType(userAlertType) {
  if (VALID_ALERT_TYPES.indexOf(userAlertType) === -1) {
    console.log('Invalid alert type: ' + userAlertType + ', keeping current: ' + alertType);
    return;
  }
  alertType = userAlertType;
}

export function setMuteDuration(minutes) {
  const value = Number(minutes);
  if (!isFinite(value) || value < 1 || value > 60) {
    console.log('Invalid mute duration: ' + minutes);
    return;
  }
  muteDurationMs = value * 60 * 1000;
}

function isMuted() {
  return muteUntil > Date.now();
}

function updateMuteIndicator() {
  if (!UI_MUTE_INDICATOR) return;
  if (isMuted()) {
    const remainingMs = muteUntil - Date.now();
    const remainingMin = Math.ceil(remainingMs / 60000);
    UI_MUTE_INDICATOR.text = `MUTE ${remainingMin}m`;
    UI_MUTE_INDICATOR.style.display = 'inline';
  } else {
    UI_MUTE_INDICATOR.text = '';
    UI_MUTE_INDICATOR.style.display = 'none';
  }
}

export function muteAlerts() {
  muteUntil = Date.now() + muteDurationMs;
  vibration.stop();
  if (muteTimer !== null) {
    clearTimeout(muteTimer);
  }
  muteTimer = setTimeout(() => {
    muteTimer = null;
    updateMuteIndicator();
  }, muteDurationMs);
  updateMuteIndicator();
  console.log('Alerts muted for ' + (muteDurationMs / 60000) + ' minutes');
}
