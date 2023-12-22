var password = "";
var idArr = ["#menu", "#header", "#page-content", "#footer"];
function hide() {
	fadeOut(idArr);
}

function verifyStart() {
    $.getJSON("json/password-digest.json", function(data) {
        password = $('#password').val();
        if (CryptoJS.SHA256(password).toString() == data["password-digest"]) {
            fadeIn(idArr);
            $("#verify-card").fadeOut();
			getImgs(1);
			main();
        } else {
            window.alert("密码验证错误！")
        }
    });
}

function fadeOut(idArr) {
	for (let id of idArr) {
		$(id).fadeOut()
	}
}

function fadeIn(idArr) {
	for (let id of idArr) {
		$(id).fadeIn()
	}
}


hide();