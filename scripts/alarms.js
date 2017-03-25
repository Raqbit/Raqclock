function getCookie(cname) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

// Alarms object
let alarms = [
    {
        hours: 6,
        minutes: 30
    },
    {
        hours: 7,
        minutes: 0
    },
    {
        hours: 12,
        minutes: 20
    }];

// Current Alarm
let currentAlarm;

if (getCookie('currentAlarm') != '') {
    currentAlarm = getCookie('currentAlarm');
} else {
    currentAlarm = -1;
}

function injectVisAlarm() {
    const alarm = alarms[currentAlarm];
    const timeString = ClockState.getTimeString(alarm.hours, alarm.minutes);
    rootEl.innerHTML += '<img id="alarmSetImg" src="images/alarm.svg">';
    rootEl.innerHTML += '<p id="alarmSetText">' + timeString[0] + '<span id="alarmAmPm">' + timeString[1] + '</span></p>';
}

function updateVisAlarm() {
    const alarm = alarms[currentAlarm];
    const timeString = ClockState.getTimeString(alarm.hours, alarm.minutes);
    document.getElementById('alarmSetText').innerHTML = timeString[0] + '<span id="alarmAmPm">' + timeString[1] + '</span>';
}

function switchAlarm(newAlarm, injectAlarm) {
    if (currentAlarm == newAlarm) {
        console.log('Disabling current alarm.')
        currentAlarm = -1;
        if (injectAlarm) {
            document.getElementById("alarmSetImg").outerHTML = '';
            document.getElementById("alarmSetText").outerHTML = '';
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
        switchState('alarm');
    }
}