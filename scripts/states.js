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

class State {
    buttonPress(button, duration) { };

    update() { };

    cleanUp() {
        rootEl.innerHTML = "";
    };

}

class AlarmState extends State {
    constructor() {
        super();
        currentAlarm = -1;
        rootEl.innerHTML = '<img id="alarmBig" src="images/alarm.svg"><div id="stopAlarm"><button onclick="switchState(\'clock\')">Stop</button></div>';
        this.sound = new Audio('sounds/carbon.ogg');
        this.sound.loop = true;
        this.sound.play();
    }

    cleanUp() {
        this.sound.pause();
        rootEl.innerHTML = "";
    }
}

class ClockState extends State {

    constructor() {
        super();
        rootEl.innerHTML = '<h1 id="currentTime"><span id="digits"></span><span id="amPm"></span></h1>';
        if (currentAlarm != -1) {
            injectVisAlarm();
        }
        this.update();
    }

    buttonPress(button, duration) {
        if (button == 0) {
            switchState('menu_main');
        } else if (button == 1) {
            switchAlarm(0, true);
        } else if (button == 2) {
            switchAlarm(1, true);
        } else if (button == 3) {
            switchAlarm(2, true);
        }
    };

    update() {
        const timeDigitsEl = document.getElementById('digits');
        const amPmEl = document.getElementById('amPm');

        const timeString = ClockState.getTimeString(time.hours, time.minutes);

        //Combine hours & minutes, setting html
        timeDigitsEl.innerHTML = timeString[0];
        amPmEl.innerHTML = timeString[1];
    };

    static getTimeString(hours, minutes) {
        const ampm = (hours >= 12 ? 'pm' : 'am').toUpperCase();

        // Converting 24-hour to 12-hour
        hours = hours % 12;

        // 0 am is 12am
        hours = hours ? hours : 12;

        // Add 0 before minutes if < 10
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return ([hours + ':' + minutes, ampm])
    }
}

const menus = {
    main: ['alarm', 'voice', 'refresh'],
};

class MenuState extends State {
    constructor(dir) {
        super();
        this.dir = dir;

        rootEl.innerHTML = '<h2 id="menuTitle">' + this.dir + ' menu</h2><ul id="menuList"></ul>';

        if (menus[dir] instanceof Array) {
            menus[dir].forEach(subMenu => {
                document.getElementById('menuList').innerHTML += '<button class="menuOption" onclick="switchState(\'menu_' + subMenu + '\')">' + subMenu + '</button>';
            });
        }
        if (dir == 'alarm' || dir == 'voice') {
            rootEl.innerHTML += '<h2>WIP</h2>';
        }
    }

    buttonPress(button, duration) {
        if (button == 0) {
            switchState('clock');
        }
    };
}