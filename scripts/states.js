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
        rootEl.innerHTML = '<img class="alarmBig" src="images/alarm.svg"><button onclick="switchState(\'clock\')">Stop</button>';
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
        rootEl.innerHTML = '<div class="currentTime"><h1><span class="digits"></span><span class="amPm"></span></h1></div>';
        if (currentAlarm != -1) {
            injectVisAlarm();
        }
        this.update();
    }

    buttonPress(button, duration) {
        if (button == 0) {
            MenuState.switchMenu('main');
        } else if (button == 1) {
            switchAlarm(0, true);
        } else if (button == 2) {
            switchAlarm(1, true);
        } else if (button == 3) {
            switchAlarm(2, true);
        }
    };

    update() {
        const timeDigitsEl = document.getElementsByClassName('digits')[0];
        const amPmEl = document.getElementsByClassName('amPm')[0];

        const timeString = ClockState.get12hrTimeString(time.hours, time.minutes);

        //Combine hours & minutes, setting html
        timeDigitsEl.innerHTML = timeString[0];
        amPmEl.innerHTML = timeString[1];
    };

    static get12hrTimeString(hours, minutes) {
        const ampm = (hours >= 12 ? 'pm' : 'am').toUpperCase();

        // Converting 24-hour to 12-hour
        hours = hours % 12;

        // 0 am is 12am
        hours = hours ? hours : 12;

        // Add 0 before minutes if < 10
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return ([hours + ':' + minutes, ampm])
    }

    static get24hrTimeString(hours, minutes) {
        // Add 0 before minutes if < 10, same with hours
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return (hours + ':' + minutes);
    }
}

const menus = {
    main: [{ type: 'subMenu', name: 'alarm', display: 'alarm' },
    { type: 'subMenu', name: 'voice', display: 'voice' },
    { type: 'action', name: 'refresh', display: 'refresh', action: { type: 'refresh' } }],
    alarm: [{ type: 'action', name: 'profile1', display: 'edit profile 1', action: { type: 'editProfile', property: 1 } }, { type: 'action', name: 'profile2', display: 'edit profile 2', action: { type: 'editProfile', property: 2 } }, { type: 'action', name: 'profile3', display: 'edit profile 3', action: { type: 'editProfile', property: 3 } }]
};

class MenuState extends State {
    constructor(dir) {
        super();
        this.dir = dir;

        rootEl.innerHTML = '<h2 class="menuTitle">' + this.dir + ' menu</h2><ul class="menuList"></ul>';

        if (menus[dir] instanceof Array) {
            menus[dir].forEach(item => {
                if (item.type === 'subMenu') {
                    document.getElementsByClassName('menuList')[0].innerHTML +=
                        '<button class="menuOption" onclick="MenuState.switchMenu(\'' + item.name + '\')">' + item.display + '</button>';
                } else if (item.type === 'action') {
                    document.getElementsByClassName('menuList')[0].innerHTML +=
                        '<button class="menuOption" onclick="MenuState.execAction(\'' + item.action.type + '\', ' + item.action.property + ')">' + item.display + '</button>';
                }
            });
        } else {
            rootEl.innerHTML += '<h2>WIP</h2>';
        }
    }

    buttonPress(button, duration) {
        if (button == 0) {
            switchState('clock');
        }
    };

    static switchMenu(dir) {
        currentState = new MenuState(dir);
        console.log('Switching state to ' + dir + ' menu.')
    }

    static execAction(type, data) {
        switch (type) {
            case 'refresh': {
                location.reload(true);
                break;
            }
            case 'editProfile': {
                currentState = new ProfileEditState(data);
                console.log('Switching state to edit profile ' + data + ' menu.')
                break;
            }
        }
    }
}

class ProfileEditState extends State {
    constructor(profile) {
        super();
        this.profile = profile;
        this.time = alarms[profile - 1];
        rootEl.innerHTML = `<h2 class="menuTitle editProfileHeading">Edit profile ` + profile + `</h2>
         <div class="timeInput">
         <button class="timeSelector" onclick="currentState.editTime(true, true)">&#9650;</button>
         <button class="timeSelector" onclick="currentState.editTime(false, true)">&#9650;</button>
         <span class="timeSelectorTime">`+
            ClockState.get24hrTimeString(this.time.hours, this.time.minutes) + `</span>
         <button class="timeSelector" onclick="currentState.editTime(true, false)">&#9660;</button>
         <button class="timeSelector" onclick="currentState.editTime(false, false)">&#9660;</button>
         </div>`;
    }

    editTime(hours, add) {
        const timeEl = document.getElementsByClassName('timeSelectorTime')[0];
        if (add) {
            if (hours) {
                //Add one to hours, wrapping around at 24:00
                if (this.time.hours + 1 === 24) {
                    this.time.hours = 0;
                } else {
                    this.time.hours++;
                }
            } else {
                //Add one to minutes, wrapping around at 00:61
                if (this.time.minutes + 1 === 60) {
                    this.time.minutes = 0;
                    this.time.hours++;
                } else {
                    this.time.minutes++;
                }
            }
        } else {
            if (hours) {
                if (this.time.hours - 1 === -1) {
                    this.time.hours = 23;
                } else {
                    this.time.hours--;
                }
            } else {
                if (this.time.minutes - 1 === -1) {
                    this.time.minutes = 59;
                    this.time.hours--;
                } else {
                    this.time.minutes--;
                }
            }
        }
        timeEl.innerHTML = ClockState.get24hrTimeString(this.time.hours, this.time.minutes);
    }

    buttonPress(button, duration) {
        alarms[this.profile - 1] = this.time;
        setCookie('alarmTimes', JSON.stringify(alarms), 5);
        if (button == 0) {
            switchState('clock');
        } else if (button == 1) {
            MenuState.switchMenu('alarm');
        }
    };
}