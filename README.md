# whatsapp-chat-bot

# Technology
1. Node.js
2. MySQL
3. Twilio
4. Ngrok
5. Heroku

# Installation
1. Download the zip file or clone the repo in your desired directory.
2. Open the directory and run npm install.
3. Run npm start to start the server

# Ngrok
If you don't want to host your code anywhere use Ngrok to test your app.
1. Download ngrok from https://ngrok.com/download
2. Open a new terminal and run ./ngrok http 3000. Choose your desired port to run the server.

# Heroku
You can also host your code on heroku and run your app.
Just deploy your app on heroku and copy the home page(usually '/')

# Twilio
Sign up on Twilio and set up a whatsapp sand-box.
In the webhook settings just add the route:
1. Ngrok - copy from the terminal and add /sms at last
2. Heroku - copy the home page route and add /sms at the last.
