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

class ClockState extends State {

    constructor() {
        super();
        rootEl.innerHTML = '<h1 id="currentTime"><span id="digits"></span><span id="amPm"></span></h1>';
        this.update();
    }

    buttonPress(button, duration) {
        if (button == 1) {
            switchState('menu_main');
        }
    };

    update() {
        const timeDigitsEl = document.getElementById('digits');
        const amPmEl = document.getElementById('amPm');

        let hours = time.hours;
        let minutes = time.minutes;

        const ampm = (hours >= 12 ? 'pm' : 'am').toUpperCase();

        // Converting 24-hour to 12-hour
        hours = hours % 12;

        // 0 am is 12am
        hours = hours ? hours : 12;

        // Add 0 before minutes if < 10
        minutes = minutes < 10 ? '0' + minutes : minutes;

        //Combine hours & minutes, setting html
        timeDigitsEl.innerHTML = hours + ':' + minutes;
        amPmEl.innerHTML = ampm;
    };
}

class MenuState extends State {
    constructor(dir) {
        super();
        this.dir = dir;

        rootEl.innerHTML = '<h1 id="currentTime">Menu</h1>';
    }

    buttonPress(button, duration) {
        if (button == 1) {
            switchState('clock');
        }
    };
}