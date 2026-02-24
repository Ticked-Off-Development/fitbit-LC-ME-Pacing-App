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

const ZONE_GRAY = ['#B3B3B3', '#808080'];
const ZONE_BLUE = ['#99ccff', '#0033cc'];
const ZONE_GREEN = ['#99ff99', '#009933'];
const ZONE_YELLOW = ['#ffff99', '#ffcc00'];
const ZONE_ORANGE = ['#ff9933', '#cc3300'];
const ZONE_RED = ['#ff5050', '#990000'];

let useSolid = false; // default colorMode
let alertInterval = 0; // default interval
let lastVibration = 0;
let atFormula = 'workwell';
let customAT = 100;
let alertType = 'nudge';

const VALID_AT_FORMULAS = ['workwell', 'maxHR50', 'maxHR55', 'maxHR60', 'custom'];
const DEFAULT_AT = 100;
const MIN_AT = 40;
const MAX_AT = 220;

const heartRateSensor = new HeartRateSensor();
appbit.appTimeoutEnabled = false;
if (appbit.permissions.granted('access_heart_rate')) {
  if (HeartRateSensor) {
    heartRateSensor.addEventListener('reading', () => {
      UI_HEART_RATE_LABEL.text = `${heartRateSensor.heartRate}`;
      updateHeartRateZone(heartRateSensor.heartRate);

      const rhr = user.restingHeartRate;
      const at = calculateAT();
      UI_RHR_VALUE.text = typeof rhr === 'number' && isFinite(rhr) ? `${rhr}` : '--';
      UI_AT_VALUE.text = `${at}`;

      if (heartRateSensor.heartRate > at) {
        if (!lastVibration || (Date.now() - lastVibration) / 1000 > alertInterval) {
          vibration.start(alertType);
          lastVibration = Date.now();
        }
      } else {
        vibration.stop();
      }
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

export function setColorMode(userColorMode) {
  useSolid = userColorMode;
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
}

export function setCustomAT(userAT) {
  const value = Number(userAT);
  if (!isFinite(value) || value < MIN_AT || value > MAX_AT) {
    console.log('Invalid custom AT value: ' + userAT + ', keeping current: ' + customAT);
    return;
  }
  customAT = value;
}

const VALID_ALERT_TYPES = ['alert', 'bump', 'confirmation', 'confirmation-max', 'nudge', 'nudge-max', 'ping', 'ring'];

export function setAlertType(userAlertType) {
  if (VALID_ALERT_TYPES.indexOf(userAlertType) === -1) {
    console.log('Invalid alert type: ' + userAlertType + ', keeping current: ' + alertType);
    return;
  }
  alertType = userAlertType;
}
