function periodicFunction()
{
	console.log('====in function====');
}	



console.log('Start');

//var worker = new Worker('Mail/child.js');


var id = setInterval(periodicFunction, 5000); 
wait();


console.log('End');
