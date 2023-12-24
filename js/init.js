var password = "";
var token = "";
var page = 0;
var idArr = ["#menu", "#header", "#page-content", "#footer"];
var pagination = null;
function init() {
	hide(idArr);
}

function verifyStart() {
    $.getJSON("json/info.json", function(data) {
        password = $('#password').val();
        if (CryptoJS.SHA256(password).toString() == data["password-digest"]) {
            token = CryptoJS.AES.decrypt(data["token-encrypt"], CryptoJS.MD5(password).toString(), {"mode": CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8);
			pagination = new Pagination({
				container: '.page',
				size: 16,
				pageNo: 1,
				total: data["page"] * 16
			})
			show(idArr);
            $("#verify-card").fadeOut();
			getImgs(1);
        } else {
            window.alert("密码验证错误！")
        }
    });
}

function hide(idArr) {
	for (let id of idArr) {
		$(id).fadeOut()
	}
}

function show(idArr) {
	for (let id of idArr) {
		$(id).fadeIn()
	}
}


init();