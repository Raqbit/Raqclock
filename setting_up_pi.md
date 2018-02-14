### Setting up a kiosk pi with touchscreen
**Note: This tutorial is made for any raspberry pi with an Adafruit PiTFT 2.8 Capacative touchscreen.**

1. Flashing Raspbian

    In terminal, run the `lsblk` command to get the sd card's name, like: `/dev/sdX`

    **Make sure you get the right drive here!**

    In terminal, run the following command to flash the Raspbian image to `/dev/sdX`:
    ```
    sudo dd bs=4M if=raspbian.img of=/dev/sdX status=progress; sync
    ```

    When done, simply eject the sd card, and pop it back in.

2. On boot partition, add empty 'ssh' file. This will enable ssh on boot.

3. **Optional: WiFi** On boot partition, add 'wpa_supplicant.conf' file containing:

    ```
    country=US
    ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
    update_config=1

    network={
        ssid="SSID"
        scan_ssid=1
        psk="passphrase"
        key_mgmt=WPA-PSK
    }
    ```

    On first boot, Raspbian will copy this config to the right location, thus enabling wifi.

4. On boot partition, edit config.txt, and add the following lines:

    ```
    dtparam=spi=on
    dtparam=i2c1=on
    dtparam=i2c_arm=on
    dtoverlay=pitft28-capacitive,rotate=90,speed=32000000,fps=20
    dtoverlay=pitft28-capacitive,touch-swapxy=true,touch-invx=true
    ```

    The first three lines will enable the interfaces the touchscreen talks over.
    The last two lines will load the screen's overlay (read: driver) and make sure the screen's orientation matches the touch registering.
    
    Without the configuration (just loading the overlay), swiping up will actually go right, and swiping right will go down.


5. Put the sd card into the pi, and boot it up. The screen should start white but get black at some point (The kernel resets the screen).

6. Somehow find the IP of your pi, I usually use my router's network map feature. It should have 'raspberrypi' as it's hostname.

7. In terminal, run `ssh pi@<IP>`, accept the signature and login with the default password `raspberry`

8. Run `sudo raspi-config`, and do the following:
    * Change user password
    * Set hostname
    * Boot to CLI with autologin
    * Advanced Options > Expand filesystem
    * Update the pi
    * Hit finish

9. Reboot to activate some of changes we've made: `sudo shutdown -r`

10. Next up is installing a graphical interface.

    In this tutorial I'm going to be installing matchbox, which is a lightweight window manager.

**Installing the Matchbox window manager:**

11. Connect back to your pi: `ssh pi@<IP>`, log in with the **new** password.

12. To install matchbox, run:

    ```
    sudo apt-get install matchbox-window-manager xserver-xorg x11-xserver-utils xinit
    ```

13. To get matchbox to display on the PiTFT, we need another package:

    ```
    sudo apt-get install xserver-xorg-video-fbdev
    ```

14. Now, we need to edit a config file for it to actually display on the screen:

    Open up /usr/share/X11/xorg.conf.d/99-fbdev.conf:

    ```
    sudo nano /usr/share/X11/xorg.conf.d/99-fbdev.conf 
    ```

    And add the following:

    ```
    Section "Device"  
        Identifier "myfb"
        Driver "fbdev"
        Option "fbdev" "/dev/fb1"
    EndSection
    ```

15. Every system startup the pi user needs to output to the screen (since we're not using a login manager), so we need to add the pi user to the tty group:

    ```
    sudo gpasswd -a pi tty
    ```

    and also change the permissions of the ttys on bootup:

    ```
    sudo sed -i '/^exit 0/c\chmod g+rw /dev/tty?\nexit 0' /etc/rc.local
    ```

16. Now we need to setup a startup script:

    ```
    nano ~/startpi.sh
    ```

    ```bash
    #!/bin/bash

    # disable DPMS (Energy Star) features.
    xset -dpms

    # disable screen saver
    xset s off

    # don't blank the video device
    xset s noblank

    # run window manager
    matchbox-window-manager -use_cursor no -use_titlebar no  &

    # re-launch on crash
    while :
    do
    # >>RUN PROGRAM<<
    # For instance a kiosk chrome window:
    #exec chromium-browser --noerrdialogs --disable-session-crashed-bubble --disable-infobars --disable-translate --disable-cache --disk-cache-dir=/dev/null --disk-cache-size=1 --app=[url]
    done;
    ```

17. Start startup script on startup

    ```
    nano ~/.bashrc
    ```

    and append:

    ```bash
    if [ -z "${SSH_TTY}" ]; then
    # 
        xinit ~/startpi.sh -- -nocursor
        # Clear screen if it exits   
        cat /dev/zero >/dev/fb1
    fi
    ```
18. Allow pi user to start x:

    ```
    nano /etc/X11/Xwrapper.config
    ```

    and change:

    ```
    allowed_users=anybody
    ```
19. Setup & configure retrogame to get input events for the buttons:
https://learn.adafruit.com/retro-gaming-with-raspberry-pi/adding-controls-software
