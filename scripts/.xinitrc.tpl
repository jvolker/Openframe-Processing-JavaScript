xscreensaver -no-splash

xset s off
xset -dpms
xset s noblank

unclutter -idle 0.1 &
matchbox-window-manager -use_cursor no &

exec /usr/bin/chromium --noerrdialogs --kiosk --incognito --allow-file-access-from-files "$sketchPath/index.html" #--remote-debugging-port=9222