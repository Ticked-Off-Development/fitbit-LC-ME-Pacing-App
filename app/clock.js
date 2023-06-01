import document from 'document';

const UI_DAY_VALUE = document.getElementById('dayValue');
const UI_DATE_VALUE = document.getElementById('dateValue');
const UI_TIME_VALUE = document.getElementById('timeValue');
const UI_AMPM_VALUE = document.getElementById('ampmValue');

export function updateClock (currentDate) {
  // Set the time label with format hh:mm AM/PM
  let hours = currentDate.getHours();
  const mins = padWithZero(currentDate.getMinutes(), 2);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours || 12;

  UI_TIME_VALUE.text = `${hours}:${mins}`;
  UI_AMPM_VALUE.text = `${ampm}`;

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  UI_DAY_VALUE.text = `${daysOfWeek[currentDate.getDay()]}`;
  // Display formatted date as Mon May 8
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = padWithZero(currentDate.getDate(), 2);
  // currentDate.getDate().toString().padStart(2, '0');
  UI_DATE_VALUE.text = `${months[currentDate.getMonth()]} ${day}`;
}

function padWithZero (number, length) {
  let str = String(number);
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}
