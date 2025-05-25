function Log_(text) {
	if(true) console.log(text);
}
//--初始化資料
if (!localStorage.autoQueryOption) {
	localStorage.autoQueryOption = JSON.stringify({
		//--預設單位時間(5000毫秒/單位)
		'TimeUnits': 5000,
		//--預設檢查頻率(6單位)
		'Frequency': 35,
		//--預設錯誤重試時間(1單位)
		'ErrorReTestTime': 0,
		//--預設逾時時間(1單位)
		'TimeOut': 2,
		//--預設音效檔存放路徑
		'SoundFilePath': 'Notice.mp3',
		//--預設是否撥放動畫
		'Animation': true,
		//--預設是否桌面提醒
		'DesktopAlert': true
	});
}
if (false || !localStorage.autoQueryDataItem) {
	localStorage.autoQueryDataItem = JSON.stringify({
		'Execution': {
			'OnlyID': 0
		},
		'Server': {}
	})
}
var Option = {
	'Text': localStorage.autoQueryOption,
	'Data': JSON.parse(localStorage.autoQueryOption),
	'Get': function () {
		if (this.Text != localStorage.autoQueryOption) {
			this.Text = localStorage.autoQueryOption;
			this.Data = JSON.parse(localStorage.autoQueryOption);
		}
		return this.Data;
	},
	'Update': function () {
		localStorage.autoQueryOption = this.Text = JSON.stringify(this.Data);
		return this;
	}
};
var DataItem = {
	'Text': localStorage.autoQueryDataItem,
	'Data': JSON.parse(localStorage.autoQueryDataItem),
	'Get': function () {
		if (this.Text != localStorage.autoQueryDataItem) {
			this.Text = localStorage.autoQueryDataItem;
			this.Data = JSON.parse(localStorage.autoQueryDataItem);
		}
		return this.Data;
	},
	'Update': function () {
		localStorage.autoQueryDataItem = this.Text = JSON.stringify(this.Data);
		return this;
	},
};

