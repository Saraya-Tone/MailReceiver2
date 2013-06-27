
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var allMailProcessed = {};	// @button
	var checkbox1 = {};	// @checkbox
	var documentEvent = {};	// @document
	var saveFiles = {};	// @button
	var getNewMail = {};	// @button
// @endregion// @endlock

// eventHandlers// @lock

	allMailProcessed.click = function allMailProcessed_click (event)// @startlock
	{// @endlock
		if (window.confirm("全メールの添付ファイルを処理済にしますか？")) {
			ds.Mailbox.allMailProcessed();
			location.reload();	
		};	
	};// @lock

	checkbox1.click = function checkbox1_click (event)// @startlock
	{// @endlock
		if ($$('checkbox1').getValue() == true ) 
		{
			sources.mailbox.query("allSaved == false", {orderBy:"dateString desc"});	
//			sources.mailbox.orderBy("dateString desc");						
		} 
		else
		{
			sources.mailbox.query("allSaved == false OR allSaved == true",{orderBy:"dateString desc"});	
		};		
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
	
		$$('dataGrid1').setSortIndicator(1,"desc");　// 送信日付降順ソートを表示
		$("#dataGrid1").css("border","2px solid black");

	};// @lock

	saveFiles.click = function saveFiles_click (event)// @startlock
	{// @endlock
		var idnum  = $$('dataGrid1').column("ID").getValueForInput();
		var sentdate  = $$('dataGrid1').column("dateString").getValueForInput();
		
		ds.Mailbox.saveSelectedFiles(idnum); // Class Method を同期実行

		alert("保存終了 送信日時＝"+sentdate);
		location.reload();
//		$$('dataGrid1').trigger("click");
//		$$('dataGrid1').centerRow(4);
//		sources.mailbox.select(rownum[0]);
		
	};// @lock

	getNewMail.click = function getNewMail_click (event)// @startlock
	{// @endlock

		var rc = ds.Mailbox.getNewMails();
		if (rc == false) {
			alert ("別の受信処理が実行中です");
		}
		location.reload();

	};// @lock

// @region eventManager// @startlock
	WAF.addListener("allMailProcessed", "click", allMailProcessed.click, "WAF");
	WAF.addListener("checkbox1", "click", checkbox1.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("saveFiles", "click", saveFiles.click, "WAF");
	WAF.addListener("getNewMail", "click", getNewMail.click, "WAF");
// @endregion
};// @endlock
