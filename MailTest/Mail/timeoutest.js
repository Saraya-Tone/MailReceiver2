
function treatTimer() {
    console.log("treatTimer nbLoops=",nbLoops); //log the loop number
    nbLoops++;
    if (nbLoops < 70) {
    	ds.Mailbox.getNewMails();
        setTimeout(function() {treatTimer()},300000);
    }
    else {
        exitWait(); //stop the wait
    }
}
 
var nbLoops = 0; 

treatTimer();

//setTimeout(function() {treatTimer()},10000); // call the function

wait();   // wait here until exitWait is called
