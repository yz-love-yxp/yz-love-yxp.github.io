var sk = "";
var token = "";
var page = 0;
var sha = "";
var idArr = ["#menu", "#header", "#page-content", "#footer"];
var pagination = null;
var pageData = null;
var dePageData = [];
var nowClick = 0;
var nowImg = "";
function init() {
	hide(idArr);
	bindUpload();
}

function verifyStart() {
    $.getJSON("json/info.json", function(data) {
        let password = $('#password').val();
        if (CryptoJS.SHA256(password).toString() == data["password-digest"]) {
			sk = CryptoJS.MD5(password).toString();
            token = CryptoJS.AES.decrypt(data["token-encrypt"], sk, {"mode": CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8);
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

function bindUpload() {
	$("#newFile").change(function(e){
	    var file = e.target.files[0];
	    var reader = new FileReader();
	    reader.readAsDataURL(file); //读出 base64
	    reader.onloadend = function () {
	        nowImg = "data:" + file.type + ";base64," + reader.result.substring(reader.result.indexOf(",")+1)
	    };
	});
}

init();