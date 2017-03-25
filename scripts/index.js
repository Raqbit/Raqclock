/*
    Copyright (C) 2017 Raqbit

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

// Development environment
const dev = true;

// Root content element
const rootEl = document.getElementById('content');

// Time object
let time = { hours: 0, minutes: 0 };

// State object
let currentState = new ClockState();
// let currentState = new AlarmState();

//Function for switching states
function switchState(newState) {
    //Cleaning up old state
    currentState.cleanUp();

    console.log('Switching state to ' + newState + '.')

    //Initiating new state
    switch (newState) {
        case 'clock':
            currentState = new ClockState();
            break;
        case 'alarm':
            currentState = new AlarmState();
            break;
    }

}

// Keeping track of time
(function () {
    function updateClock() {
        // Getting current date and time
        const today = new Date();

        time.hours = today.getHours();
        time.minutes = today.getMinutes();

        //Updating the current state
        currentState.update();

        if (currentAlarm != -1) {
            checkAlarm();
        }
    }

    // Updating the clock for the first time
    updateClock();

    // Setting interval
    setInterval(function () {
        updateClock();
    }, 1000);
}());

// Handling gpio buttons
(function () {
    // Keeping track of timestamps 
    let pressed = {};

    window.onkeydown = function (e) {
        if (pressed[e.which]) return;
        pressed[e.which] = e.timeStamp;
    };

    //When key is released
    window.onkeyup = function (e) {
        // If it magically wasn't pressed, return
        if (!pressed[e.which]) return;

        //Calculate duration (seconds)
        const duration = (e.timeStamp - pressed[e.which]) / 1000;

        //Switch for keys (81:Q:17, 87:W:22, 69:E:23, 82:R:27)
        switch (e.which) {
            case 81:
                currentState.buttonPress(0, duration);
                break;
            case 87:
                currentState.buttonPress(1, duration);
                break;
            case 69:
                currentState.buttonPress(2, duration);
                break;
            case 82: {
                currentState.buttonPress(3, duration);
                if (dev && duration > 0.5) {
                    location.reload(true);
                }
                break;
            }

        }
        pressed[e.which] = 0;
    };
}());