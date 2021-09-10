require('dotenv').config();                                             // Requires the dotenv module. Install with 'npm install -g dotenv'

const { Client, Message } = require('discord.js');                      // Requires the discord.js module. Install with 'npm install discord.js'

const client = new Client();

const PREFIX = process.env.PREFIX;
const BOTCHANNEL = process.env.BOTCHANNEL;
//const BOTCHANNEL = process.env.DEVBOTCHANNEL;                         // Fast switchings between discord channels for the sake of development
const ZAMMADTICKETURL = process.env.ZAMMADTICKETURL;
const ZAMMADUSER = process.env.ZAMMADUSER;
const ZAMMADPASS = process.env.ZAMMADPASS;
const ZAMMADCUSTEMAIL = process.env.ZAMMADCUSTEMAIL;
const ZAMMADTICKETTYPE = process.env.ZAMMADTICKETTYPE;

client.on('ready',() => {
    console.log(`${client.user.tag} has logged in.`);                   // Output that the bot has connected to discord successfully
    client.user.setActivity('Waiting for Complaints');                  // Set bot's status in discord
});

client.on('message', (message) => {

    if(message.content.substring(0, PREFIX.length) != PREFIX) return;   // Don't look at messages shorter than the prefix string
    if(message.author.bot) return;                                      // Don't listen to bots
    if(message.channel.name !== BOTCHANNEL) return;                     // Don't worry about any channels except the one in the BOTCHANNEL variable

        // Tags to be used by curl
        let ticketUserTag = message.author.tag;                         // set ticketUserTag for use in Zammad
        let ticketTitle = `${ticketUserTag} request: `;
        let ticketUserMessage = message.content.substring((PREFIX.length) + 1);
        console.log(`[${ticketUserTag}]: ${ticketUserMessage}`);
        // end of curl tags

        // setup for curl, converted from https://curl.trillworks.com/#node-request
        var request = require('request');                               // Requires the node module request. Install with 'npm install -g request'
        var headers = {
            'Content-Type': 'application/json'
        };
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        };
        var dataString = `{"title":"${ticketTitle}${ticketUserMessage.substring(0, 30)}","group": "Users","article":{"subject":"Fix it!","body":"[${ticketUserTag}]: ${ticketUserMessage}","type":"${ZAMMADTICKETTYPE}","internal":false},"customer":"${ZAMMADCUSTEMAIL}","note": "Things"}`;

        var options = {
            url: ZAMMADTICKETURL,
            method: 'POST',
            headers: headers,
            body: dataString,
            auth: {
                'user': ZAMMADUSER,
                'pass': ZAMMADPASS
            }
        };

        request(options, callback);
        // end of curl setup

        message.channel.send(`\`\`\`[${ticketUserTag}]: has submitted a ticket\`\`\``); // message in channel to let people know the ticket has been submitted
});

client.login(process.env.DISCORD_BOT_TOKEN);
