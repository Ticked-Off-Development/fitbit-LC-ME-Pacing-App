import document from 'document';
import * as fs from 'fs';
import { vibration } from 'haptics';
import { me as appbit } from 'appbit';

// --- UI Element References ---
const UI_TIME_ABOVE_AT = document.getElementById('timeAboveATValue');
const UI_RECOVERY_TIMER = document.getElementById('recoveryTimerValue');
const UI_RECOVERY_STATUS = document.getElementById('recoveryStatusLabel');
const UI_BUDGET_USED = document.getElementById('budgetUsedValue');
const UI_BUDGET_REMAINING = document.getElementById('budgetRemainingValue');
const UI_BUDGET_BAR_FILL = document.getElementById('budgetBarFill');
const UI_BUDGET_WARNING = document.getElementById('budgetWarningLabel');

// --- Constants ---
const DAILY_STATS_FILE = 'daily-stats.cbor';
const DAILY_STATS_TYPE = 'cbor';
const MAX_ELAPSED_SECONDS = 5;
const BAR_MAX_WIDTH_PX = 282; // ~84% of 336px
const BUDGET_WARNING_THRESHOLD = 80;

// --- Session State ---
let sessionAboveATSeconds = 0;
let isAboveAT = false;
let lastReadingTimestamp = 0;

// --- Recovery State ---
const RECOVERY_IDLE = 'idle';
const RECOVERY_RECOVERING = 'recovering';
const RECOVERY_RECOVERED = 'recovered';
let recoveryState = RECOVERY_IDLE;
let recoveryStartTimestamp = 0;
let lastRecoveryDuration = 0;

// --- Daily Budget State ---
let dailyBudgetMinutes = 30;
let dailyAboveATSeconds = 0;
let dailyDate = '';
let budgetWarningFired = false;
let lastDateCheckTimestamp = 0;

// === EXPORTED FUNCTIONS ===

export function initialize() {
  loadDailyStats();
  checkDateRollover();
  updateAllDisplays();
  appbit.addEventListener('unload', saveState);
}

export function onHeartRateReading(hr, at, zoneName) {
  const now = Date.now();

  // Accumulate time above AT
  if (lastReadingTimestamp > 0) {
    let elapsed = (now - lastReadingTimestamp) / 1000;
    elapsed = Math.min(elapsed, MAX_ELAPSED_SECONDS);
    if (isAboveAT) {
      sessionAboveATSeconds += elapsed;
      dailyAboveATSeconds += elapsed;
    }
  }
  lastReadingTimestamp = now;

  // Detect transitions
  const wasAboveAT = isAboveAT;
  isAboveAT = (typeof hr === 'number' && isFinite(hr) && hr > at);

  if (wasAboveAT && !isAboveAT) {
    // Crossed below AT — start recovery
    recoveryState = RECOVERY_RECOVERING;
    recoveryStartTimestamp = now;
  } else if (!wasAboveAT && isAboveAT) {
    // Crossed above AT — cancel recovery
    recoveryState = RECOVERY_IDLE;
    recoveryStartTimestamp = 0;
    lastRecoveryDuration = 0;
  }

  // Check recovery completion
  if (recoveryState === RECOVERY_RECOVERING && (zoneName === 'blue' || zoneName === 'green')) {
    lastRecoveryDuration = (now - recoveryStartTimestamp) / 1000;
    recoveryState = RECOVERY_RECOVERED;
  }

  // Periodic date rollover check (~every 60s)
  if (now - lastDateCheckTimestamp > 60000) {
    checkDateRollover();
    lastDateCheckTimestamp = now;
  }

  // Update displays
  updateTimeAboveATDisplay();
  updateRecoveryDisplay(now);
  updateBudgetDisplay();
  checkBudgetWarning();
}

export function onBodyPresenceChanged(present) {
  if (!present) {
    isAboveAT = false;
    lastReadingTimestamp = 0;
    sessionAboveATSeconds = 0;
    recoveryState = RECOVERY_IDLE;
    recoveryStartTimestamp = 0;
    lastRecoveryDuration = 0;
  } else {
    sessionAboveATSeconds = 0;
    lastReadingTimestamp = 0;
    isAboveAT = false;
    recoveryState = RECOVERY_IDLE;
    recoveryStartTimestamp = 0;
    lastRecoveryDuration = 0;
    checkDateRollover();
  }
  updateAllDisplays();
}

export function setDailyBudget(minutes) {
  const value = Number(minutes);
  if (!isFinite(value) || value < 1 || value > 1440) {
    console.log('Invalid daily budget: ' + minutes);
    return;
  }
  dailyBudgetMinutes = value;
  updateBudgetDisplay();
}

// === INTERNAL FUNCTIONS ===

