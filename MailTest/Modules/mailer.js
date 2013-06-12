/*	The helloWorld() function can be executed from any of your project's server-side JavaScript file using the require() method as follows:
	var result = require('mailer').helloWorld();

	For more information, refer to http://doc.wakanda.org/Wakanda Studio0.Beta/help/Title/en/page3355.html
*/
function saveMail(oneMail) {
	
	var msgid = oneMail["Message-ID"];
	if (msgid == undefined) {
		msgid = oneMail["Message-Id"];
	}	

	var found = ds.Mailbox.find("messageID = :1",msgid);
	
	if (found != null)  return; // 新規メールのみ追加	
	
	var theMail = new ds.Mailbox(); 
	
	theMail.title =  oneMail["Subject"] ;
	
	theMail.messageID = msgid; 
	theMail.sender = oneMail["From"] ;

	theMail.sentDate  = oneMail["Date"];
	
	if (theMail.dateString < "2013/02/01 00:00:00") return; // 特定日付以前のメールは対象外
	
	theMail.isMIME = oneMail.isMIME();
	
	if (theMail.isMIME == true ) 
	{
		var parts=oneMail.getMessageParts();
		var aPart;     // メールのMIMEパート 
		var mediaType; // MIME Type
		var filename ; // 添付ファイル名
		
		
		theMail.bodyText=" ";
		theMail.savedFilecount = 0;
		theMail.allSaved = false;
		
		var len = parts.length;
		
		for (i=0;i<len;i++) {	
			aPart = parts[i];
			mediaType = aPart.mediaType;
			filename =  aPart.fileName;
			theMail.bodyText = theMail.bodyText+"\n("+i+") Type="+mediaType+",filename="+filename;
			
			theMail.save();   	// メールデータ保存
			
			// 添付ファイル情報の保存
			
			var theAttachment = new ds.Attachment();
				
			theAttachment.afileName = filename;
			theAttachment.afileSize = aPart.size;
			
			if (filename != "" ) 
			{		
				
				theAttachment.afileStatus = 1;  // 添付ファイル未保存			

				var key = theMail.getKey();
				
				theAttachment.mailbox = (key);
				
				theAttachment.afile = aPart.asBlob;
				
				theAttachment.save();  // 添付ファイルデータベース書き込み
				
				
				
			} else {
				theBody = oneMail.getBody();
				if (theBody != null)
				{
					theMail.bodyText = theMail.bodyText + "\n"+ oneMail.getBody().join("\n");
					theMail.save();	// メールデータ保存
				}
			}	
			
			
		};
	} else {	
		var body = oneMail.getBody();
		theMail.bodyText = body.join("\n");
		theMail.save();	// メールデータ保存
	}
	
	return;

}



exports.receiveMails = function receiveMails(address, port, isSSL, username, password, doMarkForDeletion, folders) {
	// pop3.getAllMail( )のソースを元に必要なメールのみ配列に格納するように変更
	
	var isWakanda	= typeof requireNative != 'undefined';
	var pop3 = require('waf-mail/POP3'); 
	var pop3		= new pop3.POP3();
	var	status		= false;
	var mailModule	= require("waf-mail/mail");
	
	var folderNumbers = folders.length;
	

	// Function to exit event loop. Wakanda has the exitWait() function. Otherwise terminate POP3
	// client, this will close the socket and get out of event loop.
	
	var exit = function	() {
	
		if (isWakanda)
			
			exitWait();
		
		else 
			
			pop3.forceClose();	
		
	}
	
	// Function callbacks are named by states.
	
	var authentificationState, statusState, retrievalState, quittingState;
			
	authentificationState = function (isOk, response) { 
	
		if (!isOk) 
			
			exit();
			
		else
				
			pop3.authenticate(username, password, statusState);

	}
			
	statusState = function (isOk, response) {
	
		if (!isOk)
		
			exit();
	
		else
		
			pop3.getStatus(retrievalState);
	
	}
		
	retrievalState = function (isOk, response, numberMessages) {		
		
		if (!isOk)
				
			exit();
			
		else if (!numberMessages)
		
			pop3.quit(quittingState);  // No messages
			
		else {
			
			var	i = 1;
			
			// Callbacks for retrieval "asynchronous" loop.
			
			var markCallback, retrieveCallback;
			
			markCallback = function (isOk, response) {
							
				if (!isOk) 

					exit();
													
				else if (i == numberMessages) {
					
					// Last message has been marked for deletion.
					
					pop3.quit(quittingState);
					
				} else {
						
					// Message successfully marked, move on and retrieve remaining message(s).
						
					i++;
					pop3.retrieveMessage(i, retrieveCallback);

				}
							
			}
							
			retrieveCallback = function (isOk, response) {

				if (!isOk) 
					
					exit();
										
				else {
									
					// Received mail(s) are parsed.
					
					var	newMail	= new mailModule.Mail();
					
					newMail.parse(response);
					
					var subject = newMail["Subject"];
					
//					console.log('Date='+newMail["Date"]+',Subject='+subject);
					
					var j = 0;
					for (j=0; (j<folderNumbers && folders[j] > " "); j++) {
						var ix = subject.indexOf(folders[j]);
						if (subject.indexOf(folders[j]) >= 0 ) {
							saveMail(newMail);     // mailをデータベースに保存
						}	
					}	 
					
					
					if (doMarkForDeletion) 
						
						pop3.markForDeletion(i, markCallback);
										
					else if (i == numberMessages) {
						
						// We're done.
					
						pop3.quit(quittingState);
						
					} else {
						
						// Retrieve remaining message(s).
						
						i++;
						pop3.retrieveMessage(i, retrieveCallback);
						
					}
				
				}		

			}
			
			// Retrieve first message, this will start the retrieval "asynchronous" loop.
				
			pop3.retrieveMessage(i, retrieveCallback);
			
		}

	}
	
	quittingState = function (isOk, response) {
		
		status = isOk;
		exit();
	
	}
		
	// Connect to POP3 server. Code will go asynchronously from state to state via callbacks.

	pop3.connect(address, port, isSSL, authentificationState);	
	
	// If using Wakanda, function is made synchronous.
	
	if (isWakanda) {
			
		// Indefinite wait, callback events will exit wait when done.
	
		wait();
	
		// Force termination and release of POP3 client resource.
	
		pop3.forceClose();
		
	}
	
	return status;	
}


