
function repeatFunction() {
//    console.log("treatTimer nbLoops=",nbLoops); //log the loop number
    nbLoops++;
    if (nbLoops < looplimit) {
    	ds.Mailbox.getNewMails();
        setTimeout(function() {repeatFunction()},interval);
    }
    else {
        exitWait(); //stop the wait
    }
}
 
var nbLoops = 0; 
var interval = 300000; 　// 繰り返し秒数（ミリセカンド）
var looplimit = 70 ; 　　　// 繰り返し限度回数
var durationHour = 22 ; // 実行継続時間 

repeatFunction();

wait();   // wait here until exitWait is called
