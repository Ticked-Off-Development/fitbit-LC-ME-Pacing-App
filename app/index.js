import { HeartRateSensor } from 'heart-rate';
import { me as appbit } from 'appbit';
import { user } from 'user-profile';
import { vibration } from 'haptics';
import document from 'document';
import { display } from 'display';
import { today } from 'user-activity';
import clock from 'clock';

const heartRateLabel = document.getElementById('heartRateLabel');
const dateLabel = document.getElementById('dateLabel');
const timeLabel = document.getElementById('timeLabel');
const rhrLabel = document.getElementById('rhrLabel');
const atLabel = document.getElementById('atLabel');

const middleRowBackground = document.getElementById('middleRowBackground');
const gradientRectangleHeart = document.getElementById("gradientRectangleHeart");

clock.granularity = 'minutes';
// clock.granularity = 'seconds';
clock.addEventListener('tick', (evt) => {
  // Set the date label
  let currentDate = evt.date;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = days[currentDate.getDay()];
  // Display formatted date as Mon 5/8/23
  const twoDigitYear = String(currentDate.getFullYear()).slice(-2);
  const formattedDate = `${dayOfWeek} ${currentDate.getMonth() + 1}/${currentDate.getDate()}/${twoDigitYear}`;
  dateLabel.text = formattedDate;
  // Set the time label with format hh:mm AM/PM
  const hours = currentDate.getHours();
  const minutes = padWithZero(currentDate.getMinutes(), 2);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  timeLabel.text = `${hours12}:${minutes} ${ampm}`;
});

if (appbit.permissions.granted('access_heart_rate')) {
  if (HeartRateSensor) {
    const heartRateSensor = new HeartRateSensor();
    heartRateSensor.addEventListener('reading', () => {
      heartRateLabel.text = `${heartRateSensor.heartRate} BPM`;
      updateHeartRateZone(heartRateSensor.heartRate);
      
      let rhr = user.restingHeartRate;
      let at = rhr + 15;
      rhrLabel.text = `RHR: ${rhr}`;
      atLabel.text = `AT: ${at}`;

      if (heartRateSensor.heartRate > at) {
        vibration.start('alert');
      }
    });
    heartRateSensor.start();
  } else {
    console.log('Heart Rate Sensor is not available');
  }
} else {
  console.log('Permission to access heart rate data is not granted');
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

function padWithZero(number, length) {
  let str = String(number);
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}
  

  
  
  
