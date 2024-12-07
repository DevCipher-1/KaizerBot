#!/bin/bash

# Create directory structure
mkdir -p discord-bot/{commands,events,utils,data}

# Create basic files
touch discord-bot/{index.js,config.json,README.md}
touch discord-bot/commands/{ping.js,welcome.js,role.js}
touch discord-bot/events/{guildMemberAdd.js,guildMemberRemove.js,messageCreate.js}

# Write basic content to config.json
echo '{
  "token": "YOUR_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  "guildId": "YOUR_GUILD_ID",
  "inviteLink": "YOUR_INVITE_LINK",
  "mongoURI": "YOUR_MONGO_URI"
}' > discord-bot/config.json

# Write basic content to index.js
echo 'const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once("ready", () => {
  console.log("Bot is online!");
});

client.login(token);
' > discord-bot/index.js

# Install necessary npm packages
cd discord-bot
npm init -y
npm install discord.js mongoose express

# Create package.json script for MongoDB connection
echo 'const mongoose = require("mongoose");
const { mongoURI } = require("./config.json");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB: ", err);
});
' > utils/mongo.js

# Make setup.sh executable
chmod +x setup.sh

echo "Project setup completed. Remember to replace placeholder values in config.json!"
