const Discord = require('discord.js');
const{
    prefix,
    token,
} = require('./config.json');

const client = new Discord.Client();
const frank = ['suicide', 'pure', 'kids'];

client.login(token);

client.once('ready', () => {
    console.log('Ready!');
});

client.once('reconnecting', () => {
    console.log('Reconnecting...');
});

client.once('disconnecting', () => {
    console.log("Disconnecting :(");
});

client.on('message', async message => {
    if(message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    const voiceChannel = message.member.voice.channel;
    if(!voiceChannel){
        return message.channel.send("You need to be in a voice channel");
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "Bot requires permissions to join and speak in your voice channel"
        );
    }
    if(!message.content.startsWith(prefix)) return;

    if(command.startsWith('frank')){
        if(!args.length){
            var quote = frank[Math.floor(Math.random() * frank.length)];
            playQuote('frank', quote);
        }
        else{
            var quote = args[0].toLowerCase();
            if(frank.includes(quote)){
                playQuote('frank', quote);
            }
            else{
                message.channel.send('Invalid selection');
            }
        }
    }else{
        message.channel.send('character not valid');
    }

    function playQuote(character, quote){
        var quoteFile = 'audio/' + character + '/' + quote + '.mp3';
        
        try{
            voiceChannel.join().then(connection => {
                connection.play(quoteFile).on('finish', () => {
                    voiceChannel.leave();
                });
                
            });
            
        }catch(err){
            return message.channel.send(err);
        }
    }
});