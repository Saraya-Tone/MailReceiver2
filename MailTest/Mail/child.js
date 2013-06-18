
var cnt = 0;
var id;

function periodic ()
{
//	clearInterval(id);
	cnt++;
	console.log('CNT='+cnt);
//	ds.Mailbox.getNewMails();
//	clearInterval(id);
	if (cnt == 10) close();
}	

id = setInterval(periodic, 2*1000);  // intervalの時間間隔でreceiveMailMain実行

wait();
				
				