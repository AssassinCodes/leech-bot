const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const moment = require("moment");
const client = require("../index");
const leechSchema = require("../models/leech");

client.on("interactionCreate", async (interaction) => {
    try {
        if (!interaction.isButton()) return;
        fetchedleech = await leechSchema.find({ "leeches.messageId": interaction.message.id }, { _id: 0, leeches: { $elemMatch: { messageId: interaction.message.id } } });

        if (
            (fetchedleech[0].leeches[0].claimerFirst === interaction.user.id && interaction.customId === "2-spot") ||
            (fetchedleech[0].leeches[0].claimerFirst === interaction.user.id && interaction.customId === "3-spot")
        ) {
            return interaction.deferUpdate();
        }

        if (
            (fetchedleech[0].leeches[0].claimerSecond === interaction.user.id && interaction.customId === "1-spot") ||
            (fetchedleech[0].leeches[0].claimerSecond === interaction.user.id && interaction.customId === "3-spot")
        ) {
            return interaction.deferUpdate();
        }

        if (
            (fetchedleech[0].leeches[0].claimerThird === interaction.user.id && interaction.customId === "1-spot") ||
            (fetchedleech[0].leeches[0].claimerThird === interaction.user.id && interaction.customId === "2-spot")
        ) {
            return interaction.deferUpdate();
        }

        if (interaction.customId === "1-spot") {
            leech = fetchedleech[0].leeches[0];
            if (!leech.claimedFirst) {
                await leechSchema.findOneAndUpdate(
                    { "leeches.messageId": leech.messageId },
                    {
                        $set: {
                            "leeches.$.claimedFirst": true,
                            "leeches.$.claimerFirst": interaction.user.id,
                        },
                    }
                );

                const MainEmbed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription(`**Ending In: **<t:${leech.time}:R>\n**Description:**\n>>> ${leech.description}`)
                    .setTimestamp()
                    .setFooter("Developed By Assassinツ#2020", client.users.cache.get("535190610185945138").displayAvatarURL({ dynamic: true }))
                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                    .setThumbnail("https://cdn.discordapp.com/attachments/875330855185289287/903392912161767454/653137478240174101.png");

                const row = new MessageActionRow();

                row.addComponents(new MessageButton().setCustomId(`1-spot`).setLabel(`Spot 1`).setStyle("DANGER"));
                MainEmbed.addField(`**Spot 1:**`, `${client.users.cache.get(interaction.user.id)}`, true);

                if (leech.spots > 1) {
                    if (leech.claimedSecond) {
                        row.addComponents(new MessageButton().setCustomId(`2-spot`).setLabel(`Spot 2`).setStyle("DANGER"));
                        MainEmbed.addField(`**Spot 2:**`, `${client.users.cache.get(leech.claimerSecond)}`, true);
                    } else {
                        MainEmbed.addField(`**Spot 2:**`, "Available", true);
                        row.addComponents(new MessageButton().setCustomId(`2-spot`).setLabel(`Spot 2`).setStyle("SUCCESS"));
                    }
                }
                if (leech.spots > 2) {
                    if (leech.claimedThird) {
                        row.addComponents(new MessageButton().setCustomId(`3-spot`).setLabel(`Spot 3`).setStyle("DANGER"));
                        MainEmbed.addField(`**Spot 3:**`, `${client.users.cache.get(leech.claimerThird)}`, true);
                    } else {
                        MainEmbed.addField(`**Spot 3:**`, "Available", true);
                        row.addComponents(new MessageButton().setCustomId(`3-spot`).setLabel(`Spot 3`).setStyle("SUCCESS"));
                    }
                }

                interaction.deferUpdate();
                interaction.message.edit({ embeds: [MainEmbed], components: [row] });
            } else if (leech.claimedFirst && leech.claimerFirst === interaction.user.id) {
                await leechSchema.findOneAndUpdate(
                    { "leeches.messageId": leech.messageId },
                    {
                        $set: {
                            "leeches.$.claimedFirst": false,
                            "leeches.$.claimerFirst": null,
                        },
                    }
                );

                const MainEmbed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription(`**Ending In: **<t:${leech.time}:R>\n**Description:**\n>>> ${leech.description}`)
                    .setTimestamp()
                    .setFooter("Developed By Assassinツ#2020", client.users.cache.get("535190610185945138").displayAvatarURL({ dynamic: true }))
                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                    .setThumbnail("https://cdn.discordapp.com/attachments/875330855185289287/903392912161767454/653137478240174101.png");

                const row = new MessageActionRow();

                row.addComponents(new MessageButton().setCustomId(`1-spot`).setLabel(`Spot 1`).setStyle("SUCCESS"));
                MainEmbed.addField(`**Spot 1:**`, "Available", true);

                if (leech.spots > 1) {
                    if (leech.claimedSecond) {
                        row.addComponents(new MessageButton().setCustomId(`2-spot`).setLabel(`Spot 2`).setStyle("DANGER"));
                        MainEmbed.addField(`**Spot 2:**`, `${client.users.cache.get(leech.claimerSecond)}`, true);
                    } else {
                        MainEmbed.addField(`**Spot 2:**`, "Available", true);
                        row.addComponents(new MessageButton().setCustomId(`2-spot`).setLabel(`Spot 2`).setStyle("SUCCESS"));
                    }
                }
                if (leech.spots > 2) {
                    if (leech.claimedThird) {
                        row.addComponents(new MessageButton().setCustomId(`3-spot`).setLabel(`Spot 3`).setStyle("DANGER"));
                        MainEmbed.addField(`**Spot 3:**`, `${client.users.cache.get(leech.claimerThird)}`, true);
                    } else {
                        MainEmbed.addField(`**Spot 3:**`, "Available", true);
                        row.addComponents(new MessageButton().setCustomId(`3-spot`).setLabel(`Spot 3`).setStyle("SUCCESS"));
                    }
                }

                interaction.deferUpdate();
                interaction.message.edit({ embeds: [MainEmbed], components: [row] });
            } else {
                interaction.deferUpdate();
            }
        }
        if (interaction.customId === "2-spot") {
            leech = fetchedleech[0].leeches[0];

            if (!leech.claimedSecond) {
                await leechSchema.findOneAndUpdate(
                    { "leeches.messageId": leech.messageId },
                    {
                        $set: {
                            "leeches.$.claimedSecond": true,
                            "leeches.$.claimerSecond": interaction.user.id,
                        },
                    }
                );

                const MainEmbed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription(`**Ending In: **<t:${leech.time}:R>\n**Description:**\n>>> ${leech.description}`)
                    .setTimestamp()
                    .setFooter("Developed By Assassinツ#2020", client.users.cache.get("535190610185945138").displayAvatarURL({ dynamic: true }))
                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                    .setThumbnail("https://cdn.discordapp.com/attachments/875330855185289287/903392912161767454/653137478240174101.png");

                const row = new MessageActionRow();

                if (leech.claimedFirst) {
                    row.addComponents(new MessageButton().setCustomId(`1-spot`).setLabel(`Spot 1`).setStyle("DANGER"));
                    MainEmbed.addField(`**Spot 1:**`, `${client.users.cache.get(leech.claimerFirst)}`, true);
                } else {
                    MainEmbed.addField(`**Spot 1:**`, "Available", true);
                    row.addComponents(new MessageButton().setCustomId(`1-spot`).setLabel(`Spot 1`).setStyle("SUCCESS"));
                }

                row.addComponents(new MessageButton().setCustomId(`2-spot`).setLabel(`Spot 2`).setStyle("DANGER"));
                MainEmbed.addField(`**Spot 2:**`, `${client.users.cache.get(interaction.user.id)}`, true);

                if (leech.spots > 2) {
                    if (leech.claimedThird) {
                        row.addComponents(new MessageButton().setCustomId(`3-spot`).setLabel(`Spot 3`).setStyle("DANGER"));
                        MainEmbed.addField(`**Spot 3:**`, `${client.users.cache.get(leech.claimerThird)}`, true);
                    } else {
                        MainEmbed.addField(`**Spot 3:**`, "Available", true);
                        row.addComponents(new MessageButton().setCustomId(`3-spot`).setLabel(`Spot 3`).setStyle("SUCCESS"));
                    }
                }

                interaction.deferUpdate();
                interaction.message.edit({ embeds: [MainEmbed], components: [row] });
            } else if (leech.claimedSecond && leech.claimerSecond === interaction.user.id) {
                await leechSchema.findOneAndUpdate(
                    { "leeches.messageId": leech.messageId },
                    {
                        $set: {
                            "leeches.$.claimedSecond": false,
                            "leeches.$.claimerSecond": null,
                        },
                    }
                );

                const MainEmbed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription(`**Ending In: **<t:${leech.time}:R>\n**Description:**\n>>> ${leech.description}`)
                    .setTimestamp()
                    .setFooter("Developed By Assassinツ#2020", client.users.cache.get("535190610185945138").displayAvatarURL({ dynamic: true }))
                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                    .setThumbnail("https://cdn.discordapp.com/attachments/875330855185289287/903392912161767454/653137478240174101.png");

                const row = new MessageActionRow();

                if (leech.claimedFirst) {
                    row.addComponents(new MessageButton().setCustomId(`1-spot`).setLabel(`Spot 1`).setStyle("DANGER"));
                    MainEmbed.addField(`**Spot 1:**`, `${client.users.cache.get(leech.claimerFirst)}`, true);
                } else {
                    MainEmbed.addField(`**Spot 1:**`, "Available", true);
                    row.addComponents(new MessageButton().setCustomId(`1-spot`).setLabel(`Spot 1`).setStyle("SUCCESS"));
                }

                row.addComponents(new MessageButton().setCustomId(`2-spot`).setLabel(`Spot 2`).setStyle("SUCCESS"));
                MainEmbed.addField(`**Spot 2:**`, "Available", true);

                if (leech.spots > 2) {
                    if (leech.claimedThird) {
                        row.addComponents(new MessageButton().setCustomId(`3-spot`).setLabel(`Spot 3`).setStyle("DANGER"));
                        MainEmbed.addField(`**Spot 3:**`, `${client.users.cache.get(leech.claimerThird)}`, true);
                    } else {
                        MainEmbed.addField(`**Spot 3:**`, "Available", true);
                        row.addComponents(new MessageButton().setCustomId(`3-spot`).setLabel(`Spot 3`).setStyle("SUCCESS"));
                    }
                }

                interaction.deferUpdate();
                interaction.message.edit({ embeds: [MainEmbed], components: [row] });
            } else {
                interaction.deferUpdate();
            }
        }
        if (interaction.customId === "3-spot") {
            leech = fetchedleech[0].leeches[0];
            if (!leech.claimedThird) {
                await leechSchema.findOneAndUpdate(
                    { "leeches.messageId": leech.messageId },
                    {
                        $set: {
                            "leeches.$.claimedThird": true,
                            "leeches.$.claimerThird": interaction.user.id,
                        },
                    }
                );

                const MainEmbed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription(`**Ending In: **<t:${leech.time}:R>\n**Description:**\n>>> ${leech.description}`)
                    .setTimestamp()
                    .setFooter("Developed By Assassinツ#2020", client.users.cache.get("535190610185945138").displayAvatarURL({ dynamic: true }))
                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                    .setThumbnail("https://cdn.discordapp.com/attachments/875330855185289287/903392912161767454/653137478240174101.png");

                const row = new MessageActionRow();

                if (leech.claimedFirst) {
                    row.addComponents(new MessageButton().setCustomId(`1-spot`).setLabel(`Spot 1`).setStyle("DANGER"));
                    MainEmbed.addField(`**Spot 1:**`, ` ${client.users.cache.get(leech.claimerFirst)}`, true);
                } else {
                    MainEmbed.addField(`**Spot 1:**`, "Available", true);
                    row.addComponents(new MessageButton().setCustomId(`1-spot`).setLabel(`Spot 1`).setStyle("SUCCESS"));
                }

                if (leech.spots > 1) {
                    if (leech.claimedSecond) {
                        row.addComponents(new MessageButton().setCustomId(`2-spot`).setLabel(`Spot 2`).setStyle("DANGER"));
                        MainEmbed.addField(`**Spot 2:**`, ` ${client.users.cache.get(leech.claimerSecond)}`, true);
                    } else {
                        MainEmbed.addField(`**Spot 2:**`, "Available", true);
                        row.addComponents(new MessageButton().setCustomId(`2-spot`).setLabel(`Spot 2`).setStyle("SUCCESS"));
                    }
                }

                row.addComponents(new MessageButton().setCustomId(`3-spot`).setLabel(`Spot 3`).setStyle("DANGER"));
                MainEmbed.addField(`**Spot 3:**`, ` ${client.users.cache.get(interaction.user.id)}`, true);

                interaction.deferUpdate();
                interaction.message.edit({ embeds: [MainEmbed], components: [row] });
            } else if (leech.claimedThird && leech.claimerThird === interaction.user.id) {
                await leechSchema.findOneAndUpdate(
                    { "leeches.messageId": leech.messageId },
                    {
                        $set: {
                            "leeches.$.claimedThird": false,
                            "leeches.$.claimerThird": null,
                        },
                    }
                );
                const MainEmbed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription(`**Ending In: **<t:${leech.time}:R>\n**Description:**\n>>> ${leech.description}`)
                    .setTimestamp()
                    .setFooter("Developed By Assassinツ#2020", client.users.cache.get("535190610185945138").displayAvatarURL({ dynamic: true }))
                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                    .setThumbnail("https://cdn.discordapp.com/attachments/875330855185289287/903392912161767454/653137478240174101.png");

                const row = new MessageActionRow();

                if (leech.claimedFirst) {
                    row.addComponents(new MessageButton().setCustomId(`1-spot`).setLabel(`Spot 1`).setStyle("DANGER"));
                    MainEmbed.addField(`**Spot 1:**`, ` ${client.users.cache.get(leech.claimerFirst)}`, true);
                } else {
                    MainEmbed.addField(`**Spot 1:**`, "Available", true);
                    row.addComponents(new MessageButton().setCustomId(`1-spot`).setLabel(`Spot 1`).setStyle("SUCCESS"));
                }

                if (leech.spots > 1) {
                    if (leech.claimedSecond) {
                        row.addComponents(new MessageButton().setCustomId(`2-spot`).setLabel(`Spot 2`).setStyle("DANGER"));
                        MainEmbed.addField(`**Spot 2:**`, ` ${client.users.cache.get(leech.claimerSecond)}`, true);
                    } else {
                        MainEmbed.addField(`**Spot 2:**`, "Available", true);
                        row.addComponents(new MessageButton().setCustomId(`2-spot`).setLabel(`Spot 2`).setStyle("SUCCESS"));
                    }
                }

                row.addComponents(new MessageButton().setCustomId(`3-spot`).setLabel(`Spot 3`).setStyle("SUCCESS"));
                MainEmbed.addField(`**Spot 3:**`, `Available`, true);

                interaction.deferUpdate();
                interaction.message.edit({ embeds: [MainEmbed], components: [row] });
            } else {
                interaction.deferUpdate();
            }
        }
    } catch {
        interaction.deferUpdate();
    }
});
