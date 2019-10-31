#!/bin/bash
#
# Be VERY Careful. This script may be executed with admin privileges.

echo "Openframe Processing JavaScript Extension -- install.sh"

if ! [ -z "$TRAVIS" ]; then
    echo "TRAVIS env, don't install"
    exit 0
fi

# Some limited platform detection might be in order... though at present we're targeting the Pi
os=$(uname)
arq=$(uname -m)

if [ $os == "Linux" ]; then

    # do we really want to upgrade? this could take a damn long time.
    # sudo apt-get upgrade

    # same for any debian disto (untested), including rpi (tested)
    sudo apt-get install chromium
    sudo apt-get install unclutter

    if [ $arq == "armv7l" ] || [ $arq == "armv6l" ]; then
        # on RaspberryPi or other arm 6/7 device

        # ####
        #
        # FOR NOW, CODE GOES HERE since we're shooting for RPi support
        #
        # ####

        #install chromium from source if not available via apt-get
        # Raspbian Jesse does not include chromium in apt-get
        # if chromium is not where we expect it
        if ! ls /usr/bin/chromium; then
            # if chromium is available somewhere else, symlink to it
            if which chromium; then
                sudo ln -s `which chromium` /usr/bin/chromium
            # if chromium-browser is available somwhere, symlink to it
            elif which chromium-browser; then
                sudo ln -s `which chromium-browser` /usr/bin/chromium
            # otherwise we need to download and install chromium
            else
                # Raspbian Jesse does not have chromium in its repositories
                # adapted from https://medium.com/@icebob/jessie-on-raspberry-pi-2-with-docker-and-chromium-c43b8d80e7e1#6afd
                # files from https://launchpad.net/ubuntu/+source/chromium-browser/
                # download files
                cfile=$(mktemp)
                wget https://launchpad.net/~canonical-chromium-builds/+archive/ubuntu/stage/+build/8883797/+files/chromium-browser_48.0.2564.82-0ubuntu0.15.04.1.1193_armhf.deb -O $cfile
                fffile=$(mktemp)
                wget https://launchpad.net/~canonical-chromium-builds/+archive/ubuntu/stage/+build/8883797/+files/chromium-codecs-ffmpeg-extra_48.0.2564.82-0ubuntu0.15.04.1.1193_armhf.deb -O $fffile
                # install
                sudo dpkg -i $fffile $cfile
                # symbolic link
                sudo ln -s `which chromium-browser` /usr/bin/chromium
                #clean up
                rm $cfile $fffile
            fi
        fi

        # TODO: update chromium window_placement settings

    fi

elif [ $os == "Darwin" ]; then
    # OSX
    echo "osx"
fi
