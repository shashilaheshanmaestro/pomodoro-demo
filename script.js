let timeRemaining = 1500;
let sessionCount = 0;
let intervalId = null;
let state = 'stopped';

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return mm + ':' + ss;
}

function updateDisplay() {
  document.getElementById('timer-display').textContent = formatTime(timeRemaining);
  document.getElementById('session-count').textContent = sessionCount;
}

function tick() {
  timeRemaining -= 1;
  updateDisplay();
  if (timeRemaining <= 0) {
    clearInterval(intervalId);
    intervalId = null;
    sessionCount += 1;
    timeRemaining = 1500;
    state = 'stopped';
    updateDisplay();
  }
}

function start() {
  if (state === 'running') return;
  clearInterval(intervalId);
  state = 'running';
  intervalId = setInterval(tick, 1000);
}

function pause() {
  if (state !== 'running') return;
  clearInterval(intervalId);
  intervalId = null;
  state = 'paused';
}

function reset() {
  clearInterval(intervalId);
  intervalId = null;
  timeRemaining = 1500;
  state = 'stopped';
  updateDisplay();
}

window.__pomodoroTest = {
  setTimeRemaining: function(seconds) {
    timeRemaining = seconds;
    updateDisplay();
  },
  getTimeRemaining: function() {
    return timeRemaining;
  },
  getSessionCount: function() {
    return sessionCount;
  },
  getState: function() {
    return state;
  }
};

document.addEventListener('DOMContentLoaded', function() {
  updateDisplay();
  document.getElementById('btn-start').addEventListener('click', start);
  document.getElementById('btn-pause').addEventListener('click', pause);
  document.getElementById('btn-reset').addEventListener('click', reset);
});
