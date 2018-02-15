// Alarms object
let alarms;
const storedAlarmTimes = localStorage.getItem('alarmTimes');
if (storedAlarmTimes) {
    alarms = JSON.parse(storedAlarmTimes);
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
const storedAlarm = localStorage.getItem('currentAlarm');
if (storedAlarm) {
    currentAlarm = storedAlarm;
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
    localStorage.setItem('currentAlarm', currentAlarm);
}

function checkAlarm() {
    const alarm = alarms[currentAlarm];

    if (alarm.hours === time.hours && alarm.minutes === time.minutes && !(currentState instanceof AlarmState)) {
        switchState(AlarmState);
    }
}