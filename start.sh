
echo "Getting latest version of Mewbot"
rm -rf /home/app/mewbot

cd /home/app && git clone https://github.com/akrck02/mewbot.git
ls -lha /home/app/mewbot
cd mewbot

echo "Installing dependencies"
npm install 

echo "Starting Mewbot"
node index.js
