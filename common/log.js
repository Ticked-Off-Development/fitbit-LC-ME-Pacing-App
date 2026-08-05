/*
  Debug logging, silent in release builds.

  Fitbit's review process expects a published build to be free of console
  noise, and some of these messages carried user settings and heart rate
  configuration into the device log. Set DEBUG to true while developing to
  get the messages back; leave it false for anything submitted to the
  App Gallery.

  Shared by app/ and companion/ — both bundles resolve it by relative path.
*/
const DEBUG = false;

export function debug(message) {
  if (DEBUG) {
    console.log(message);
  }
}

export function warn(message) {
  if (DEBUG) {
    console.warn(message);
  }
}
