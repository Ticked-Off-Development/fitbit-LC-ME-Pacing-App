import * as messaging from 'messaging';
import { settingsStorage } from 'settings';
import { me as companion } from 'companion';

const KEY_COLOR_MODE = 'colorMode';
const KEY_ALERT_INTERVAL = 'alertInterval';
const KEY_ALERT_TYPE = 'alertType';
const KEY_AT_FORMULA = 'atFormula';
const KEY_CUSTOM_AT = 'customAT';

// Initialize
export function initialize() {
  settingsStorage.addEventListener('change', evt => {
    // Which setting changed
    console.log(`key: ${evt.key}`);

    // What was the old value
    console.log(`old value: ${evt.oldValue}`);

    // What is the new value
    console.log(`new value: ${evt.newValue}`);

    // Send if value is different
    if (evt.oldValue !== evt.newValue) {
      sendValue(evt.key, evt.newValue);
    }
  });
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

// Settings were changed while the companion was not running
if (companion.launchReasons.settingsChanged) {
  // Send the value of the setting
  sendValue(KEY_COLOR_MODE, settingsStorage.getItem(KEY_COLOR_MODE));
  sendValue(KEY_ALERT_INTERVAL, settingsStorage.getItem(KEY_ALERT_INTERVAL));
  sendValue(KEY_AT_FORMULA, settingsStorage.getItem(KEY_AT_FORMULA));
  sendValue(KEY_CUSTOM_AT, settingsStorage.getItem(KEY_CUSTOM_AT));
  sendValue(KEY_ALERT_TYPE, settingsStorage.getItem(KEY_ALERT_TYPE));
}
