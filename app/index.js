import clock from 'clock';
import { updateClock } from './clock';
import document from 'document';

import * as deviceSettings from './device-settings';
import * as battery from './battery';
import * as hrm from './hrm';
import * as atStats from './at-stats';

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
      // Use solid color
      console.log('colorMode: solid');
    } else {
      // Use gradient colors
      console.log('colorMode: gradient');
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
    // Must match MIN_AT(40) and MAX_AT(220) bounds in hrm.js
    if (isFinite(customValue) && customValue >= 40 && customValue <= 220) {
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

  if (data.dailyBudget !== undefined) {
    atStats.setDailyBudget(data.dailyBudget);
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

atStats.initialize();

/* -------- MUTE BUTTON -------- */
// Single press back button to mute/snooze vibration alerts.
// Double press back button (within 1.5s) to exit the app.
let lastBackPress = 0;
document.addEventListener('keypress', (evt) => {
  if (evt.key === 'back') {
    const now = Date.now();
    if (now - lastBackPress < 1500) {
      // Double press — allow default back action (exit app)
      return;
    }
    evt.preventDefault();
    lastBackPress = now;
    hrm.muteAlerts();
  }
});
