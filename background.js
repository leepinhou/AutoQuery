importScripts('js/jquery.js');

function Log_(text) {
	if(true) console.log(text);
}
//--初始化資料
if (true || !localStorage.autoQueryOption) {
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
//初始化檢查規則，因為尚在開發中，為了方便主動刪除測試資料以初始化，則將false設定為true並重新載入一次
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
//--因為尚在開發中，此為預先自訂義執行項目與資料，當開發完成將刪除本段
if(true){
	DataItem.Get().Execution = {
		'OnlyID': 5,
		'0': {
			'Name': '消息與提醒',
			'Option': {},
			'rules': [
              {
                "type": "LOGIN_CHECK",
                "selector": "a:contains(登錄)",
                "setsLoginFlag": true
              },
              {
                "type": "EXTRACT_INFO",
                "onlyIfNotLogin": true,
                "selector": "#pm_ntc",
                "conditionClass": "new",
                "openUrl": { "targetKey": "pm_ntc", "attribute": "href", "prefix": "Server" },
                "showMessage": { "targetKey": "pm_ntc", "attribute": "text", "prefix": "ServerName" }
              },
              {
                "type": "EXTRACT_INFO",
                "onlyIfNotLogin": true,
                "selector": "#myprompt",
                "conditionClass": "new",
                "openUrl": { "targetKey": "myprompt", "attribute": "href", "prefix": "Server" },
                "showMessage": { "targetKey": "myprompt", "attribute": "text", "prefix": "ServerName" }
              }
            ]
		},
		'1': {
			'Name': '檢查新回復',
			'Option': {},
			'rules': [
				{
					"type": "UPDATE_RECORD_AND_NOTIFY",
					"selector": ".pls.ptm.pbm span:last",
					"initializeRecordTo": 0,
					"extractValue": { "from": "text", "dataType": "number" },
					"comparison": { "type": "GREATER_THAN_RECORD" },
					"ifConditionMet": {
						"setOpenUrl": "http://www.eyny.com/forum.php?mod=redirect&ptid={ptid}&authorid=0&postno={recordPlus2}",
						"setShowMessage": "{ServerName}{PathName}有 {diff} 筆未讀回覆",
						"updateRecordTo": "extractedValue"
					},
					"fallbackLoginCheckSelector": "a:contains(登錄)"
				}
			]
		},
		'2': {
			'Name': '檢查【版主討論區】',
			'Option': {},
			'rules': [
				{
					"type": "UPDATE_RECORD_AND_NOTIFY",
					"selector": "a:contains(【版主討論區】)",
					"parentElementSelector": "tbody",
					"initializeRecordTo": 0,
					"extractValues": [
						{ "name": "NewRecord", "selector": ".xi2", "from": "text", "dataType": "number" },
						{ "name": "PID", "from": "id", "dataType": "string", "regexReplace": { "pattern": "stickthread_", "flags": "g", "replacement": "" } },
						{ "name": "PostName", "selector": ".by:last a:first", "from": "text", "dataType": "string" }
					],
					"complexCondition": { "type": "RULE_2_5_LIKE_CONDITION", "diffThreshold": 2 },
					"ifConditionMet": {
						"setOpenUrl": "http://www.eyny.com/forum.php?mod=redirect&ptid={extracted.PID}&authorid=0&postno={recordPlus2}",
						"setShowMessage": "【版主討論區】有 {diff} 筆未讀回覆",
						"updateRecordTo": "extractedValue",
						"updateSource": "NewRecord"
					},
					"fallbackLoginCheckSelector": "a:contains(登錄)"
				}
			]
		},
		'3': {
			'Name': '檢查【漫畫求檔區】',
			'Option': {},
			'rules': [
				{
					"type": "UPDATE_RECORD_AND_NOTIFY",
					"selector": "a:contains(【漫畫求檔區】)",
					"parentElementSelector": "tbody",
					"initializeRecordTo": 0,
					"extractValues": [
						{ "name": "NewRecord", "selector": ".xi2", "from": "text", "dataType": "number" },
						{ "name": "PID", "from": "id", "dataType": "string", "regexReplace": { "pattern": "stickthread_", "flags": "g", "replacement": "" } },
						{ "name": "PostName", "selector": ".by:last a:first", "from": "text", "dataType": "string" }
					],
					"complexCondition": { "type": "RULE_2_5_LIKE_CONDITION", "diffThreshold": 2 },
					"ifConditionMet": {
						"setOpenUrl": "http://www.eyny.com/forum.php?mod=redirect&ptid={extracted.PID}&authorid=0&postno={recordPlus2}",
						"setShowMessage": "【漫畫求檔區】有 {diff} 筆未讀回覆",
						"updateRecordTo": "extractedValue",
						"updateSource": "NewRecord"
					},
					"fallbackLoginCheckSelector": "a:contains(登錄)"
				}
			]
		},
		'4': {
			'Name': '檢查【會員反應區】',
			'Option': {},
			'rules': [
				{
					"type": "UPDATE_RECORD_AND_NOTIFY",
					"selector": "a:contains(【會員反應區】)",
					"parentElementSelector": "tbody",
					"initializeRecordTo": "0,0",
					"recordFormat": "comma_separated_tuple",
					"recordTupleParts": ["OldP", "OldTime"],
					"extractValues": [
						{ "name": "NewTime", "selector": ".by:last span", "from": "title", "dataType": "date_string_to_epoch" },
						{ "name": "NewP", "selector": ".xi2", "from": "text", "dataType": "number" },
						{ "name": "PID", "from": "id", "dataType": "string", "regexReplace": { "pattern": "stickthread_", "flags": "g", "replacement": "" } },
						{ "name": "PostName", "selector": ".by:last a:first", "from": "text", "dataType": "string" }
					],
					"complexCondition": { "type": "RULE_4_CONDITION" },
					"ifConditionMet": {
						"setOpenUrl": "http://www.eyny.com/forum.php?mod=redirect&ptid={extracted.PID}&authorid=0&postno={OldPplus1}",
						"setShowMessage": "【會員反應區】有 {diffP} 筆未讀回覆",
						"updateRecordOnlyOnConditionMet": true,
						"updateRecordFormat": "{extracted.NewP},{extracted.NewTime}"
					},
					"fallbackLoginCheckSelector": "a:contains(登錄)"
				}
			]
		},
		'5': {
			'Name': '檢查【主題申請區】',
			'Option': {},
			'rules': [
				{
					"type": "UPDATE_RECORD_AND_NOTIFY",
					"selector": "a:contains(【主題申請區】)",
					"parentElementSelector": "tbody",
					"initializeRecordTo": 0,
					"extractValues": [
						{ "name": "NewRecord", "selector": ".xi2", "from": "text", "dataType": "number" },
						{ "name": "PID", "from": "id", "dataType": "string", "regexReplace": { "pattern": "stickthread_", "flags": "g", "replacement": "" } },
						{ "name": "PostName", "selector": ".by:last a:first", "from": "text", "dataType": "string" }
					],
					"complexCondition": { "type": "RULE_2_5_LIKE_CONDITION", "diffThreshold": 1 },
					"ifConditionMet": {
						"setOpenUrl": "http://www.eyny.com/forum.php?mod=redirect&ptid={extracted.PID}&authorid=0&postno={recordPlus2}",
						"setShowMessage": "【主題申請區】有 {diff} 筆未讀回覆",
						"updateRecordTo": "extractedValue",
						"updateSource": "NewRecord"
					},
					"fallbackLoginCheckSelector": "a:contains(登錄)"
				}
			]
		},
		'6': {
			'Name': '每日登入',
			'Option': {},
			'rules': [{
				"type": "DAILY_LOGIN_CHECK",
				"initializeRecordTo": 0,
				"condition": "RECORD_NOT_EQUALS_TODAY",
				"ifConditionMet": {
					"setOpenUrl": ["http://www.eyny.com/forum-1628-1.html"]
				},
				"updateRecordTo": "TODAY"
			}]
		}
	};
	DataItem.Update();
}
//--因為尚在開發中，此為預先自定義登入伺服器資料，第一次載入設為true之後根據需求可改為false
if(false){
	DataItem.Get().Server = {
		'http://www.eyny.com/': {
			'Name': 'EYNY',
			'LoginData': {
				'Path': 'member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes',
				'Type': 'POST',
				'Data': {
					'username': 'username',
					'password': 'password',
					'questionid': 3,
					'answer': '斗六'
				}
			},
			'Option': {},
			'Path': {
				'forum.php?mod=forumdisplay&fid=1628&filter=author&orderby=dateline': {
					'Name': '漫畫下載(上傳空間)帖子列表',
					'Option': {},
					'Execution': {
						'0': '',
						'2': '',
						'3': '',
						'4': '',
						'5': '',
						'6': ''
					}
				}
			}
		}
	};
	DataItem.Update();
}

//--點擊按鈕事件
chrome.action.onClicked.addListener(function () {
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
	chrome.action.setIcon({ path: "icons/Silent.png" });
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
	// TODO: Implement sound playing for Manifest V3
	// $('#sounds').append('<audio src="' + SoundFilePath + '" autoplay></audio>');
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

function processRuleEngine(rulesArray, JData, PageData, Server, ServerName, PathName, currentRecord, LoginData) {
    let Login = false;
    let OpenURL = {};
    let ShowMessage = {};
    // let updatedRecord = currentRecord; // Will be handled more carefully based on rule type and conditions
    let finalRecordValue = currentRecord; // Start with currentRecord, update based on rules

    let extractedData = {}; // Used for rules that extract multiple values
    let parsedRecord = {}; // For tuple records

    for (const rule of rulesArray) {
        // Initialize updatedRecord for this rule based on currentRecord or rule's initializeRecordTo
        let ruleScopedUpdatedRecord = currentRecord;
        if (rule.initializeRecordTo !== undefined && (currentRecord === undefined || currentRecord === null || currentRecord === "" || currentRecord === 0 && rule.recordFormat === "comma_separated_tuple" && rule.initializeRecordTo === "0,0")) {
             // Special handling for "0,0" or empty init for tuple for rule 4
            if (rule.recordFormat === "comma_separated_tuple" && rule.initializeRecordTo === "0,0" && !currentRecord) {
                ruleScopedUpdatedRecord = "0,0";
            } else if (rule.initializeRecordTo !== "" && rule.recordFormat !== "comma_separated_tuple") { // Avoid using "" for non-tuple if currentRecord is 0
                 ruleScopedUpdatedRecord = rule.initializeRecordTo;
            } else if (!currentRecord && rule.initializeRecordTo) { // General case for init
                ruleScopedUpdatedRecord = rule.initializeRecordTo;
            }
        }


        if (rule.recordFormat === "comma_separated_tuple") {
            const recordParts = (ruleScopedUpdatedRecord || rule.initializeRecordTo || "0,0").split(',');
            const partNames = rule.recordTupleParts || ["val1", "val2"];
            parsedRecord[partNames[0]] = parseFloat(recordParts[0]) || 0;
            if (partNames.length > 1 && recordParts.length > 1) {
                parsedRecord[partNames[1]] = parseFloat(recordParts[1]) || 0;
            } else if (partNames.length > 1) {
                 parsedRecord[partNames[1]] = 0; // Default if second part missing
            }
        } else {
            // Ensure ruleScopedUpdatedRecord is a number if it's meant to be for non-tuple records that are numeric
            if (typeof ruleScopedUpdatedRecord === 'string' && !isNaN(parseFloat(ruleScopedUpdatedRecord))) {
                 // For rules 1,2,3,5, record is expected to be a number after init or from currentRecord
                 if (rule.type === "UPDATE_RECORD_AND_NOTIFY" && (!rule.recordFormat || rule.recordFormat !== "comma_separated_tuple") ) {
                    ruleScopedUpdatedRecord = parseFloat(ruleScopedUpdatedRecord) || 0;
                 }
            }
        }


        let baseElement = JData.find(rule.selector);
        if (rule.parentElementSelector && baseElement.length > 0) {
            baseElement = baseElement.closest(rule.parentElementSelector);
        }

        if (rule.type === "LOGIN_CHECK") {
            if (baseElement.length > 0) {
                Login = rule.setsLoginFlag;
            }
        } else if (rule.type === "EXTRACT_INFO") {
            if (rule.onlyIfNotLogin && Login) {
                continue;
            }
            if (baseElement.length > 0) {
                let conditionMet = true;
                if (rule.conditionClass) {
                    conditionMet = baseElement.hasClass(rule.conditionClass);
                }

                if (conditionMet) {
                    if (rule.openUrl) {
                        let urlVal = baseElement.attr(rule.openUrl.attribute);
                        if (urlVal !== undefined) {
                           OpenURL[rule.openUrl.targetKey] = (rule.openUrl.prefix === 'Server' ? Server : (rule.openUrl.prefix || '')) + urlVal;
                        }
                    }
                    if (rule.showMessage) {
                        let msgVal = rule.showMessage.attribute === 'text' ? baseElement.text() : baseElement.attr(rule.showMessage.attribute);
                        if (msgVal !== undefined) {
                            ShowMessage[rule.showMessage.targetKey] = (rule.showMessage.prefix === 'ServerName' ? ServerName : (rule.showMessage.prefix || '')) + msgVal;
                        }
                    }
                }
            }
        } else if (rule.type === "UPDATE_RECORD_AND_NOTIFY") {
            extractedData = {};
            if (rule.extractValues && Array.isArray(rule.extractValues)) {
                for (const ev of rule.extractValues) {
                    let sourceElement = ev.selector ? baseElement.find(ev.selector) : baseElement;
                    if (sourceElement.length > 0) {
                        let valStr = (ev.from === "text") ? sourceElement.text() : sourceElement.attr(ev.from);
                        if (valStr !== undefined) {
                            if (ev.regexReplace) {
                                try {
                                    valStr = valStr.replace(new RegExp(ev.regexReplace.pattern, ev.regexReplace.flags || ""), ev.regexReplace.replacement);
                                } catch (e) { Log_(`Regex error for ${PathName}: ${e}`); }
                            }
                            if (ev.dataType === "number") extractedData[ev.name] = parseFloat(valStr);
                            else if (ev.dataType === "date_string_to_epoch") extractedData[ev.name] = (new Date(valStr)).getTime() || 0;
                            else extractedData[ev.name] = valStr;
                        }
                    }
                }
            }

            if (baseElement.length > 0) {
                let overallCondition = false;
                let tempNewRecordValueForUpdate; // Value from single extractValue (rule 1 like)
                if (rule.extractValue) {
                     let tempExtractedString = (rule.extractValue.from === "text") ? baseElement.text() : baseElement.attr(rule.extractValue.from);
                     if (rule.extractValue.dataType === "number") tempNewRecordValueForUpdate = parseFloat(tempExtractedString);
                     else tempNewRecordValueForUpdate = tempExtractedString;
                }

                let diffP = 0; // Specific for RULE_4_CONDITION

                if (rule.complexCondition && rule.complexCondition.type === "RULE_2_5_LIKE_CONDITION") {
                     if (extractedData.NewRecord !== undefined && extractedData.PostName !== undefined && typeof ruleScopedUpdatedRecord === 'number') {
                        const cond_newRecordGreaterThanRecord = extractedData.NewRecord > ruleScopedUpdatedRecord;
                        const cond_isNotLoggedInOrNoLoginData = !LoginData || Object.keys(LoginData).length === 0;
                        const diff = extractedData.NewRecord - ruleScopedUpdatedRecord;
                        const cond_diffGreaterThanThreshold = diff > rule.complexCondition.diffThreshold;
                        const cond_postNameNotUser = LoginData && LoginData.username ? extractedData.PostName !== LoginData.username : true;
                        overallCondition = cond_newRecordGreaterThanRecord && (cond_isNotLoggedInOrNoLoginData || cond_diffGreaterThanThreshold || cond_postNameNotUser);
                        if (overallCondition) {
                             if (rule.ifConditionMet.setOpenUrl) {
                                let recordPlus2 = ruleScopedUpdatedRecord + 2;
                                OpenURL['default'] = rule.ifConditionMet.setOpenUrl.replace('{extracted.PID}', extractedData.PID || '').replace('{recordPlus2}', recordPlus2.toString());
                            }
                            if (rule.ifConditionMet.setShowMessage) ShowMessage['default'] = rule.ifConditionMet.setShowMessage.replace('{diff}', diff.toString());
                        }
                    }
                } else if (rule.complexCondition && rule.complexCondition.type === "RULE_4_CONDITION") {
                    if (extractedData.NewTime !== undefined && extractedData.NewP !== undefined && extractedData.PostName !== undefined) {
                        diffP = extractedData.NewP - parsedRecord.OldP;
                        const cond_NewTime_gt_OldTime = extractedData.NewTime > parsedRecord.OldTime;
                        const cond_isNotLoggedInOrNoLoginData = !LoginData || Object.keys(LoginData).length === 0;
                        const cond_diffP_gt_1 = diffP > 1;
                        const cond_postNameNotUser = LoginData && LoginData.username ? extractedData.PostName !== LoginData.username : true;
                        overallCondition = cond_NewTime_gt_OldTime && (cond_isNotLoggedInOrNoLoginData || cond_diffP_gt_1 || cond_postNameNotUser);
                        if (overallCondition) {
                            if (rule.ifConditionMet.setOpenUrl) {
                                let oldPPlus1 = parsedRecord.OldP + 1;
                                OpenURL['default'] = rule.ifConditionMet.setOpenUrl.replace('{extracted.PID}', extractedData.PID || '').replace('{OldPplus1}', oldPPlus1.toString());
                            }
                            if (rule.ifConditionMet.setShowMessage) ShowMessage['default'] = rule.ifConditionMet.setShowMessage.replace('{diffP}', diffP.toString());
                        }
                    }
                } else if (rule.comparison && rule.comparison.type === "GREATER_THAN_RECORD" && tempNewRecordValueForUpdate !== undefined && typeof ruleScopedUpdatedRecord === 'number') {
                    if (tempNewRecordValueForUpdate > ruleScopedUpdatedRecord) {
                        overallCondition = true;
                        if (rule.ifConditionMet.setOpenUrl) {
                            let ptidMatch = PageData.match(/thread-([^-]+)-/); let ptid = ptidMatch ? ptidMatch[1] : '';
                            let recordPlus2 = ruleScopedUpdatedRecord + 2;
                            OpenURL['default'] = rule.ifConditionMet.setOpenUrl.replace('{ptid}', ptid).replace('{recordPlus2}', recordPlus2.toString());
                        }
                        if (rule.ifConditionMet.setShowMessage) {
                            let diff = tempNewRecordValueForUpdate - ruleScopedUpdatedRecord;
                            ShowMessage['default'] = rule.ifConditionMet.setShowMessage.replace('{ServerName}', ServerName).replace('{PathName}', PathName).replace('{diff}', diff.toString());
                        }
                    }
                }

                // Record update logic
                if (rule.ifConditionMet && rule.ifConditionMet.updateRecordOnlyOnConditionMet) {
                    if (overallCondition && rule.ifConditionMet.updateRecordFormat) {
                        let newFormattedRecord = rule.ifConditionMet.updateRecordFormat;
                        for(const key in extractedData) newFormattedRecord = newFormattedRecord.replace(`{extracted.${key}}`, extractedData[key]);
                        finalRecordValue = newFormattedRecord;
                    }
                    // If condition not met, finalRecordValue remains ruleScopedUpdatedRecord (i.e. original or initialized)
                } else if (rule.ifConditionMet && rule.ifConditionMet.updateRecordTo === "extractedValue") { // For rules 1,2,3,5
                    const sourceVal = rule.ifConditionMet.updateSource ? extractedData[rule.ifConditionMet.updateSource] : tempNewRecordValueForUpdate;
                    if (sourceVal !== undefined) finalRecordValue = sourceVal;
                }

            } else {
                if (rule.fallbackLoginCheckSelector) {
                    if (JData.find(rule.fallbackLoginCheckSelector).length > 0) Login = true;
                }
            }
        } else if (rule.type === "DAILY_LOGIN_CHECK") {
            let todayDate = (new Date()).getDate();
            // Ensure ruleScopedUpdatedRecord is a number for comparison
            // It should have been converted to a number at the start of the rule processing if not a tuple.
            let numericRecord = typeof ruleScopedUpdatedRecord === 'number' ? ruleScopedUpdatedRecord : parseFloat(ruleScopedUpdatedRecord);
            if (isNaN(numericRecord)) numericRecord = 0;

            let conditionMet = false;
            if (rule.condition === "RECORD_NOT_EQUALS_TODAY") {
                if (numericRecord !== todayDate) {
                    conditionMet = true;
                }
            }

            if (conditionMet && rule.ifConditionMet && rule.ifConditionMet.setOpenUrl) {
                let urlToSet = rule.ifConditionMet.setOpenUrl;
                if (Array.isArray(urlToSet)) {
                    OpenURL['default'] = urlToSet[0];
                } else {
                    OpenURL['default'] = urlToSet;
                }
            }

            if (rule.updateRecordTo === "TODAY") {
                finalRecordValue = todayDate;
            }
        }
    }
    return {
        'Login': Login,
        'Record': finalRecordValue,
        'OpenURL': OpenURL,
        'ShowMessage': ShowMessage
    };
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
				var currentDataItem = DataItem.Get(); // Get DataItem once
				$.extend(ThisOption, this.Option, currentDataItem.Execution[ExecutionID].Option);

				var ServerName = currentDataItem.Server[this.Server].Name;
				var PathName = currentDataItem.Server[this.Server].Path[this.Path].Name;
				var Record = currentDataItem.Server[this.Server].Path[this.Path].Execution[ExecutionID]; // This is the current record for this rule
				var loginDataForEval = (currentDataItem.Server[this.Server].LoginData.Data ? currentDataItem.Server[this.Server].LoginData.Data : undefined); // Renamed to loginDataForEval for clarity in this scope
				var JData = $(PageData.replace(/ src=[^ >]+/g, ""));

				var ReturnData;
				var evalRecord = Record; // evalRecord will be passed to processRuleEngine or used by eval.

				if (ExecutionID === '0') {
					ReturnData = processRuleEngine(currentDataItem.Execution[ExecutionID].rules, JData, PageData, this.Server, ServerName, PathName, evalRecord, loginDataForEval);
				} else if (ExecutionID === '1') {
					ReturnData = processRuleEngine(currentDataItem.Execution[ExecutionID].rules, JData, PageData, this.Server, ServerName, PathName, evalRecord, loginDataForEval);
				} else if (ExecutionID === '2') {
					ReturnData = processRuleEngine(currentDataItem.Execution[ExecutionID].rules, JData, PageData, this.Server, ServerName, PathName, evalRecord, loginDataForEval);
				} else if (ExecutionID === '3') {
					ReturnData = processRuleEngine(currentDataItem.Execution[ExecutionID].rules, JData, PageData, this.Server, ServerName, PathName, evalRecord, loginDataForEval);
				} else if (ExecutionID === '4') {
					ReturnData = processRuleEngine(currentDataItem.Execution[ExecutionID].rules, JData, PageData, this.Server, ServerName, PathName, evalRecord, loginDataForEval);
				} else if (ExecutionID === '5') {
					ReturnData = processRuleEngine(currentDataItem.Execution[ExecutionID].rules, JData, PageData, this.Server, ServerName, PathName, evalRecord, loginDataForEval);
				} else if (ExecutionID === '6') {
					ReturnData = processRuleEngine(currentDataItem.Execution[ExecutionID].rules, JData, PageData, this.Server, ServerName, PathName, evalRecord, loginDataForEval);
				}
				// All rules should now be handled by processRuleEngine

				Log_('檢查結果：' + this.Server + this.Path + '_' + ExecutionID + '\r\n　　　　　' + JSON.stringify(ReturnData));
				if (ReturnData.Login) {
					Log_('需要登入：' + this.Server + this.Path + '_' + ExecutionID);
					Login(this.Server, this.Path, ExecutionID);
				}
				else {
					// ReturnData.Record contains the updated Record value, whether from processSpecificRule_0 or eval.
					// This updated Record needs to be saved back to the DataItem.
					currentDataItem.Server[this.Server].Path[this.Path].Execution[ExecutionID] = ReturnData.Record;

					// Create a new object for AddRemind, excluding Login and Record properties
					var remindPayload = {};
					for (var key in ReturnData) {
						if (key !== 'Login' && key !== 'Record') {
							remindPayload[key] = ReturnData[key];
						}
					}
					Scheduling.AddQuery(this.Server, this.Path, ExecutionID, ThisOption.Frequency);
					Scheduling.AddRemind(this.Server, this.Path, ExecutionID, remindPayload, ThisOption);
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
		// $('#sounds').empty();
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
		chrome.action.setPopup({ popup: '' });
		chrome.action.setIcon({ path: "icons/NewMessages.png" });
		chrome.action.setTitle({ title: "有新訊息" });
		if (ClickTemp.Animation) Animation();
	}
	else {
		delete ClickTemp;
		chrome.action.setPopup({ popup: 'popup.html' });
		chrome.action.setIcon({ path: "icons/Silent.png" });
		chrome.action.setTitle({ title: "無訊息" });
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