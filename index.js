const Discord = require('discord.js');
const{
    prefix,
    token,
} = require('./config.json');

const client = new Discord.Client();
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