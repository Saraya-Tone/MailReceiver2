
	var date2 = new Date();
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

	var formatedDate = yy + "/" + mm + "/" + dd + " " + hh + ":" + minutes + ":" + ss;

	formatedDate;	
