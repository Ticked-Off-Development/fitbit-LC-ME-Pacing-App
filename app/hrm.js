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

const heartRateSensor = new HeartRateSensor();
if (appbit.permissions.granted('access_heart_rate')) {
  if (HeartRateSensor) {
    heartRateSensor.addEventListener('reading', () => {
      UI_HEART_RATE_LABEL.text = `${heartRateSensor.heartRate}`;
      updateHeartRateZone(heartRateSensor.heartRate);

      const rhr = user.restingHeartRate;
      const at = rhr + 15;
      UI_RHR_VALUE.text = `${rhr}`;
      UI_AT_VALUE.text = `${at}`;

      if (heartRateSensor.heartRate > at) {
        if (!lastVibration || (Date.now() - lastVibration) / 1000 > alertInterval) {
          console.log('alert user');
          vibration.start('nudge');
          lastVibration = Date.now();
        }
        console.log('heart rate exceeds AT');
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

  if (!useSolid) {
    UI_HEART_ZONE_RECT.gradient.colors.c1 = zoneColors[0];
    UI_HEART_ZONE_RECT.gradient.colors.c2 = zoneColors[1];
  } else {
    UI_HEART_ZONE_RECT.gradient.colors.c1 = zoneColors[0];
    UI_HEART_ZONE_RECT.gradient.colors.c2 = zoneColors[0];
  }
}

export function setColorMode(userColorMode) {
  useSolid = userColorMode;
}

export function setAlertInterval(userAlertInterval) {
  alertInterval = userAlertInterval;
}
