




var mailer = require('mailer');

var username =  'receiver@saraya.com'; // enter a valid account here
var password = 'password'; // enter a valid password here
var address  = 'post2.saraya.com'; 
var port = 110;
var isSSL = false;

//var address = "pop.gmail.com"; 
//var username = "yashi.receiver01@gmail.com";
//var password = "yashinomi2013";
//var port = 995;
//var isSSL = true;



var allMails = [];
var doMarkForDeletion = false;

rc = mailer.receiveMails(address, port, isSSL, username, password, allMails, doMarkForDeletion);

var cnt = 0;
allMails.forEach( function(oneMail) {
	cnt++;
	var sentDate  = oneMail["Date"];
	console.log('**sentDate ='+sentDate+' count='+cnt);
});	

