//----------//
// SETTINGS //
//----------//

/** Amount to increase the cost by each cycle. **/
const HIGH_COST_RATE = 0.07;
const LOW_COST_RATE = 0.03;

/** Amount of milliseconds to subtract from the duration each cycle. **/
const CYCLE_SPEEDUP = 100;

/** The cost when starting the meter. **/
const INITIAL_COST = 0.13;

/** Time in milliseconds before increasing the price for the first time. **/
const INITIAL_TIME = 8000;

/** The lowest amount of time in milliseconds of a cycle. **/
const MINIMUM_DURATION = 500;

/** Time in milliseconds before updating the display of the countdown timer. 
 * Most computer screens run at 60 Hz, which is 16.7 ms. **/
const REFRESH_TIME = 16;

/** Determines whether the meter will run as soon as the page loads. **/
const START_RUNNING = true;

//-----------//
// VARIABLES //
//-----------//

/** Current running cost. **/
let cost = INITIAL_COST;

/** Current cost rate. **/
let costRate = HIGH_COST_RATE;

/** Is the meter currently running or paused? **/
let isRunning = START_RUNNING;

/** The duration of the current cycle in milliseconds. **/
let duration = INITIAL_TIME;

/** The amount of milliseconds before increasing the cost. **/
let timeLeft = INITIAL_TIME;

/** A Number, representing the ID value of the timer. **/
let timerCountdown;

/** DOM elements. **/
let elm_cost, elm_euro, elm_countdown;

//-----------//
// FUNCTIONS //
//-----------//    

/** Stops the meter and shows the cost with a euro sign, blinking. **/
function pauseTimer() {
    isRunning = false;
    clearTimeout(timerCountdown);
    elm_euro.style.visibility = "visible";
    elm_bill.classList.add('blink');
}

/** Resumes the meter and removes the decoration. **/
function resumeTimer() {
    isRunning = true;
    elm_euro.style.visibility = "hidden";
    elm_bill.classList.remove('blink');
    updateCountdown();
}

/** Determines the cost rate depending on the duration of the cycle.
 *  The duration of the cycle decreases until the minimum duration.
 *  The cost is then incremented by the cost rate.
 *  **/
function incrementCost() {
    // Subtract time from this cycle's duration.
    duration -= CYCLE_SPEEDUP;
    // Prevent the cost from increasing too fast.            
    if (duration <= MINIMUM_DURATION) {
        // Ensure a minimum amount of milliseconds.
        duration = MINIMUM_DURATION;
        // Switch from high to low rate.
        costRate = LOW_COST_RATE;
    }
    //Increase the cost.
    cost += costRate;
    // Set the countdown timer to the new cycle's duration.
    timeLeft = duration;
    // Display the current running cost.
    elm_cost.innerHTML = cost.toFixed(2);
}

/** The countdown timer is a fast running timer that shows how much time is left until the next cost increase. **/
function updateCountdown() {
    // Decrease the timer by the screen's refresh time.
    timeLeft -= REFRESH_TIME;
    if (timeLeft < 0) {
        // Increase the cost and start a new cycle.
        incrementCost();
    }
    // Display how much time is left in this cycle.
    elm_countdown.innerHTML = timeLeft;
    // Repeat this function at the next screen refresh.
    timerCountdown = setTimeout(updateCountdown, REFRESH_TIME);
}

//-------//
// ENTRY //
//-------//     

/** This starts after the page has fully loaded. **/
window.addEventListener('load', function () {
    // Get handles to the HTML elements.            
    elm_cost = document.getElementById('elm_cost');
    elm_cost.innerHTML = INITIAL_COST.toFixed(2);
    elm_euro = document.getElementById('elm_euro');
    elm_countdown = document.getElementById('elm_countdown');
    if (START_RUNNING) {
        resumeTimer();
    }
    // Toggle the meter by clicking on the page.
    document.onclick = function () {
        if (isRunning) {
            pauseTimer();
        } else {
            resumeTimer();
        }
    };
}, false);