
var key = 22 ;
var attachedFilePath = "C:/Users/tone/Documents/Wakanda/attachedfiles/";

//var theAttachment = ds.Attachment(key);

//var theBlob = theAttachment.a添付ファイル; 
//var filename = theAttachment.sファイル名;

//var dataFile = File(attachedFilePath  +filename );    

////dataFile.create();

//theBlob.copyTo(dataFile,"OverWrite");

key = 9;

theMail = ds.Mailbox(key);

fileArray = theMail.attachments;

fileArray.forEach( function(oneFile) 
{
	var theBlob = oneFile.a添付ファイル; 
	var filename = oneFile.sファイル名;

	var dataFile = File(attachedFilePath + filename );    	
	
	theBlob.copyTo(dataFile,"OverWrite");
	
});
