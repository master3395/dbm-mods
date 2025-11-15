module.exports = {
    run: (DBM, req, res, Dashboard, server) => {
        const Discord = require("discord.js")
        let channel;

        try {
            if (!server) {
                if (req.body.serverType == 'id') server = DBM.Bot.bot.guilds.cache.find(server => server.id === req.body.server);
                if (!server) server = DBM.Bot.bot.guilds.cache.find(server => server.name === req.body.server);
                if (!server) return 'I couldn\'t find this server, please make sure you have the right ID or name.';
            }
    
            if (req.body.channelType == 'id') channel = server.channels.find(channel => channel.id === req.body.channel);
            if (!channel) channel = DBM.Bot.bot.guilds.cache.find(channel => channel.name === req.body.channel);
            if (!channel) return 'I couldn\'t find this channel, please make sure you have the right ID or name.';
    
            const embed = new Discord.RichEmbed()
                .setColor(req.body.color)
                .setTitle(req.body.title)
                .setURL(req.body.url)
                .setAuthor({ name: req.body.author$(if(req.body.authorpic){", iconURL: req.body.authorpic"})$(if(){", url: "}) })
                .setDescription(req.body.description)
                .setThumbnail(req.body.thumb)
                .setImage(req.body.image)
                .setFooter({ text: req.body.footer$(if(req.body.footerurl){", iconURL: req.body.footerurl"}) });
            channel.send(embed);
    
            return `Successfully sent the embed to ${server.name}`;
        } catch (error) {
            console.log(error)
            return 'We ran into an error.';
        }
    }
};
