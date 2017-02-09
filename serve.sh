fuser -k 8000/tcp
nohup python serve.py &
x-www-browser http://localhost:8000
