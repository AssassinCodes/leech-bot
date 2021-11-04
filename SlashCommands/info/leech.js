const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const ms = require("ms");
const leech = require("../../models/leech");

module.exports = {
    name: "leech",
    description: "send a message for leeching",
    options: [
        {
            name: "spots",
            description: "how many spots do you have available",
            required: true,
            type: "NUMBER",
        },
        {
            name: "time",
            description: "How long left on the mission until it ends",
            required: true,
            type: "STRING",
        },
        {
            name: "description",
            description: "What are you hosting",
            required: true,
            type: "STRING",
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        try {
            if (interaction.channel.id !== "848208084136624138") return interaction.followUp({ content: "You can only use this command in <#848208084136624138>" });
            spots = interaction.options.getNumber("spots");
            time = interaction.options.getString("time");
            desc = interaction.options.getString("description");
            const row = new MessageActionRow();
            
            if(!time.includes(":")) return interaction.deferUpdate();
            splitted = time.split(":");
            
            time = `${parseInt(splitted[0]) + parseInt(splitted[1])/60}m`;

            if (spots > 3 || spots < 1 || isNaN(spots)) {
                return interaction.followUp({ embeds: [new MessageEmbed().setColor("RED").setDescription("Maximum number of spots is 3")] });
            }

            for (let i = 0; i < spots; i++) {
                row.addComponents(
                    new MessageButton()
                        .setCustomId(`${i + 1}-spot`)
                        .setLabel(`Spot ${i + 1}`)
                        .setEmoji("")
                        .setStyle("SUCCESS")
                );
            }

            num = Math.round(Date.now() / 1000) + parseInt(ms(time) / 1000);
            const MainEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`**Ending In: **<t:${num}:R>\n**Description:**\n>>> ${desc}`)
                .setTimestamp()
                .setFooter("Developed By Assassinツ#2020", client.users.cache.get("535190610185945138").displayAvatarURL({ dynamic: true }))
                .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                .setThumbnail("https://cdn.discordapp.com/attachments/875330855185289287/903392912161767454/653137478240174101.png");

            for (let i = 0; i < spots; i++) {
                MainEmbed.addField(`**Spot ${i + 1}:**`, "Available", true);
            }
            interaction
                .followUp({ embeds: [MainEmbed], components: [row] })
                .then(async (msg) => {
                    const obj = {
                        messageId: msg.id,
                        spots,
                        time: num,
                        description: desc,
                        claimedFirst: false,
                        claimedSecond: false,
                        claimedThird: false,
                        claimerFirst: null,
                        claimerSecond: null,
                        claimerThird: null,
                    };

                    const schema = await leech.findOne({});
                    if (!schema) {
                        await leech.create({
                            leeches: [obj],
                        });
                    } else {
                        schema.leeches.push(obj);
                        await schema.save();
                    }

                    setTimeout(
                        async () => {
                            await leech.findOneAndUpdate(
                                { "leeches.messageId": msg.id },
                                {
                                    $pull: {
                                        leeches: {
                                            messageId: msg.id,
                                        },
                                    },
                                }
                            );
                        },
                        !isNaN(ms(time) + 1000) ? ms(time) + 1000 : 5 * 60 * 1000
                    );
                })
                .catch(console.log);
            interaction.channel.send({ content: `<@&848196488453423114>, a new leech from ${interaction.user}` });
        } catch {
            interaction.deferUpdate();
        }
    },
};
