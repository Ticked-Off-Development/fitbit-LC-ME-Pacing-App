import clock from 'clock';
import { updateClock } from './clock';

import * as deviceSettings from './device-settings';
import * as battery from './battery';
import * as hrm from './hrm';

clock.granularity = 'minutes';
// clock.granularity = 'seconds';
clock.addEventListener('tick', (evt) => {
  // Set the date label
  const currentDate = evt.date;
  updateClock(currentDate);
});

/* -------- SETTINGS -------- */
function settingsCallback(data) {
  if (!data) {
    return;
  }
  console.log('data.colorMode: ' + data.colorMode);
  if (data.colorMode != null) {
    const useSolid = data.colorMode;
    hrm.setColorMode(data.colorMode);
    if (useSolid) {
      // Use gradient colors
      console.log('useSolid');
    } else {
      // Use solid color
      console.log('use gradient color');
    }
  }
  if (data.alertInterval !== undefined) {
    console.log('alertInterval changed');
    hrm.setAlertInterval(data.alertInterval);
    console.log('alertInterval: ' + data.alertInterval);
  }

  if (data.atFormula !== undefined) {
    console.log('atFormula changed' + JSON.stringify(data.atFormula));
    const userATFormula = data.atFormula.values[0].value;
    hrm.setATFormula(userATFormula);
    if (userATFormula === 'custom' && data.customAT) {
      console.log('hello customAT: ' + data.customAT.name);
      if (data.customAT.name > 0) {
        console.log('hello set custom AT');
        hrm.setCustomAT(data.customAT.name);
      }
    }
  }

  if (data.alertType !== undefined) {
    console.log('alert type changed');
    const userAlertType = data.alertType.values[0].value;
    console.log('userAlertType: ' + userAlertType);
    hrm.setAlertType(userAlertType);
  }
}

deviceSettings.initialize(settingsCallback);

battery.initialize();
