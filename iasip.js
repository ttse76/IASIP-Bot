const Discord = require('discord.js');
const{
    prefix,
    token,
} = require('./config.json');

const client = new Discord.Client();
const info = require('./info.json');
var characters = [];
var audioFiles = new Map();

client.login(token);

client.once('ready', () => {
    try{
        proccessJSON();
    }catch(err){
        console.log(err);
        return;
    }
    console.log('Ready!');
});

function proccessJSON(){
    console.log('Processing audio info...');
    characters = info.characters;
    let audioInfo = info.audio;
    for(let i = 0; i < characters.length; i++){
        let char = characters[i];
        audioFiles.set(char, audioInfo[char]);
    }
    return;
}

client.once('reconnecting', () => {
    console.log('Reconnecting...');
});

client.once('disconnecting', () => {
    console.log("Disconnecting :(");
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    const messageArr = message.content.slice(prefix.length).trim().split(' ');
    const command = messageArr.shift().toLowerCase();
    var arg = '';
    if(messageArr.length > 0){
        arg = messageArr[0];
    }
    
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
    if(verifyRequest(command, arg)){
        playQuote(command, arg);
        return;
    }
    else{
        return message.channel.send('Command not valid');
    }

    function verifyRequest(command, arg){
        if(!characters.includes(command)){
            return false;
        }
        let charAudio = audioFiles.get(command);
        if(arg && !charAudio.includes(arg)){
            return false;
        }
        return true;
    }

    function playQuote(character, quote){
        var quoteFile = 'audio/' + character;
        if(arg){
            quoteFile += '/' + quote + '.mp3';
        }else{
            let quoteFiles = audioFiles.get(character);
            let selected = quoteFiles[Math.floor(Math.random() * quoteFiles.length)]
            quoteFile += '/' + selected + '.mp3'; 
        }
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
        var out = "     'It's Always Sunny in Philadelphia' Soundboard\n";
        out += 'HOW TO USE:\n';
        out += '--<character> - Play an audio\n';
        out += '--<character> <file> - Play a specific file (extension not required)\n\n';
        out += 'CURRENT COMMANDS\n';
        for(let i in characters){
            let char = characters[i];
            let charArr = audioFiles.get(char);
            out += '--' + char + '\n';
            let flag = true;
            for(let j in charArr){
                if(!flag){
                    out += ', ';
                }
                out += charArr[j];
                flag = false;
            }
            out += '\n\n'
        }
        message.channel.send(out);
    }
});