var nbLoops = 0; 
var interval = 300000 ; 　// 繰り返し秒数（ミリセカンド）
var looplimit = 70 ; 　　　// 繰り返し限度回数
var durationHour = 22 ; // 実行継続時間 




function repeatFunction() {
//    console.log("treatTimer nbLoops=",nbLoops); //log the loop number
	
    nbLoops++;
    if (nbLoops < looplimit) {
    	var loop = true;
    	ds.Mailbox.getNewMails(loop);
        setTimeout(function() {repeatFunction()},interval);
    }
    else {
    	console.log("***** End of MainJob *****");
        exitWait(); //stop the wait
    }
}
 

				
self.onmessage = function (event) {

	var intervalMinutes = event.data ; 　// 繰り返し分数
	interval = intervalMinutes * 60 * 1000; 
	looplimit = durationHour * 60 / intervalMinutes; 
	
	repeatFunction();

	wait();   // wait here until exitWait is called
	
}					