var n = 5;
var i = 1;
var id;

function delayedStop()
{
    // Close the worker
    close();
}

function periodicFunction()
{
        // Callbacks 
        console.log("i="+i);
    if (++i == n + 1)
    {
    	close();
//        clearInterval(id);
           // Waiting 5s before quitting
//        setTimeout(delayedStop, 5000);       
    }      
}

    //Start periodic callback function
var id = setInterval(periodicFunction, 1000); 
wait();
