/*
  Responsible for loading, applying and saving settings.
  Requires companion/companion-settings.js
  Callback used to update your UI.
*/
import { me } from 'appbit';
import * as fs from 'fs';
import * as messaging from 'messaging';

const SETTINGS_TYPE = 'cbor';
const SETTINGS_FILE = 'settings.cbor';

let settings = {};
let onsettingschange;

/* Initialize device settings */
export function initialize(callback) {
  settings = loadSettings();
  console.log('loaded Settings: ' + JSON.stringify(settings));
  onsettingschange = callback;
  onsettingschange(settings);
}

// Received message containing settings data
messaging.peerSocket.addEventListener('message', function (evt) {
  if (!evt || !evt.data || !evt.data.key) {
    console.log('Received malformed settings message');
    return;
  }
  if (settings === undefined) {
    settings = {};
  }
  settings[evt.data.key] = evt.data.value;
  if (typeof onsettingschange === 'function') {
    onsettingschange(settings);
  }
});

// Register for the unload event
me.addEventListener('unload', saveSettings);

// Load settings from filesystem
function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    // Return default settings
    return {
      alertInterval: 0,
      alertType: { values: [{ name: 'Nudge', value: 'nudge' }] },
      atFormula: { values: [{ name: 'Workwell RHR + 15', value: 'workwell' }] },
      colorMode: false,
      customAT: { name: '100' }
    };
  }
}

// Save settings to the filesystem
function saveSettings() {
  try {
    fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
  } catch (ex) {
    console.log('Failed to save settings: ' + ex);
  }
}
