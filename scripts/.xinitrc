xscreensaver -no-splash

xset s off
xset -dpms
xset s noblank

unclutter -idle 0.1 &
matchbox-window-manager -use_cursor no &

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )" #get this scripts path
exec /usr/bin/chromium --noerrdialogs --kiosk --incognito "$SCRIPTPATH/index.html"