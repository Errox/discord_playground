// requirements
"use strict";
var Discord = require('discord.js');
var request = require("request");
var config = require('./config.json');

//setup client and other scripts
var client = new Discord.Client();

client.on('ready', () => {
    console.log("Discord library is loaded and injected in the channel.");
    client.user.setGame('your mom');
    console.log(`Logged in as ${client.user.tag}!`);
});

var mysql = require('mysql');
var fullMessage;
var base = "offline";
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "discord"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Mysql server is connected.");
  base = "Online";
});

client.on("channel", channel => {
    console.log(channel);
});

client.on('message', message => {
    fullMessage = message.content.split(" ");
    if(fullMessage[0].indexOf("/") > -1){
        switch (fullMessage[0]) {
            case "/help":
                message.channel.send(' This is the help menu. \n/ping \t| Used to test if I\'m online. \n/pong \t| Used to kill me. \n/daisy \t| A extreme high quality rocket ship. \n ');
                break;

            case "/ping":
                message.channel.send('pong');
                break;

            case "/pong":
                message.channel.send('ping');
                break;

            case "/daisy":
                if(message.author.username === "SinisterousJ"){
                    message.reply('Nee, jij mag niet');    
                }else{
                    message.channel.send('8============================D ~~~~~~ ROCKET SHIP');
                }
                break;

            case "/status":
                if(message.author.username === "Errox505" || message.author.username === "flamefirenut"){
                    message.channel.send('Mysql\t:\t'+base);
                    message.channel.send('Bot\t\t :\tDat zie je toch');
                    message.channel.send('Mysql connected with id ' + con.threadId);
                    message.channel.send('Mysql Table : ' + con.database + ' is used');
                }else{
                    message.reply('heeft geen permissies om deze functie te gebruiken');
                }
                break;

            case "/showRespect":
                con.query("SELECT * FROM respect WHERE username = '" + message.author.username+"'", function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        con.query("INSERT INTO respect (username) VALUES ("+message.author.username+")", function (error,results, field){
                            if(error){
                                message.reply('heeft het systeem gebroken, er is een message naar de admin gestuurd. err(1)');
                            }else{
                                message.channel.send('Je bent succesvol aangemeld.');
                            }
                        });
                        message.reply('heeft geen respect. Arme nub');
                    }else{
                        message.reply('heeft ' + results[0].respect_amount +' respect.');
                    }
                });    
            break;

            case "/respect":
                if(fullMessage[1]){
                    if(fullMessage){
                        con.query("SELECT * FROM respect WHERE username = '" + fullMessage[1] +"'", function (error, results, fields) {
                            if(results.length > 0){
                                var amount_respect = results[0].respect_amount;
                                if(amount_respect === 2147483647){
                                    amount_respect = 0; 
                                }else{
                                    amount_respect++;
                                }
                                console.log(message.author.username.toLowerCase());
                                console.log('----------------------------------');
                                console.log(fullMessage[1].toLowerCase());
                                //if(!message.author.username.toLowerCase() === fullMessage[1].toLowerCase()){
                                    con.query("UPDATE respect SET respect_amount = " + amount_respect + " WHERE username = '" +fullMessage[1]+"'", function(error, results, field){
                                        if (error){
                                            message.reply(' heeft het systeem gebroken en bedank hem maar met een diepzinnige poezie van kippengaas. err(4)');
                                        }else{
                                            message.reply(' heeft respect gestuurd naar '+fullMessage[1]+' en heeft nu ' + amount_respect + ' respect.');
                                        }
                                    });
                                // }else{
                                //     message.reply(' heeft geprobeerd zichzelf respect te geven. How sad...');
                                // }
                            }else{
                                message.channel.send('Er zijn nog geen users aangemaakt, geef 5 euro aan de botgoden om je eigen naam te creeeren.');
                            }
                        });
                    }
                }else{
                    message.reply(' snapt het weer eens niet en was vergeten om een gebruikers naam in te vullen');
                }
            break;

            case "/highscore":
                con.query("SELECT * FROM respect ORDER BY respect_amount desc", function(error, results, fields){
                    if(results.length > 0){
                        for (var index = 0; index < results.length; index++) {
                            var nummer = index + 1;
                            message.channel.send(nummer + ': \t'+ results[index].username + ' met '+ results[index].respect_amount + ' respect punten.');
                        }
                    }else{
                        message.channel.send('Doneer 5 euro op https://www.paypal.me/ryangroenewold');
                    }
                });
            break;

            case "/createUser":
                if(message.author.username == "Errox505"){
                    con.query("INSERT INTO respect (username) VALUES ('"+fullMessage[1]+"')", function (error,results, field){
                    if(error){
                        message.reply(' heeft het systeem gebroken en zal 50 euro moeten doneren aan de botgod @Errox505 err(2)');
                    }else{
                        console.log('user created: ' + fullMessage[1]);
                            message.channel.send(fullMessage[1]+' is nu aangemaakt.');
                        }
                    });
                }else{
                    message.channel.send('Voor maar 5 euro (op https://www.paypal.me/ryangroenewold) kun je je eigen account hebben om respect te ontvangen');
                }

            break;

            case"/nasi":
                message.reply('https://www.okokorecepten.nl/recept/rijst/nasi/');
            break;

            case "/cat":
                var url = "http://random.cat/meow";
                    request({
                        url: url
                    }, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            var image = JSON.parse(body);
                            message.channel.send(image);

                        }
                    })
            break;

            default:
                // message.channel.send(' HJA DAT BEGRIJP IK TOCH OOK NIET. ');

                break;
        }
    }else{
        console.log()
    }
});


function output(error, token) {
    if (error) {
        console.log(`There was an error logging in: ${error}`);
        return;
    } else
    console.log(`Logged in. Token: ${token}`);
}





client.login(config.token);
