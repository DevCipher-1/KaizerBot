# Create directory structure
New-Item -ItemType Directory -Path "discord-bot/commands"
New-Item -ItemType Directory -Path "discord-bot/events"
New-Item -ItemType Directory -Path "discord-bot/utils"
New-Item -ItemType Directory -Path "discord-bot/data"

# Create basic files
New-Item -ItemType File -Path "discord-bot/index.js"
New-Item -ItemType File -Path "discord-bot/config.json"
New-Item -ItemType File -Path "discord-bot/README.md"
New-Item -ItemType File -Path "discord-bot/commands/ping.js"
New-Item -ItemType File -Path "discord-bot/commands/welcome.js"
New-Item -ItemType File -Path "discord-bot/commands/role.js"
New-Item -ItemType File -Path "discord-bot/events/guildMemberAdd.js"
New-Item -ItemType File -Path "discord-bot/events/guildMemberRemove.js"
New-Item -ItemType File -Path "discord-bot/events/messageCreate.js"

# Write basic content to config.json
$configContent = @'
{
  "token": "YOUR_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  "guildId": "YOUR_GUILD_ID",
  "inviteLink": "YOUR_INVITE_LINK",
  "mongoURI": "YOUR_MONGO_URI"
}
'@
Set-Content -Path "discord-bot/config.json" -Value $configContent

# Write basic content to index.js
$indexContent = @'
const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once("ready", () => {
  console.log("Bot is online!");
});

client.login(token);
'@
Set-Content -Path "discord-bot/index.js" -Value $indexContent

# Initialize npm and install packages
cd discord-bot
npm init -y
npm install discord.js mongoose express

# Create MongoDB connection script
$mongoContent = @'
const mongoose = require("mongoose");
const { mongoURI } = require("./config.json");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB: ", err);
});
'@
Set-Content -Path "utils/mongo.js" -Value $mongoContent

Write-Host "Project setup completed. Remember to replace placeholder values in config.json!"
