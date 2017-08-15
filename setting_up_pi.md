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
    network={
        ssid="SSID"
        psk="passphrase"
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
    * Advanced Options > Expand filesystem
    * Update the pi
    * Hit finish

9. Reboot to activate some of changes we've made: `sudo shutdown -r`

10. Next up is installing a graphical interface.

    In this tutorial I'm going to be installing the standard PIXEL desktop environment.

    The reason I went with PIXEL, and not a minimal openbox installation, is because PIXEL will drag in everything you need to get the desktop up and running, like the display manager.

    Now you might feel like: 'Gee, why did we even go with Raspbian LIGHT in the first place, when we're installing PIXEL?', and the answer to this is simple: Raspbian 'Full' includes a lot of software, like for example Libre Office. Using Raspbian Light, and then installing PIXEL costs less time than installing Raspbian 'Full' and deleting everything. Also the image is A LOT smaller.

    This certainly isn't the most lightweight you can get, but it is the fastest way to get a desktop enviroment running & working well on the pi.

**Installing the PIXEL desktop environment:**

Thanks to **GhostRaider** for the amazing [guide](https://www.raspberrypi.org/forums/viewtopic.php?f=66&t=133691) on the raspberry pi forums!

11. Connect back to your pi: `ssh pi@<IP>`, log in with the **new** password.

12. To install a stripped down version of the PIXEL desktop, run:

    ```
    sudo apt-get install --no-install-recommends raspberrypi-ui-mods
    ```

    Wait a LOT.

13. To get PIXEL to display on the PiTFT, we need another package:

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

15. Now, we should configure the pi to automagically boot to the desktop, without having to log in.

    Run raspi-config: `sudo raspi-config`

    * Boot Options > Desktop/CLI > Desktop Autologin
    * Hit finish, it should ask you to reboot

16. After rebooting it should display the PIXEL desktop environment on your screen! Hooray!

**Some cosmetics:**

16. Via ssh, disable the lxde panel, screensaver & auto-menu-pointer.

    ```
    nano ~/.config/lxsession/LXDE-pi/autostart
    ```

    Make sure it looks like this:

    ```
    #@lxpanel --profile LXDE-pi
    @pcmanfm --desktop --profile LXDE-pi
    #@xscreensaver -no-splash
    #@point-rpi
    ```
17. Nextup, we're going to make everything black:

    ```
    nano ~/.config/pcmanfm/LXDE-pi/desktop-items-0.conf
    ```
    And change:
    ```
    walpaper_mode=color
    ...
    desktop_bg=#000000
    destkop_fg=@000000
    ...
    show_trash=0
    ```

18. It's reboot time again. (`sudo reboot`)

19. You should be greeted with an all-black screen, and a pointer: Now it's time to make the pointer dissapear.

    Modify the x start command in lightdm:
    ```
    sudo nano /etc/lightdm/lightdm.conf
    ```

    Change the following line:
    ```
    [SeatDefaults]
    ..
    xserver-command=X -nocursor
    ..
    ```

20. Reboot - Et voila, no cursor no more!

21. Now it's up to you to install any software you'd want to run on bootup:

    ```
    nano ~/.config/lxsession/LXDE-pi/autostart
    ```

    For instance add:
    ```
    @echo hi
    ```
    to run 'echo hi' on startup

**I hope this guide was helpfull!**