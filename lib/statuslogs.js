const fs = require('fs');

let logs = require('../data/student/statuslogs.json');

function updateLogs() {
	fs.writeFileSync(`${__dirname}/../data/student/statuslogs.json`,JSON.stringify(logs,null,'\t'),{encoding:'utf-8'});
}

function addLog(id,action,dst){
	let user = logs.find(u=>u.ID===id);
	if(!user){
		user = {
			ID: id,
			Logs: []
		}
		logs.push(user);
	}
	user.Logs.push({
		Action: action,
		Destination: dst,
		Timestamp: new Date()
	})
	updateLogs();
}

function isSignedOut(id) {
	let user = logs.find(u=>u.ID===id);
	if(!user){
		return false
	};
	let userLogs = user.Logs;
	let latestLog = userLogs.length > 0 ? userLogs[userLogs.length-1] : null;
	if(!latestLog||latestLog.Action=='Signin'){
		return false
	};
	if(latestLog.Action=='Signout'){
		return true
	};
	return false;
}

exports.addLog = addLog;
exports.isSignedOut = isSignedOut;