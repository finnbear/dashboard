fuser -k 8000/tcp
nohup python -m SimpleHTTPServer &
x-www-browser http://localhost:8000
