var password = ""
function hide() {
    $(".hide").hide();
}

function verifyStart() {
    $.getJSON("json/password-digest.json", function(data) {
        password = $('#password').val();
        if (sm3Digest(password) == data["password-digest"]) {
            $(".hide").show();
            $(".verify-card").hide();
        } else {
            window.alert("密码验证错误！")
        }
    });
}

hide();