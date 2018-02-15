class State {
    buttonPress(button, duration) {
    };

    update() {
    };

    cleanUp() {
        rootEl.innerHTML = "";
    };

}

class AlarmState extends State {
    constructor() {
        super();
        this.name = 'AlarmState';
        currentAlarm = -1;
        rootEl.innerHTML = '<img class="alarmBig" src="images/alarm.svg"><button onclick="switchState(ClockState)">Stop</button>';
        alarm.play();
    }

    cleanUp() {
        alarm.pause();
        alarm.currentTime = 0;
        rootEl.innerHTML = "";
    }
}

class LoadingState extends State {
    constructor() {
        super();
        this.name = 'LoadingState';
        rootEl.innerHTML = '<div class="loader">Shutting down</div>'
    }
}

class ClockState extends State {

    constructor() {
        super();
        this.name = 'ClockState';
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
    main: [{type: 'subMenu', name: 'alarm', display: 'alarm'},
        {type: 'subMenu', name: 'voice', display: 'voice'},
        {type: 'action', name: 'refresh', display: 'refresh', action: {type: 'refresh'}},
        {type: 'action', name: 'shutdown', display: 'shutdown', action: {type: 'shutdown'}}],
    alarm: [{
        type: 'action',
        name: 'profile1',
        display: 'edit profile 1',
        action: {type: 'editProfile', property: 1}
    }, {
        type: 'action',
        name: 'profile2',
        display: 'edit profile 2',
        action: {type: 'editProfile', property: 2}
    }, {type: 'action', name: 'profile3', display: 'edit profile 3', action: {type: 'editProfile', property: 3}}]
};

class MenuState extends State {
    constructor(dir) {
        super();
        this.name = 'MenuState';
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
            switchState(ClockState);
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
            case 'shutdown': {
                fetch('http://localhost:8080/api/shutdown', {method: 'post'})
                    .then(res => {
                       res.text().then(txt => {
                           if (txt === 'OK') {
                               switchState(LoadingState);
                           } else {
                               switchState(ClockState);
                           }
                       });
                    }).catch(e => {
                    switchState(ClockState);
                })
                break;
            }
            case 'editProfile': {
                switchState(ProfileEditState, data);
                console.log('Switching state to edit profile ' + data + ' menu.')
                break;
            }
        }
    }
}

class ProfileEditState extends State {
    constructor(profile) {
        super();
        this.name = 'ProfileEditState';
        this.profile = profile;
        this.time = alarms[profile - 1];
        rootEl.innerHTML = `<h2 class="menuTitle editProfileHeading">Edit profile ` + profile + `</h2>
         <div class="timeInput">
         <div class="timeSelectorRow">
         <button class="timeSelector" onclick="currentState.editTime(true, true)">&#9650;</button>
         <button class="timeSelector" onclick="currentState.editTime(false, true)">&#9650;</button>
         </div>
         <span class="timeSelectorTime">` +
            ClockState.get24hrTimeString(this.time.hours, this.time.minutes) + `</span>
        <div class="timeSelectorRow">
         <button class="timeSelector" onclick="currentState.editTime(true, false)">&#9660;</button>
         <button class="timeSelector" onclick="currentState.editTime(false, false)">&#9660;</button>
         </div>
         </div>`;
    }

    editTime(hours, add) {
        const timeEl = document.getElementsByClassName('timeSelectorTime')[0];
        if (add) {
            if (hours) {
                this.time.hours = this.time.hours === 23 ? 0 : this.time.hours + 1;
            } else {
                this.time.minutes = this.time.minutes === 59 ? 0 : this.time.minutes + 1;
            }
        } else {
            if (hours) {
                this.time.hours = this.time.hours === 0 ? 23 : this.time.hours - 1;
            } else {
                this.time.minutes = this.time.minutes === 0 ? 59 : this.time.minutes - 1;
            }
        }
        timeEl.innerHTML = ClockState.get24hrTimeString(this.time.hours, this.time.minutes);
    }

    buttonPress(button, duration) {
        alarms[this.profile - 1] = this.time;
        localStorage.setItem('alarmTimes', JSON.stringify(alarms));
        if (button == 0) {
            switchState(ClockState);
        } else if (button == 1) {
            MenuState.switchMenu('alarm');
        }
    };
}