function loadDailyStats() {
  try {
    const data = fs.readFileSync(DAILY_STATS_FILE, DAILY_STATS_TYPE);
    if (data && typeof data.dailyAboveATSeconds === 'number' && typeof data.dailyDate === 'string') {
      dailyAboveATSeconds = data.dailyAboveATSeconds;
      dailyDate = data.dailyDate;
    }
  } catch (ex) {
    dailyAboveATSeconds = 0;
    dailyDate = getTodayDateString();
  }
}

function saveState() {
  try {
    fs.writeFileSync(DAILY_STATS_FILE, {
      dailyAboveATSeconds: dailyAboveATSeconds,
      dailyDate: dailyDate
    }, DAILY_STATS_TYPE);
  } catch (ex) {
    console.log('Failed to save daily stats: ' + ex);
  }
}

function checkDateRollover() {
  const todayStr = getTodayDateString();
  if (dailyDate !== todayStr) {
    dailyAboveATSeconds = 0;
    dailyDate = todayStr;
    budgetWarningFired = false;
    sessionAboveATSeconds = 0;
  }
}

function getTodayDateString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return y + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
}

function formatDuration(totalSeconds) {
  const secs = Math.floor(totalSeconds);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function updateAllDisplays() {
  updateTimeAboveATDisplay();
  updateRecoveryDisplay(Date.now());
  updateBudgetDisplay();
}

function updateTimeAboveATDisplay() {
  if (UI_TIME_ABOVE_AT) {
    UI_TIME_ABOVE_AT.text = formatDuration(sessionAboveATSeconds);
  }
}

function updateRecoveryDisplay(now) {
  if (!UI_RECOVERY_TIMER) return;

  if (recoveryState === RECOVERY_IDLE) {
    UI_RECOVERY_TIMER.text = '--:--';
    UI_RECOVERY_TIMER.style.fill = '#aaaaaa';
    if (UI_RECOVERY_STATUS) UI_RECOVERY_STATUS.text = '';
  } else if (recoveryState === RECOVERY_RECOVERING) {
    const elapsed = (now - recoveryStartTimestamp) / 1000;
    UI_RECOVERY_TIMER.text = formatDuration(elapsed);
    UI_RECOVERY_TIMER.style.fill = '#ffa726';
    if (UI_RECOVERY_STATUS) UI_RECOVERY_STATUS.text = 'recovering';
  } else if (recoveryState === RECOVERY_RECOVERED) {
    UI_RECOVERY_TIMER.text = formatDuration(lastRecoveryDuration);
    UI_RECOVERY_TIMER.style.fill = '#66bb6a';
    if (UI_RECOVERY_STATUS) UI_RECOVERY_STATUS.text = 'recovered';
  }
}

function updateBudgetDisplay() {
  const usedMinutes = dailyAboveATSeconds / 60;
  const remainingMinutes = Math.max(0, dailyBudgetMinutes - usedMinutes);
  const percentage = Math.min(100, (usedMinutes / dailyBudgetMinutes) * 100);

  if (UI_BUDGET_USED) {
    UI_BUDGET_USED.text = Math.floor(usedMinutes) + ' / ' + dailyBudgetMinutes + ' min';
  }
  if (UI_BUDGET_REMAINING) {
    UI_BUDGET_REMAINING.text = Math.floor(remainingMinutes) + ' min remaining';
  }
  if (UI_BUDGET_BAR_FILL) {
    UI_BUDGET_BAR_FILL.width = Math.floor((percentage / 100) * BAR_MAX_WIDTH_PX);

    if (percentage < 50) {
      UI_BUDGET_BAR_FILL.style.fill = '#66bb6a';
    } else if (percentage < 75) {
      UI_BUDGET_BAR_FILL.style.fill = '#ffee58';
    } else if (percentage < 90) {
      UI_BUDGET_BAR_FILL.style.fill = '#ffa726';
    } else {
      UI_BUDGET_BAR_FILL.style.fill = '#ef5350';
    }
  }
}

function checkBudgetWarning() {
  if (!UI_BUDGET_WARNING) return;
  const percentage = Math.min(100, (dailyAboveATSeconds / 60 / dailyBudgetMinutes) * 100);

  if (percentage >= 100) {
    UI_BUDGET_WARNING.text = 'OVER LIMIT';
    UI_BUDGET_WARNING.style.display = 'inline';
    UI_BUDGET_WARNING.style.fill = '#ef5350';
  } else if (percentage >= BUDGET_WARNING_THRESHOLD && !budgetWarningFired) {
    vibration.start('confirmation-max');
    budgetWarningFired = true;
    UI_BUDGET_WARNING.text = 'LIMIT NEAR';
    UI_BUDGET_WARNING.style.display = 'inline';
    UI_BUDGET_WARNING.style.fill = '#ffa726';
  } else if (percentage < BUDGET_WARNING_THRESHOLD) {
    UI_BUDGET_WARNING.style.display = 'none';
  }
}
