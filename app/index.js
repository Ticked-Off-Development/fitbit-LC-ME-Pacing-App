import { HeartRateSensor } from 'heart-rate';
import { BodyPresenceSensor } from 'body-presence';
import { me as appbit } from 'appbit';
import { user } from 'user-profile';
import { vibration } from 'haptics';
import document from 'document';
import clock from 'clock';
import { updateClock } from './clock';

import * as deviceSettings from './device-settings';

const heartRateLabel = document.getElementById('heartRateLabel');
const rhrValue = document.getElementById('rhrValue');
const atValue = document.getElementById('atValue');

const UI_HEART_ZONE_RECT = document.getElementById('gradientRectangleHeart');
let useSolid = false;

clock.granularity = 'minutes';
// clock.granularity = 'seconds';
clock.addEventListener('tick', (evt) => {
  // Set the date label
  const currentDate = evt.date;
  updateClock(currentDate);
})

const heartRateSensor = new HeartRateSensor()
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
        vibration.start('alert');
      }
    })
    heartRateSensor.start();
  } else {
    console.log('Heart Rate Sensor is not available');
    heartRateLabel.text = '--';
  }
} else {
  console.log('Permission to access heart rate data is not granted');
}

if (BodyPresenceSensor) {
  const body = new BodyPresenceSensor()
  body.addEventListener('reading', () => {
    if (!body.present) {
      heartRateSensor.stop();
      heartRateLabel.text = '--';
    } else {
      heartRateSensor.start();
    }
  })
  body.start();
}

function updateHeartRateZone (heartRate) {
  const rhr = user.restingHeartRate;
  let zoneColors;

  if (heartRate < rhr + 6) {
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

  console.log('useSolid ' + useSolid);
  if (!useSolid) {
    console.log('settings gradient colors');
    UI_HEART_ZONE_RECT.gradient.colors.c1 = zoneColors[0];
    UI_HEART_ZONE_RECT.gradient.colors.c2 = zoneColors[1];
  } else {
    console.log('setting solid colors');
    UI_HEART_ZONE_RECT.gradient.colors.c1 = zoneColors[0];
    UI_HEART_ZONE_RECT.gradient.colors.c2 = zoneColors[0];
  }
}

/* -------- SETTINGS -------- */
function settingsCallback (data) {
  if (!data) {
    return;
  }
  console.log('data.colorMode: ' + data.colorMode);
  if (data.colorMode) {
    useSolid = data.colorMode;
    if (useSolid) {
      // Use gradient colors
      // UI_HEART_ZONE_RECT.gradient = gradient;
      console.log('useSolid');
      updateHeartRateZone(heartRateSensor.heartRate);
    } else {
      // Use solid color
      // UI_HEART_ZONE_RECT.gradient = solidColor;
      console.log('use gradient color');
      updateHeartRateZone(heartRateSensor.heartRate);
    }
  }
}

deviceSettings.initialize(settingsCallback);
