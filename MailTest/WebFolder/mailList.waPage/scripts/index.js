﻿
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
//		var id = setInterval(sources.mailbox.getNewMailCollection, 3*60*1000);  // 一時的にコメントアウト　本番時に使用		
		$$('dataGrid1').setSortIndicator(1,"desc");　// 送信日付降順ソートを表示

	};// @lock

	saveFiles.click = function saveFiles_click (event)// @startlock
	{// @endlock
//		var id = $$('dataGrid1').column("ID").getFormattedValue(); 
		var idnum  = $$('dataGrid1').column("ID").getValueForInput();
//		alert("保存開始 "+idnum);
		ds.Mailbox.saveSelectedFiles(idnum); // Class Method を同期実行
		location.reload();
		alert("保存終了");
		
	};// @lock

	getNewMail.click = function getNewMail_click (event)// @startlock
	{// @endlock
//		sources.mailbox.getNewMailCollection(); 
		ds.Mailbox.getNewMails();
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
