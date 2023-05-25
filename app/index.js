import { HeartRateSensor } from 'heart-rate';
import { BodyPresenceSensor } from "body-presence";
import { me as appbit } from 'appbit';
import { user } from 'user-profile';
import { vibration } from 'haptics';
import document from 'document';
import clock from 'clock';
import { updateClock } from './clock';

const heartRateLabel = document.getElementById('heartRateLabel');
const rhrValue = document.getElementById('rhrValue');
const atValue = document.getElementById('atValue');

const gradientRectangleHeart = document.getElementById("gradientRectangleHeart");

clock.granularity = 'minutes';
// clock.granularity = 'seconds';
clock.addEventListener('tick', (evt) => {
  // Set the date label
  let currentDate = evt.date;
  updateClock(currentDate);
});

const heartRateSensor = new HeartRateSensor();
if (appbit.permissions.granted('access_heart_rate')) {
  if (HeartRateSensor) {
    heartRateSensor.addEventListener('reading', () => {
      heartRateLabel.text = `${heartRateSensor.heartRate}`;
      updateHeartRateZone(heartRateSensor.heartRate);

      let rhr = user.restingHeartRate;
      let at = rhr + 15;
      rhrValue.text = `${rhr}`;
      atValue.text = `${at}`;

      if (heartRateSensor.heartRate > at) {
        vibration.start('alert');
      }
    });
    heartRateSensor.start();
  } else {
    console.log('Heart Rate Sensor is not available');
    heartRateLabel.text = "--";
  }
} else {
  console.log('Permission to access heart rate data is not granted');
}

if (BodyPresenceSensor) {
  const body = new BodyPresenceSensor();
  body.addEventListener("reading", () => {
    if (!body.present) {
      heartRateSensor.stop();
      heartRateLabel.text = "--";
    } else {
      heartRateSensor.start();
    }
  });
  body.start();
}


function updateHeartRateZone(heartRate) {
  let rhr = user.restingHeartRate;
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

  gradientRectangleHeart.gradient.colors.c1 = zoneColors[0];
  gradientRectangleHeart.gradient.colors.c2 = zoneColors[1];
}
