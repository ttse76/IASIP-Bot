const Discord = require('discord.js');
const{
    prefix,
    token,
} = require('./config.json');

const client = new Discord.Client();
const frank = ['suicide', 'pure', 'kids'];
const charlie = ['bitch', 'crabpeople', 'wildcard', 'mom'];
const dennis = ['implication', 'lampshade', 'tools'];
const mac = ['plumber', 'science', 'god'];
const characters = ['charlie', 'mac', 'dennis', 'frank'];

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
    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    if(command.startsWith('help')){
        generateHelp();
        return;
    }
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
    }else if(command.startsWith('charlie')){
        if(!args.length){
            var quote = charlie[Math.floor(Math.random() * charlie.length)];
            playQuote('charlie', quote);
        }
        else{
            var quote = args[0].toLowerCase();

            if(charlie.includes(quote)){
                playQuote('charlie', quote);
            }
            else{
                message.channel.send('Invalid selection');
            }
        }

    }else if(command.startsWith('dennis')){
        if(!args.length){
            var quote = dennis[Math.floor(Math.random() * dennis.length)];
            playQuote('dennis', quote);
        }
        else{
            var quote = args[0].toLowerCase();

            if(dennis.includes(quote)){
                playQuote('dennis', quote);
            }
            else{
                message.channel.send('Invalid selection');
            }
        }
    }else if(command.startsWith('mac')){
        if(!args.length){
            var quote = mac[Math.floor(Math.random() * mac.length)];
            playQuote('mac', quote);
        }
        else{
            var quote = args[0].toLowerCase();

            if(mac.includes(quote)){
                playQuote('mac', quote);
            }
            else{
                message.channel.send('Invalid selection');
            }
        }
    }else{
        message.channel.send('command not valid');
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

    function generateHelp(){
        var out = "     'It's Always Sunny in Philadelphia' Soundboard\nBy Tim Tse\n\n";
        out += 'HOW TO USE:\n';
        out += '--<character> - Play an audio\n';
        out += '--<character> <file> - Play a specific file (extension not required)\n\n';
        out += 'CURRENT COMMANDS\n';
        for(index in characters){
            var charac = characters[index];
            if(charac.startsWith('charlie')){
                out += '--charlie\n';
                var flag = false;
                for(charlieCmd in charlie){
                    if(flag){
                        out += ', ';
                    }
                    out += charlie[charlieCmd];
                    flag = true;
                }
                out += '\n\n';
            }
            else if(charac.startsWith('dennis')){
                out += '--dennis\n';
                var flag = false;
                for(dennisCmd in dennis){
                    if(flag){
                        out += ', ';
                    }
                    out += dennis[dennisCmd];
                    flag = true;
                }
                out += '\n\n';
            }
            else if(charac.startsWith('frank')){
                out += '--frank\n';
                var flag = false;
                for(frankCmd in frank){
                    if(flag){
                        out += ', ';
                    }
                    out += frank[frankCmd];
                    flag = true;
                }
                out += '\n\n';
            }else if(charac.startsWith('mac')){
                out += '--mac\n';
                var flag = false;
                for(macCmd in mac){
                    if(flag){
                        out += ', ';
                    }
                    out += mac[macCmd];
                    flag = true;
                }
                out += '\n\n';
            }
        }
        message.channel.send(out);
    }
});