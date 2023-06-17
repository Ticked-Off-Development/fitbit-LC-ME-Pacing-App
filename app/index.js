import { HeartRateSensor } from 'heart-rate';
import { BodyPresenceSensor } from 'body-presence';
import { me as appbit } from 'appbit';
import { user } from 'user-profile';
import { vibration } from 'haptics';
import document from 'document';
import clock from 'clock';
import { updateClock } from './clock';

import * as deviceSettings from './device-settings';
import * as battery from './battery';

const heartRateLabel = document.getElementById('heartRateLabel');
const rhrValue = document.getElementById('rhrValue');
const atValue = document.getElementById('atValue');

const UI_HEART_ZONE_RECT = document.getElementById('gradientRectangleHeart');
let useSolid = false; // default colorMode
let alertInterval = 0; // default interval
let lastVibration = 0;

clock.granularity = 'minutes';
// clock.granularity = 'seconds';
clock.addEventListener('tick', (evt) => {
  // Set the date label
  const currentDate = evt.date;
  updateClock(currentDate);
});

const heartRateSensor = new HeartRateSensor();
if (appbit.permissions.granted('access_heart_rate')) {
  if (HeartRateSensor) {
    heartRateSensor.addEventListener('reading', () => {
      heartRateLabel.text = `${heartRateSensor.heartRate}`;
      updateHeartRateZone(heartRateSensor.heartRate);

      const rhr = user.restingHeartRate;
      const at = rhr + 15;
      rhrValue.text = `${rhr}`;
      atValue.text = `${at}`;

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
    heartRateLabel.text = '--';
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
      heartRateLabel.text = '--';
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
    zoneColors = ['#B3B3B3', '#808080'];
  } else if (heartRate < rhr + 6) {
    zoneColors = ['#99ccff', '#0033cc'];
  } else if (heartRate < rhr + 11) {
    zoneColors = ['#99ff99', '#009933'];
  } else if (heartRate < rhr + 16) {
    zoneColors = ['#ffff99', '#ffcc00'];
  } else if (heartRate < rhr + 21) {
    zoneColors = ['#ff9933', '#cc3300'];
  } else {
    zoneColors = ['#ff5050', '#990000'];
  }

  if (!useSolid) {
    UI_HEART_ZONE_RECT.gradient.colors.c1 = zoneColors[0];
    UI_HEART_ZONE_RECT.gradient.colors.c2 = zoneColors[1];
  } else {
    UI_HEART_ZONE_RECT.gradient.colors.c1 = zoneColors[0];
    UI_HEART_ZONE_RECT.gradient.colors.c2 = zoneColors[0];
  }
}

/* -------- SETTINGS -------- */
function settingsCallback(data) {
  if (!data) {
    return;
  }
  console.log('data.colorMode: ' + data.colorMode);
  if (data.colorMode != null) {
    useSolid = data.colorMode;
    if (useSolid) {
      // Use gradient colors
      console.log('useSolid');
      updateHeartRateZone(heartRateSensor.heartRate);
    } else {
      // Use solid color
      console.log('use gradient color');
      updateHeartRateZone(heartRateSensor.heartRate);
    }
  }
  if (data.alertInterval !== undefined) {
    console.log('alertInterval changed');
    alertInterval = data.alertInterval;
    console.log('alertInterval: ' + alertInterval);
  }
}

deviceSettings.initialize(settingsCallback);

battery.initialize();
