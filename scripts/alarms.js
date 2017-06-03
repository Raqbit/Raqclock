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

// Alarms object
let alarms;
if (getCookie('alarmTimes') != '') {
    alarms = JSON.parse(getCookie('alarmTimes'));
} else {
    alarms = [
        {
            hours: 6,
            minutes: 30
        },
        {
            hours: 7,
            minutes: 0
        },
        {
            hours: 8,
            minutes: 0
        }];
}

// Current Alarm
let currentAlarm;

if (getCookie('currentAlarm') != '') {
    currentAlarm = getCookie('currentAlarm');
} else {
    currentAlarm = -1;
}

function injectVisAlarm() {
    const alarm = alarms[currentAlarm];
    const timeString = ClockState.get12hrTimeString(alarm.hours, alarm.minutes);
    rootEl.innerHTML += '<img class="alarmSetImg" src="images/alarm.svg">';
    rootEl.innerHTML += '<p class="alarmSetText">' + timeString[0] + '<span class="alarmAmPm">' + timeString[1] + '</span></p>';
}

function updateVisAlarm() {
    const alarm = alarms[currentAlarm];
    const timeString = ClockState.get12hrTimeString(alarm.hours, alarm.minutes);
    document.getElementsByClassName('alarmSetText')[0].innerHTML = timeString[0] + '<span class="alarmAmPm">' + timeString[1] + '</span>';
}

function switchAlarm(newAlarm, injectAlarm) {
    if (currentAlarm == newAlarm) {
        console.log('Disabling current alarm.')
        currentAlarm = -1;
        if (injectAlarm) {
            document.getElementsByClassName("alarmSetImg")[0].outerHTML = '';
            document.getElementsByClassName("alarmSetText")[0].outerHTML = '';
        }
    } else {
        console.log('Switching alarm to ' + newAlarm + ' (' + alarms[newAlarm].hours + ':' + alarms[newAlarm].minutes + ').')
        if (injectAlarm && currentAlarm == -1) {
            currentAlarm = newAlarm;
            injectVisAlarm();
        } else {
            currentAlarm = newAlarm;
            updateVisAlarm();
        }
    }
    setCookie('currentAlarm', currentAlarm, 5);
}

function checkAlarm() {
    const alarm = alarms[currentAlarm];

    if (alarm.hours === time.hours && alarm.minutes === time.minutes && !(currentState instanceof AlarmState)) {
        switchState(AlarmState);
    }
}