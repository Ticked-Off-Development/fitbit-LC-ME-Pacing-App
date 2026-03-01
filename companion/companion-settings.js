import * as messaging from 'messaging';
import { settingsStorage } from 'settings';

const KEY_COLOR_MODE = 'colorMode';
const KEY_ALERT_INTERVAL = 'alertInterval';
const KEY_ALERT_TYPE = 'alertType';
const KEY_AT_FORMULA = 'atFormula';
const KEY_CUSTOM_AT = 'customAT';
const KEY_MUTE_DURATION = 'muteDuration';
const KEY_DAILY_BUDGET = 'dailyBudget';

// Initialize
export function initialize() {
  settingsStorage.addEventListener('change', evt => {
    if (evt.oldValue !== evt.newValue) {
      sendValue(evt.key, evt.newValue);
    }
  });

  // Sync all settings when the device connects. This covers the case
  // where settings were changed while the watch app was not running and
  // the stale CBOR file on the device has outdated values.
  messaging.peerSocket.addEventListener('open', sendAllSettings);

  // If already connected, sync now
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    sendAllSettings();
  }
}

function sendValue(key, val) {
  if (val) {
    try {
      sendSettingData({
        key,
        value: JSON.parse(val)
      });
    } catch (ex) {
      console.log('Failed to parse setting value for ' + key + ': ' + ex);
    }
  }
}

function sendSettingData(data) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log('No peerSocket connection');
  }
}

function sendAllSettings() {
  sendValue(KEY_COLOR_MODE, settingsStorage.getItem(KEY_COLOR_MODE));
  sendValue(KEY_ALERT_INTERVAL, settingsStorage.getItem(KEY_ALERT_INTERVAL));
  sendValue(KEY_AT_FORMULA, settingsStorage.getItem(KEY_AT_FORMULA));
  sendValue(KEY_CUSTOM_AT, settingsStorage.getItem(KEY_CUSTOM_AT));
  sendValue(KEY_ALERT_TYPE, settingsStorage.getItem(KEY_ALERT_TYPE));
  sendValue(KEY_MUTE_DURATION, settingsStorage.getItem(KEY_MUTE_DURATION));
  sendValue(KEY_DAILY_BUDGET, settingsStorage.getItem(KEY_DAILY_BUDGET));
}