//--點擊按鈕事件
chrome.browserAction.onClicked.addListener(function () {
	var Update = false;
	for (var URLID in ClickTemp) {
		if (typeof ClickTemp[URLID] == 'object') {
			switch (typeof ClickTemp[URLID].OpenURL) {
				case 'string':
					if (ClickTemp[URLID].OpenURL) {
						Update = true;
						chrome.tabs.create({
							url: ClickTemp[URLID].OpenURL
						});
					}
					break;
				case 'object':
					for (var Key in ClickTemp[URLID].OpenURL)
						if (ClickTemp[URLID].OpenURL[Key]) {
							Update = true;
							chrome.tabs.create({
								url: ClickTemp[URLID].OpenURL[Key]
							});
						}
			}
		}
	}
	DataItem.Update();
	chrome.browserAction.setIcon({ path: "icons/Silent.png" });
	ClickTemp = {};
});
//--動畫
function Animation() {
	
}
//--桌面通知
function DesktopAlert(Message) {
/*
	var windowsmessage = Scheduling.DesktopAlerts[Scheduling.DesktopAlerts.length] = webkitNotifications.createNotification(
		'icons/DesktopAlert.png',
		'有新消息!',
		Message
	);
	windowsmessage.show();
	*/
	chrome.notifications.create('EYNY',{
		type: "basic",
        title: "EYNY訊息",
        message: Message,
        iconUrl: "icons/DesktopAlert.png"
    },function() {
		return;
	});
}
//--播放音效
function OpenSound(SoundFilePath) {
	$('#sounds').append('<audio src="' + SoundFilePath + '" autoplay></audio>');
}
//--檢查物件
function CheckObject(Obj) {
	if (typeof Obj == 'object') {
		for (var Key in Obj)
			if (CheckObject(Obj[Key])) return true;
	}
	else if (Obj) return true;
	return false;
}
//--登入(Server as String,Path as String,ExecutionID as number)
function Login(Server, Path, ExecutionID) {
	var LoginData = DataItem.Get().Server[Server].LoginData;
	if (LoginData.Data) {
		if (Path) {
			if (Scheduling.Login[Server]) {
				Scheduling.AddLogin(Server, Path, ExecutionID);
				return;
			}
			else Scheduling.AddLogin(Server, Path, ExecutionID);
		}
		Log_('嘗試登入：' + Server);
		var ThisOption = {};
		$.extend(ThisOption, Option.Get(), DataItem.Get().Server[Server].Option);
		$.ajax({
			cache: false,
			context: { 'Server': Server, 'Option': ThisOption },
			timeout: ThisOption.TimeOut * ThisOption.TimeUnits,
			error: function (XMLHttpRequest, textStatus) {
				Log_('登入失敗(textStatus)：' + this.Server);
				if (textStatus == 'timeout') Login(this.Server);
				else {
					var ThisTime = Scheduling.Time[Scheduling.SpendTime + this.Option.ErrorReTestTime];
					if (!ThisTime)
						ThisTime = {};
					if (!ThisTime.Login)
						ThisTime.Login = {};
					ThisTime.Login[this.Server] = true;
				}
			},
			success: function () {
				Log_('登入成功：' + this.Server);
				for (var Path in Scheduling.Login[this.Server])
					Query(this.Server, Path, Scheduling.Login[this.Server][Path]);
				delete Scheduling.Login[this.Server];
			},
			url: Server + LoginData.Path,
			data: LoginData.Data,
			type: LoginData.Type
		});
	}
	else Scheduling.AddQuery(Server, Path, ExecutionID);
}
//--檢查(Server as String,Path as String,Execution as object)
function Query(Server, Path, Execution) {
	Log_('正在連線：' + Server + Path);
	var ThisOption = {};
	$.extend(ThisOption, Option.Get(), DataItem.Get().Server[Server].Option, DataItem.Get().Server[Server].Path[Path].Option);
	$.ajax({
		cache: false,
		dataType: "html",
		context: { 'Server': Server, 'Path': Path, 'Execution': Execution, 'Option': ThisOption },
		timeout: ThisOption.TimeOut * ThisOption.TimeUnits,
		error: function (XMLHttpRequest, textStatus) {
			Log_('連線失敗(' + textStatus + ')：' + this.Server + this.Path);
			if (textStatus == 'timeout') Query(this.Server, this.Path, this.Execution);
			else {
				for (var ExecutionID in this.Execution) {
					var ThisOption = {};
					$.extend(ThisOption, this.Option, DataItem.Get().Execution[ExecutionID].Option);
					Scheduling.AddQuery(this.Server, this.Path, ExecutionID, this.Option.ErrorReTestTime);
				}
			}
		},
		success: function (PageData) {
			Log_('連線成功：' + this.Server + this.Path);
			for (var ExecutionID in this.Execution) {
				Log_('開始檢查：' + this.Server + this.Path + '_' + ExecutionID);
				var ThisOption = {};
				$.extend(ThisOption, this.Option, DataItem.Get().Execution[ExecutionID].Option);
				var ReturnData = (function (Data, DataItem, Server, Path, ExecutionID) {
					var ServerName = DataItem.Server[Server].Name;
					var PathName = DataItem.Server[Server].Path[Path].Name;
					var ExecutionName = DataItem.Server[Server].Path[Path].Execution[ExecutionID];
					var Record = DataItem.Server[Server].Path[Path].Execution[ExecutionID];
					var LoginData = (DataItem.Server[Server].LoginData.Data?DataItem.Server[Server].LoginData.Data:undefined);
					var Delete = false, Login = false, OpenURL, ShowMessage;
					var JData = $(Data.replace(/ src=[^ >]+/g, ""));
					eval(DataItem.Execution[ExecutionID].Code);
					return {
						'Login': Login,
						'Record': Record,
						'OpenURL': OpenURL,
						'ShowMessage': ShowMessage
					};
				})(PageData, DataItem.Get(), this.Server, this.Path, ExecutionID);
				Log_('檢查結果：' + this.Server + this.Path + '_' + ExecutionID + '\r\n　　　　　' + JSON.stringify(ReturnData));
				if (ReturnData.Login){
					Log_('需要登入：' + this.Server + this.Path + '_' + ExecutionID);
					Login(this.Server, this.Path, ExecutionID);
				}
				else {
					DataItem.Get().Server[this.Server].Path[this.Path].Execution[ExecutionID] = ReturnData.Record;
					delete ReturnData.Login;
					delete ReturnData.Record;
					Scheduling.AddQuery(this.Server, this.Path, ExecutionID, ThisOption.Frequency);
					Scheduling.AddRemind(this.Server, this.Path, ExecutionID, ReturnData, ThisOption);
				}
			}
		},
		url: Server + Path + '&' + Date.now()
	});
}
//--定時處理並提醒
function AddSpendTime() {
	Log_('經過 ' + Scheduling.SpendTime + ' 單位時間');
	if (Scheduling.Time[Scheduling.SpendTime]) {
		var Temp = Scheduling.Time[Scheduling.SpendTime];
		//--登入錯誤重試
		if (Temp.Login) {
			for (var Server in Temp.Login)
				Login(Server);
		}
		//--執行檢查排程
		if (Temp.Server) {
		for (var Server in Temp.Server)
			for (var Path in Temp.Server[Server])
				Query(Server, Path, Temp.Server[Server][Path])
		}
		delete Scheduling.Time[Scheduling.SpendTime];
	}
	Scheduling.SpendTime++;
	setTimeout('AddSpendTime()', Option.Get().TimeUnits);
	//--消除桌面通知
	for (var i = Scheduling.DesktopAlerts.length; i; i--)
		Scheduling.DesktopAlerts[i-1].cancel();
	Scheduling.DesktopAlerts = [];
	//--提醒
	var SoundFilePaths = {};
	for (var URLID in Scheduling.Remind) {
		if (Scheduling.Remind[URLID].Option.Animation) ClickTemp.Animation = true;
		if (!ClickTemp[URLID])
		ClickTemp[URLID] = {
			OpenURL: {},
			ShowMessage: {}
		};
		switch (typeof Scheduling.Remind[URLID].OpenURL) {
			case 'string':
				if (Scheduling.Remind[URLID].OpenURL) ClickTemp[URLID].OpenURL = Scheduling.Remind[URLID].OpenURL;
				break;
			case 'object':
				for (var Key in Scheduling.Remind[URLID].OpenURL) {
					if (!ClickTemp[URLID].OpenURL[Key])
						ClickTemp[URLID].OpenURL[Key] = {};
					ClickTemp[URLID].OpenURL[Key] = Scheduling.Remind[URLID].OpenURL[Key];
				}
		}
		switch (typeof Scheduling.Remind[URLID].ShowMessage) {
			case 'string':
				if (Scheduling.Remind[URLID].ShowMessage) ClickTemp[URLID].ShowMessage = Scheduling.Remind[URLID].ShowMessage;
				if (Scheduling.Remind[URLID].Option.DesktopAlert)
				DesktopAlert(Scheduling.Remind[URLID].ShowMessage);
				break;
			case 'object':
				for (var Key in Scheduling.Remind[URLID].ShowMessage) {
					if (!ClickTemp[URLID].ShowMessage[Key])
						ClickTemp[URLID].ShowMessage[Key] = {};
					ClickTemp[URLID].ShowMessage[Key] = Scheduling.Remind[URLID].ShowMessage[Key];
					if (Scheduling.Remind[URLID].Option.DesktopAlert)
						DesktopAlert(Scheduling.Remind[URLID].ShowMessage[Key]);
				}
		}
		if (Scheduling.Remind[URLID].Option.SoundFilePath)
			SoundFilePaths[Scheduling.Remind[URLID].Option.SoundFilePath] = true;
	}
	if (CheckObject(SoundFilePaths)) {
		$('#sounds').empty();
		for (var SoundFilePath in SoundFilePaths) OpenSound(SoundFilePath);
	}
	var HasURL = false;
	for (var Key in ClickTemp) {
		if (typeof ClickTemp[Key] == 'object' && CheckObject(ClickTemp[Key].OpenURL)) {
			HasURL = true;
			break;
		}
	}
	if (HasURL) {
		chrome.browserAction.setPopup({ popup: '' });
		chrome.browserAction.setIcon({ path: "icons/NewMessages.png" });
		chrome.browserAction.setTitle({ title: "有新訊息" });
		if (ClickTemp.Animation) Animation();
	}
	else {
		delete ClickTemp;
		chrome.browserAction.setPopup({ popup: 'popup.html' });
		chrome.browserAction.setIcon({ path: "icons/Silent.png" });
		chrome.browserAction.setTitle({ title: "無訊息" });
	}
	Scheduling.Remind = {};
}
function ThenObject(Object, ReferenceObject) {
	if (Object === false)
		return 'DeleteAllObject';
	else if (!Object)
		return 'DeleteObject';
	else if (typeof Object == 'string')
		return (Object == ReferenceObject ? 'DeleteObject' : 'Retention');
	else if (typeof Object == 'object') {
		var Length = 0;
		for (var Key in Object) {
			Length++;
			switch (ThenObject(Object[Key], (ReferenceObject ? ReferenceObject[Key] : undefined))) {
				case 'DeleteAllObject':
					if (ReferenceObject) delete ReferenceObject[Key];
				case 'DeleteObject':
					delete Object[Key];
					Length--;
			}
		}
		if (Length) return 'Retention';
		else return 'DeleteObject';
	}
}
function MergedObject(Object, ReferenceObject) {

}
var ClickTemp = {};
var Scheduling = {
	'SpendTime': 0,
	'Login': {},
	'Time': {},
	'Remind': {},
	'DesktopAlerts': [],
	'AddLogin': function (Server, Path, ExecutionID) {
		Log_('增加登入檢查排程：' + Server + Path + '_' + ExecutionID);
		if (!this.Login[Server])
			this.Login[Server] = {};
		if (!this.Login[Server][Path])
			this.Login[Server][Path] = {};
		this.Login[Server][Path][ExecutionID] = true;
	},
	'AddQuery': function (Server, Path, ExecutionID, Time) {
		if (!Time) Time = 0;
		Log_(this.SpendTime + Time + ' 單位時間增加檢查排程：' + Server + Path + '_' + ExecutionID);
		if (!this.Time[this.SpendTime + Time])
			this.Time[this.SpendTime + Time] = {};
		if (!this.Time[this.SpendTime + Time].Server)
			this.Time[this.SpendTime + Time].Server = {};
		if (!this.Time[this.SpendTime + Time].Server[Server])
			this.Time[this.SpendTime + Time].Server[Server] = {};
		if (!this.Time[this.SpendTime + Time].Server[Server][Path])
			this.Time[this.SpendTime + Time].Server[Server][Path] = {};
		this.Time[this.SpendTime + Time].Server[Server][Path][ExecutionID] = true;
	},
	'AddRemind': function (Server, Path, ExecutionID, ReturnData, Option) {
		var URLID = Server + Path + '_' + ExecutionID;
		if (ThenObject(ReturnData, ClickTemp[URLID]) == 'Retention') {
			Log_('增加提醒排程：' + Server + Path + '_' + ExecutionID);
			this.Remind[URLID] = ReturnData;
			this.Remind[URLID].Option = Option;
		}
	}
};
Log_('初始化......');
(function () {
	for (var Server in DataItem.Get().Server)
		for (var Path in DataItem.Get().Server[Server].Path)
			for (var Execution in DataItem.Get().Server[Server].Path[Path].Execution)
				Scheduling.AddQuery(Server, Path, Execution);
})();
Log_('初始化完成！');
AddSpendTime();