// NPM Modules
const express = require('express');
const fs = require('fs');

// Logs
const statuslogs = require('./lib/statuslogs');

// Express
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.static('public'));

app.listen(PORT,()=>{
	console.log(`listening at port ${PORT}.`);
});

app.get('/signout-status',async(req,res)=>{
	const {id} = req.query;
	if(!id)return res.sendStatus(404);
	let isSignedOut = statuslogs.isSignedOut(Number(id));
	return res.send(isSignedOut ? true : false);
})

app.get('/signout',async(req,res)=>{
	const {id,dst} = req.query;
	if(!id)return res.sendStatus(404);
	statuslogs.addLog(Number(id),'Signout',String(dst));
	return res.sendStatus(200);
})

app.get('/signin',async(req,res)=>{
	const {id} = req.query;
	if(!id)return res.sendStatus(404);
	statuslogs.addLog(Number(id),'Signin','');
	return res.sendStatus(200);
})