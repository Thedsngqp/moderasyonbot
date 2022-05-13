const { Client, Collection, Intents } = require("discord.js");
const client = global.client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
    ]
});
const dotenv = require("dotenv");
dotenv.config();
const { readdir } = require("fs");
require("moment-duration-format");
const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection();
client.cooldown = new Map();
client.commandblocked = [];

require("./gomutlar/helpers/function")(client);

readdir("./gomutlar/commands/", (err, files) => {
    if (err) console.error(err)
    files.forEach(f => {
        readdir("./gomutlar/commands/" + f, (err2, files2) => {
            if (err2) console.log(err2)
            files2.forEach(file => {
                let prop = require(`./gomutlar/commands/${f}/` + file);
                console.log(` ${prop.name} yüklendi!`);
                commands.set(prop.name, prop);
                prop.aliases.forEach(alias => {
                    aliases.set(alias, prop.name);
                });
            });
        });
    });
});

readdir("./gomutlar/events", (err, files) => {
    if (err) return console.error(err);
    files.filter((file) => file.endsWith(".js")).forEach((file) => {
        let prop = require(`./gomutlar/events/${file}`);
        if (!prop.conf) return;
        client.on(prop.conf.name, prop);
        console.log(`${prop.conf.name} yüklendi!`);
    });
});

client.login("OTM4NDI1MjM0ODE2NjUxMzQ0.Gn_K80.pDlpbI56iyvG7Al2kc0W90mSktAf4R0aTzw6-A")
    .then(() => console.log(`Bot ${client.user.username} olarak giriş yaptı!`))
    .catch((err) => console.log(`Bot Giriş yapamadı sebep: ${err}`));