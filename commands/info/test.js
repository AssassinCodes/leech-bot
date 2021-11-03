const { Message, Client } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "time",
    aliases: ["t"],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (!message.author.id === "535190610185945138") return;
        console.log(ms("5 minutes") / 1000);
        console.log();
        message.channel.send({ content: `<t:${Math.round(Date.now() / 1000) + ms("5 minutes") / 1000}:R>` });
    },
};
