// Global Var
var attachedFilePath = "C:/MailReceiver/attachedfiles/";
//attachedFilePath = "C:/Users/tone/Documents/Wakanda/attachedfiles/";
//attachedFilePath = "/Users/kuni/Documents/Wakanda/Attached/";

var folders = new Array(); // メールの件名に含まれる文字列に応じてサブフォルダを決定
var folderNumbers = 0 ; 
var locationfilename ; // 拠点名ファイル
var intervalfilename ; // 自動メール受信間隔指定ファイル名
var intervalMinutes  ; // 自動メール受信間隔　分単位
var mailMutex; 		   // 排他制御

function initclass() {
	
	if (folderNumbers > 0) return;
	
	mailMutex = Mutex('mailMutex');
	
	locationfilename = "location.txt";  // このファイルの改行コードはCRLFであること
	intervalfilename = "interval.txt";  // 

	folders = loadText( attachedFilePath + locationfilename ).split("\r\n");
	var intervalMinutesArray  = loadText( attachedFilePath + intervalfilename ).split("\r\n");
	intervalMinutes  = intervalMinutesArray[0];

	folderNumbers = folders.length;

	return;
}

function formatDateTime(datetime) {  // datetime = string data of date and time
	
	if (datetime == undefined || datetime == null) {
		var date2 = new Date();
	} else {
		var millseconds = Date.parse(datetime);
		var date2 = new Date();
		date2.setTime(millseconds);
	}
	
	yy = date2.getFullYear();
	mm = date2.getMonth() + 1;
	dd = date2.getDate();
	hh = date2.getHours();
	minutes = date2.getMinutes();
	ss = date2.getSeconds();

	if (mm < 10) { mm = "0" + mm; }
	if (dd < 10) { dd = "0" + dd; }
	if (hh < 10) { hh = "0" + hh; }
	if (minutes < 10) { minutes = "0" + minutes; }
	if (ss < 10) { ss = "0" + ss; }

	var formatedDate = yy + "/" + mm + "/" + dd + " " + hh + ":" + minutes + ":" + ss

	return formatedDate;	
}	



function getpath(subject) {
	for (i=0; (i<folderNumbers && folders[i] > " "); i++) {
		var ix = subject.indexOf(folders[i]);
		if (subject.indexOf(folders[i]) >= 0 ) {
			return ( attachedFilePath + folders[i] + "/");
		}	
	}	 
//	return ( attachedFilePath + "Others/");
	return ("none");
}

function receiveMailMain (loop) {
//	var pop3 = require("waf-mail/POP3");

//	console.log('====receiveMailMain=============');
	
	if (loop == true) {
		mailMutex.lock();
		console.log('====receiveMailMain STARTED with Lock=============');
	} else {
		var locked = mailMutex.tryToLock();	
		if (!locked) {
			console.log('====receiveMailMain did not Start=============');
			return false; // 受信ボタンを押したときにすでに処理中
		}
		console.log('====receiveMailMain STARTED with tryToLock=============');
	}	

	var mailer = require('mailer');

	var addr = "pop.gmail.com"; 
	var user = "yashi.receiver01@gmail.com";
	var pass = "yashinomi2013";
	var port = 995;
	var isSSL = true;
//	
	var addr = "post2.saraya.com"; 
	var user = "receiver@saraya.com";
	var pass = "password";
	var port = 110;
	var isSSL = false;
//	
//	var addr = "10.1.1.28"; 
//	var user = "ktone";
//	var pass = "5471";
//	var port = 110;
//	var isSSL = false;	
//	
//	
//	var addr = "WEBAPP64.sarayajp.local"; 
//	var user = "info";
//	var pass = "yashinomi";
//	var port = 110;
//	var isSSL = false;
	
//	var addr = "post3.saraya.com"; 
//	var user = "test@mail.saraya.com";
//	var pass = "test";
//	var port = 110;
//	var isSSL = false;	
//	
//	var date ; 

	var millseconds;

	var doMarkForDeletion = false;

	var rc = mailer.receiveMails(addr, port , isSSL , user, pass, doMarkForDeletion, folders);
	
	var workset = ds.Mailbox.query(" allSaved == false "); //添付未保存メールのみ抽出
	
	var allMails = workset.orderBy("dateString"); // 日付の昇順にソート
	
//	return; //////////////////// for test ///////////////
	
	allMails.forEach( function(oneMail) {  // データベース内の添付ファイルを外部フォルダに保存
		
		var folderpath = getpath(oneMail.title);
		
		if (folderpath == "none") return; // 件名に拠点名がなければ処理しない=>実際はreceiveMailsでフィルタ済
		
		var len = oneMail.attachments.length;
		
		oneMail.allSaved = true;
		
		for (i=0;i<len;i++) {	
			var theAttachment = oneMail.attachments[i];
			
			var filename = theAttachment.afileName;
			
			var fileobj = File(folderpath+filename);
			
			if (fileobj.exists) {			
				theAttachment.afileStatus = 1;  // ファイルあり、上書き不可
				oneMail.allSaved = false;
			} else {
				theAttachment.afileStatus = 2;  // ファイルなし、新規保存
				var theBlob = theAttachment.afile;
				theBlob.copyTo(fileobj);        // 添付ファイル書き出し
				theAttachment.afileSaveDate = formatDateTime();
				oneMail.savedFilecount++;
			}		
			
			theAttachment.save();  // 添付ファイルデータベース更新		
			
		}
		
		oneMail.save();   	// メールデータ更新

	});
	
	mailMutex.unlock();	
	return true;
	
}





guidedModel =// @startlock
{
	Attachment :
	{
		afileStatMsg :
		{
			onGet:function()
			{// @endlock
				switch (this.afileStatus) {
					case 1:
					return "添付未保存";
					case 2:
					return "添付新規保存";		
					case 3:
					return "添付上書保存";	
					default:
					return 	(this.afileStatus + "??");							
				}	 
				
			}// @startlock
		}
	},
	Mailbox :
	{
		dateString :
		{
			onGet:function()
			{// @endlock
				var wkdate = this.sentDate;
				
				return formatDateTime(wkdate);
				
				// end function
			}// @startlock
		},
		methods :
		{// @endlock
			repeatGetNewMails:function()
			{// @lock
				initclass();
				var worker = new Worker('Mail/child.js');
				worker.postMessage(intervalMinutes); 
				return;
//				wait();
			},// @lock
			allMailProcessed:function()
			{// @lock
				initclass();
				var allMails = ds.Mailbox.all();
				allMails.forEach( function(oneMail) {
					oneMail.allSaved = true;
					oneMail.save();			
				});
				return;
			},// @lock
			getNewMails:function(loop)
			{// @lock
				initclass();
				var rc = receiveMailMain (loop);
				return rc;
			},// @lock
			saveSelectedFiles:function(id)
			{// @lock
				initclass();
				var theMail = ds.Mailbox(id); 
				
				fileArray = theMail.attachments;
				var folderpath = getpath(theMail.title);
				var i = 0;

				fileArray.forEach( function(oneFile) // 全ファイル上書き保存
				{
					var theBlob = oneFile.afile; 
					var filename = oneFile.afileName;
					oneFile.afileStatus = 3;   //  全ファイル上書き保存による保存
					var dataFile = File(folderpath + filename );    	
					oneFile.afileSaveDate = formatDateTime();
					theBlob.copyTo(dataFile,"OverWrite");
					i++;
					
				});
				theMail.allSaved = true;
				theMail.savedFilecount = i;				
				theMail.save(); 
			}// @startlock
		}
	}
};// @endlock
