(async()=>{
	while (document.readyState !== 'complete') await new Promise(r=>setTimeout(r,100));

	let screen1cont = document.getElementById('screen1_maincontainer');
	let screen2cont = document.getElementById('screen2_maincontainer');
	let signoutSuccessCont = document.getElementById('signout_success_container');
	let signinSuccessCont = document.getElementById('signin_success_container');

	let sidInput = document.getElementById('studentid-input');

	while (sidInput.value == '' || sidInput.value.length < 5) {
		if (document.activeElement !== sidInput) {
			sidInput.focus();
		}
		await new Promise(r=>setTimeout(r,100))
	}

	let studentId = Number(sidInput.value);

	function isSignedOut(){
		return new Promise((resolve,reject)=>{
			fetch(`/signout-status?id=${studentId}`).then(r=>{
				if (r.status!==200) {
					reject('Unknown error.');
				} else {
					r.text().then(signedOut=>{
						resolve(signedOut == 'true');
					})
				}
			}).catch(e=>{
				reject(e);
			})
		})
	}

	let isSigningIn;

	isSignedOut().then(signedOut=>{
		console.log(`Signed out: ${signedOut}`);
		isSigningIn = signedOut;
	}).catch(e=>{
		alert('An error occured.');
		window.location.reload();
	})

	while (isSigningIn==null) {
		await new Promise(r=>setTimeout(r,100))
	}

	function loadDstSelectScreen(){
		screen1cont.hidden = true;
		screen2cont.hidden = false;
	}

	function loadSignInSuccessScreen(){
		screen1cont.hidden = true;
		signinSuccessCont.hidden = false;
		setTimeout(() => {
			signinSuccessCont.hidden = true;
			window.location.reload();
		}, 2000);
	}

	function loadSignOutSuccessScreen(){
		screen2cont.hidden = true;
		signoutSuccessCont.hidden = false;
		setTimeout(() => {
			signoutSuccessCont.hidden = true;
			window.location.reload();
		}, 5000);
	}

	function onScreen2Loaded() {
		let btns = document.getElementsByClassName('dstBtn');
		for (let i = 0; i < btns.length; i++) {
			const btn = btns[i];
			btn.onclick = ()=>{
				fetch(`/signout?id=${studentId}&dst=${encodeURIComponent(btn.innerText)}`).then(r=>{
					if(r.status!==200){
						alert('Error signing out.');
						window.location.reload();
					}else{
						loadSignOutSuccessScreen();
					}
				})
			}
		}
	}

	if (isSigningIn) {
		fetch(`/signin?id=${studentId}`).then(r=>{
			if (r.status!==200) {
				alert('Failed to sign in.');
				window.location.reload();
			} else {
				loadSignInSuccessScreen();
			}
		})
	} else {
		loadDstSelectScreen();
		onScreen2Loaded();
	}
})()