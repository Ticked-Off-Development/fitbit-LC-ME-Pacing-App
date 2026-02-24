/**
 * Responsible for updating the battery on the UI
 */
import document from 'document';
import { battery, charger } from 'power';

const UI_BATTERY_VALUE = document.getElementById('batteryValue');
const UI_BATTERY_BAR = document.getElementById('batteryBar');
const UI_BATTERY_IMG = document.getElementById('batteryIcon');
const UI_BATTERY_CHARGING = document.getElementById('batteryCharging');
const UI_MAX_BATTERY_BAR = 26;

// Initialize by setting onchange function for battery & charger
export function initialize() {
  updateBattery();
  battery.onchange = updateBattery;
  charger.onchange = updateCharger;
}

// updateBattery
function updateBattery() {
  console.log('updateBattery');
  const batteryPercent = battery.chargeLevel / 100;

  // Set bar width based on current battery percent
  UI_BATTERY_BAR.width = UI_MAX_BATTERY_BAR * batteryPercent;

  // Set battery bar style and image reference based on battery charge level
  if (battery.chargeLevel > 10) {
    UI_BATTERY_BAR.style.fill = 'white';
    UI_BATTERY_IMG.href = 'images/battery_icon_empty.png';
    UI_BATTERY_VALUE.style.fill = '#aaaaaa';
    UI_BATTERY_CHARGING.href = 'images/charging_icon_white.png';
  } else if (battery.chargeLevel >= 0) {
    UI_BATTERY_BAR.style.fill = '#e74c3c';
    UI_BATTERY_IMG.href = 'images/battery_icon_empty_red.png';
    UI_BATTERY_VALUE.style.fill = '#e74c3c';
    UI_BATTERY_CHARGING.href = 'images/charging_icon_red.png';
  }

  UI_BATTERY_VALUE.text = (Math.floor(battery.chargeLevel) + '%');
  updateCharger();
}

function updateCharger() {
  console.log('updateCharger');
  if (battery.charging || charger.connected) {
    UI_BATTERY_CHARGING.style.display = 'inline';
  } else {
    UI_BATTERY_CHARGING.style.display = 'none';
  }
}
