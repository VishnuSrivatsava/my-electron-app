document.addEventListener('DOMContentLoaded', function () {
  // Initial scramble generation when the app loads
  generateScramble();

  document.body.onkeyup = function (e) {
    if (e.keyCode == 32) {
      startTimer();
    }
  };

  document.getElementById('resetButton').addEventListener('click', function () {
    resetTimer();
    document.getElementById('startStopButton').focus();
  });

  document.getElementById('times').addEventListener('click', function (e) {
    if (e.target.classList.contains('deleteButton')) {
      removeTime(e.target.parentNode);
    }
  });

  document.getElementById('resetAllButton').addEventListener('click', function () {
    resetAllTimes();
  });
});

let startTime;
let updatedTime;
let difference;
let tInterval;
let savedTime;
let paused = 0;
let running = 0;
let moves = ['U', 'D', 'L', 'R', 'F', 'B', "U'", "D'", "L'", "R'", "F'", "B'"];
let currentScramble = '';
let solveTimes = [];

function startTimer() {
  if (!running) {
    if (paused) {
      savedTime += new Date().getTime() - paused;
      paused = 0;
    }
    startTime = new Date().getTime();
    tInterval = setInterval(getShowTime, 1);
    running = 1;
    document.getElementById('startStopButton').innerHTML = 'Stop';
  } else {
    clearInterval(tInterval);
    paused = new Date().getTime();
    running = 0;
    document.getElementById('startStopButton').innerHTML = 'Start';

    let currentTime = document.getElementById('timer').innerHTML;
    saveTime(currentTime, currentScramble);
    generateScramble();
    updateAverage();
  }
}

function getShowTime() {
  updatedTime = new Date().getTime();
  if (savedTime) {
    difference = (updatedTime - startTime) + savedTime;
  } else {
    difference = updatedTime - startTime;
  }
  let totalMilliseconds = difference;
  let seconds = Math.floor(totalMilliseconds / 1000);
  let milliseconds = totalMilliseconds % 1000;
  document.getElementById('timer').innerHTML = seconds + '.' + milliseconds;
}

function generateScramble() {
  const scrambleText = document.getElementById('scrambleText');
  let scramble = '';
  let lastMove = '';

  for (let i = 0; i < 20; i++) {
    let newMove = moves[Math.floor(Math.random() * moves.length)];

    // Ensure the new move is not the same as the last move
    while (newMove.charAt(0) === lastMove.charAt(0)) {
      newMove = moves[Math.floor(Math.random() * moves.length)];
    }

    scramble += newMove + ' ';
    lastMove = newMove;
  }

  currentScramble = scramble;
  scrambleText.textContent = scramble;
}

function saveTime(time, scramble) {
  let timesList = document.getElementById('times');
  let listItem = document.createElement('li');
  let deleteButton = document.createElement('button');

  deleteButton.classList.add('deleteButton');
  deleteButton.textContent = 'Delete';

  listItem.textContent = time + ' | ' + scramble;
  listItem.appendChild(deleteButton);

  timesList.appendChild(listItem);
  solveTimes.push(difference);
}

function updateAverage() {
  if (solveTimes.length >= 5) {
    // Limit the array to the last 5 solves
    let lastFiveSolves = solveTimes.slice(-5);

    // Sort the array in ascending order
    lastFiveSolves.sort((a, b) => a - b);

    // Exclude the best and worst times
    let averageSolves = lastFiveSolves.slice(1, -1);

    // Calculate the mean of the remaining three solves
    let mean = averageSolves.reduce((acc, time) => acc + time, 0) / averageSolves.length;

    // Display the average on the page
    let averageElement = document.getElementById('average');
    averageElement.textContent = 'Average of 5: ' + formatTime(mean);

    // Console log the last five times and the three times used for calculating the average
    console.log('Last Five Times: ', lastFiveSolves);
    console.log('Three Times Used for Calculating Average: ', averageSolves);
  }
}


function formatTime(time) {
  let seconds = Math.floor(time / 1000);
  let milliseconds = Math.floor(time % 1000);
  let formattedMilliseconds = milliseconds.toString().padStart(3, '0'); // Ensure three digits
  return seconds + '.' + formattedMilliseconds;
}

function resetTimer() {
  clearInterval(tInterval);
  document.getElementById('timer').innerHTML = '0.00';
  document.getElementById('startStopButton').innerHTML = 'Start';
  solveTimes = [];
  generateScramble();
  document.getElementById('average').textContent = 'Average of 5: N/A';

}

function removeTime(target) {
  // Remove the time from the list
  target.parentNode.removeChild(target);

  // Remove the corresponding solve time from the array
  let index = Array.from(target.parentNode.children).indexOf(target);
  solveTimes.splice(index, 1);

  // Update the average
  updateAverage();
}

function resetAllTimes() {
  // Remove all times from the list
  let timesList = document.getElementById('times');
  while (timesList.firstChild) {
    timesList.removeChild(timesList.firstChild);
  }

  // Reset the solve times array
  solveTimes = [];

  // Update the average
  updateAverage();

  // Set focus back to the main timer
  document.getElementById('startStopButton').focus();
}
