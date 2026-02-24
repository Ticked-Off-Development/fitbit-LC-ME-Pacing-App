import clock from 'clock';
import { updateClock } from './clock';
import document from 'document';

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

  // Process customAT before atFormula so the value is ready when
  // setATFormula triggers refreshATDisplay/calculateAT
  if (data.customAT != null) {
    let customValue;
    if (typeof data.customAT === 'number') {
      customValue = data.customAT;
    } else if (data.customAT && data.customAT.name) {
      customValue = Number(data.customAT.name);
    }
    if (isFinite(customValue) && customValue > 0) {
      hrm.setCustomAT(customValue);
    }
  }

  if (data.atFormula !== undefined) {
    console.log('atFormula changed' + JSON.stringify(data.atFormula));
    if (data.atFormula && data.atFormula.values && data.atFormula.values[0]) {
      const userATFormula = data.atFormula.values[0].value;
      hrm.setATFormula(userATFormula);
    } else {
      console.log('Malformed atFormula setting: ' + JSON.stringify(data.atFormula));
    }
  }

  if (data.muteDuration !== undefined) {
    hrm.setMuteDuration(data.muteDuration);
  }

  if (data.alertType !== undefined) {
    console.log('alert type changed');
    if (data.alertType && data.alertType.values && data.alertType.values[0]) {
      const userAlertType = data.alertType.values[0].value;
      console.log('userAlertType: ' + userAlertType);
      hrm.setAlertType(userAlertType);
    } else {
      console.log('Malformed alertType setting: ' + JSON.stringify(data.alertType));
    }
  }
}

deviceSettings.initialize(settingsCallback);

battery.initialize();

/* -------- MUTE BUTTON -------- */
// Press the physical back button to mute/snooze vibration alerts for 5 minutes
document.addEventListener('keypress', (evt) => {
  if (evt.key === 'back') {
    evt.preventDefault();
    hrm.muteAlerts();
  }
});
