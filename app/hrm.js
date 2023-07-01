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

const heartRateSensor = new HeartRateSensor();
if (appbit.permissions.granted('access_heart_rate')) {
  if (HeartRateSensor) {
    heartRateSensor.addEventListener('reading', () => {
      UI_HEART_RATE_LABEL.text = `${heartRateSensor.heartRate}`;
      updateHeartRateZone(heartRateSensor.heartRate);

      const rhr = user.restingHeartRate;
      const at = calculateAT();
      UI_RHR_VALUE.text = `${rhr}`;
      UI_AT_VALUE.text = `${at}`;

      if (heartRateSensor.heartRate > at) {
        if (!lastVibration || (Date.now() - lastVibration) / 1000 > alertInterval) {
          vibration.start('nudge');
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
  let zoneColors;
  if (atFormula === 'workwell') {
    zoneColors = getWorkwellZoneColors(heartRate);
  } else {
    zoneColors = getMaxHRZoneColors(heartRate);
  }

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
  const maxHeartRate = 220 - user.age;
  switch (atFormula) {
    case 'maxHR50':
      at = Math.floor(maxHeartRate * 0.5);
      break;
    case 'maxHR55':
      at = Math.floor(maxHeartRate * 0.55);
      break;
    case 'maxHR60':
      at = Math.floor(maxHeartRate * 0.6);
      break;
    case 'workwell':
    default:
      at = user.restingHeartRate + 15;
  }

  return at;
}

function getWorkwellZoneColors(heartRate) {
  const rhr = user.restingHeartRate;
  let zoneColors;
  if (heartRate === '--') {
    console.log('heartRate not present');
    zoneColors = ZONE_GRAY;
  } else if (heartRate < rhr + 6) {
    zoneColors = ZONE_BLUE;
  } else if (heartRate < rhr + 11) {
    zoneColors = ZONE_GREEN;
  } else if (heartRate < rhr + 16) {
    zoneColors = ZONE_YELLOW;
  } else if (heartRate < rhr + 21) {
    zoneColors = ZONE_ORANGE;
  } else {
    zoneColors = ZONE_RED;
  }

  return zoneColors;
}

function getMaxHRZoneColors(heartRate) {
  let zoneColors;
  const rhr = user.restingHeartRate;
  const at = calculateAT();
  const rhrATdifference = at - rhr;
  const zoneInterval = rhrATdifference / 4;
  const blueUpper = rhr + zoneInterval;
  const greenUpper = rhr + (2 * zoneInterval);
  const yellowUpper = rhr + (3 * zoneInterval);
  const orangeUpper = rhr + (4 * zoneInterval);

  if (heartRate === '--') {
    console.log('heartRate not present');
    zoneColors = ZONE_GRAY;
  } else if (heartRate < blueUpper) {
    zoneColors = ZONE_BLUE;
  } else if (heartRate < greenUpper) {
    zoneColors = ZONE_GREEN;
  } else if (heartRate < yellowUpper) {
    zoneColors = ZONE_YELLOW;
  } else if (heartRate < orangeUpper) {
    zoneColors = ZONE_ORANGE;
  } else {
    zoneColors = ZONE_RED;
  }

  return zoneColors;
}

export function setColorMode(userColorMode) {
  useSolid = userColorMode;
}

export function setAlertInterval(userAlertInterval) {
  alertInterval = userAlertInterval;
}

export function setATFormula(userATFormula) {
  atFormula = userATFormula;
}
