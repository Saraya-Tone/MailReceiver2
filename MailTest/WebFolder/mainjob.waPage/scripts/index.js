

WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
//  現状は繰り返し実行はうまく動作せず、一度か二度しか動かないが、１日に２，３回程度の実行であれば
//  Browserを起動するバッチファイルをそのたびに起動すればよい。

//		sources.mailbox.getNewMailCollection();  // 最初の実行
		ds.Mailbox.getNewMails();  // 最初の実行はクラスメソッドでないとうまく実行されない??
		
		
		var interval = 5 *60*1000; // 本番では10分？
		newdate = new Date();
		$$('startTimeText').setValue("開始時刻："+newdate.toString());	
		var id = setInterval(sources.mailbox.getNewMailCollection, interval);  // ２回目以降はコレクションメソッド??
//		var id = setInterval(ds.Mailbox.getNewMails, interval);  // 以降interbvalおきに実行


	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
