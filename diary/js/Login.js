window.onload = function () {
    $('#loading_div').hide();
}
function enter() {
    if (event.keyCode == 13) {
        var user = document.getElementById("user").value;
        var password = document.getElementById("password").value;
        if (user == "") alert("用户名不能为空");
        else if (password == "") alert("密码不能为空");
        else {
            $('#loading_div').show();
            document.getElementById('login_button').disabled = true;
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("post", "Server.aspx?user=" + user + "&password=" +
                        password + "&login=1");
            //设置回调函数
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    $('#loading_div').hide();
                    document.getElementById('login_button').disabled = false;
                    if (xmlHttp.responseText == "登录成功") {
                        window.open("log.html", "_parent");
                    }
                    else
                        alert(xmlHttp.responseText);

                    //document.getElementById("price").value = xmlHttp.responseText;
                }
            }
            //发送请求
            xmlHttp.send(null);
        }
    }
}
function login() {
    var user = document.getElementById("user").value;
    var password = document.getElementById("password").value;
    if (user == "") alert("用户名不能为空");
    else if (password == "") alert("密码不能为空");
    else {
        $('#loading_div').show();
        document.getElementById('login_button').disabled = true;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("post", "Server.aspx?user=" + user + "&password=" +
                    password + "&login=1");
        //设置回调函数
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                $('#loading_div').hide();
                document.getElementById('login_button').disabled = false;
                if (xmlHttp.responseText == "登录成功") {
                    window.open("log.html", "_parent");
                }
                else
                    alert(xmlHttp.responseText);
            }
        }
        //发送请求
        xmlHttp.send(null);
    }
}
