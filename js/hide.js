var password = ""
function hide() {
    $(".hide").hide();
}

function verifyStart() {
    function verify(password) {
        var result = false;
        $.getJSON("json/password-digest.json", function(data) {
            console.log(data);
            console.log(sm3Digest(password));
            if (sm3Digest(password) == data["password-digest"]) {
            console.log("right!")
                result = true;
            }
        });
        console.log(result)
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