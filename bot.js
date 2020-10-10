const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var discord = require("discord.js");
var fs = require("fs");
var randomColour = require("randomcolor"); // yes, the creator of this package does not speak the real english
var Config = require("./config.json");
var prefix = process.env.PREFIX;

class Bot {
  constructor() {
    this.servers = require("./servers.json");
    this.discordClient = new discord.Client({ sync: true });

    this.discordClient.on("ready", () => {
      this.discordClient.user.setActivity("r!invite | TEN Rainbow", {
        type: "PLAYING"
      });
      this.initialize();
    });

    this.discordClient.on("message", msg => {
      this.processMessage(msg);
    });

    this.discordClient.login("NzY0NDg1MzQyMTY5NjYxNDcx.X4G8dQ.Evg3WUyt4BSZfjc21MouLhD_13Y");//wait
  }

  initialize() {
    this.log("Connected to discord.");

    setInterval(() => {
      this.randomizeRoleColors();
    }, Config.randomize_delay * 1000);
  }

  processMessage(msg) {
    if (msg.content.startsWith(`${prefix}addrole`)) {
      for (var role of msg.mentions.roles.array()) {
        msg
          .reply("☑️ Added `" + role.name + "` to list of rainbow roles.")
          .then(m => m.react("🌈"));

        this.addRainbowRole(msg.guild.id, role.id);
      }
    }
  }


  processMessage(msg) {
    if (msg.content.startsWith(`${prefix}invite`)) {
      msg.author.send(
        "https://discord.com/api/oauth2/authorize?client_id=720328892388474910&permissions=8&scope=bot"
      );
      msg.reply(`\`\`\`
📤 [ INVITE LINK ] has been send to your privite message.
\`\`\``);
    }
  }

  randomizeRoleColors() {
    for (var server in this.servers) {
      var liveGuild = this.discordClient.guilds.get(server);

      if (!liveGuild) {
        this.error(
          "Guild with ID " +
            server +
            " no longer exists or the bot has been removed from it."
        );
        continue;
      }

      for (var role of this.servers[server]) {
        var liveRole = liveGuild.roles.get(role);

        liveRole.setColor(randomColour(), "https://discord.gg/VYRyTJ3");
      }
    }
  }

  addRainbowRole(guild, role) {
    if (this.servers[guild] == undefined) {
      this.servers[guild] = [];
    }

    for (var existingRole of this.servers[guild]) {
      if (existingRole == role) {
        return "That role has already been added.";
      }
    }

    this.servers[guild].push(role);
    this.saveServers();
  }

  removeRainbowRole(guild, role) {
    if (this.servers[guild] == undefined) {
      this.servers[guild] = [];
    }

    this.servers[guild].push(role);
    this.saveServers();
  }

  saveServers() {
    fs.writeFileSync("./servers.json", JSON.stringify(this.servers), "utf8");
    this.log("Saved servers file.");
  }

  log(message) {
    console.log("\x1b[32mINFO\x1b[37m - \x1b[0m" + message);
  }

  error(message) {
    console.log("\x1b[31mERROR\x1b[37m - \x1b[0m" + message);
  }
}

var instance = new Bot();
