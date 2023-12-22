function getImgs(page) {
	$.getJSON("json/img"+page+".json", function(data) {
	    var imgs = data["imgs"];
		for (let i = 0; i < imgs.length; i++) {
			$("#img1").attr("src", CryptoJS.AES.decrypt(imgs[i]["de-img"], CryptoJS.MD5(password).toString(), {"mode": CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8))
			$("#home-title1").text(CryptoJS.AES.decrypt(imgs[i]["title"], CryptoJS.MD5(password).toString(), {"mode": CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8))
			$("#home-subtitle1").text(imgs[i]["time"] + " " + CryptoJS.AES.decrypt(imgs[i]["address"], CryptoJS.MD5(password).toString(), {"mode": CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8))
		}
	});
}
