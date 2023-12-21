var password = ""
function hide() {
    $(".hide").hide();
}

function verifyStart() {
    function verify(password) {
        var result = false;
        $.getJSON("json/password-digest.json?callback=?", function(data) {
            console.log(data);
            console.log(sm3Digest(password));
            if (sm3Digest(password) == data["password-digest"]) {
                result = true;
            }
        });
        return result;
    }
    password = $('#password').val();
    if(verify(password)){
        $(".hide").show();
        $(".verify-card").hide();
    } else {
        window.alert("密码验证错误！")
    }
}

hide();